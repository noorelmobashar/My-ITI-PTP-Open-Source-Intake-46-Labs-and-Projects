import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";



const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const { socket } = useSocket();
  const { user } = useAuth();

  // ---- Fetch all chats for the current user ----
  const fetchChats = useCallback(async () => {
    try {
      setLoadingChats(true);
      const res = await api.get("/chats");
      setChats(res.data);

      // Tell Socket.IO to join all chat rooms
      if (socket) {
        const chatIds = res.data.map((chat) => chat._id);
        socket.emit("join-chats", chatIds);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoadingChats(false);
    }
  }, [socket]);

  // ---- Fetch messages for a specific chat ----
  const fetchMessages = useCallback(async (chatId) => {
    try {
      setLoadingMessages(true);
      const res = await api.get(`/messages/${chatId}`);
      // Optimistically add our ID to seenBy for messages from other users
      const currentUserId = user?.id || user?._id;
      const updatedMessages = res.data.map((m) => {
        if (m.senderId._id !== currentUserId && !m.seenBy?.includes(currentUserId)) {
          return { ...m, seenBy: [...(m.seenBy || []), currentUserId] };
        }
        return m;
      });
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, [user]);

  // ---- Mark messages as read ----
  const markMessagesAsRead = useCallback(
    async (chatId) => {
      try {
        await api.put(`/messages/read/${chatId}`);
        
        // Reset unread count for this chat in local state
        setChats((prev) =>
          prev.map((c) => (c._id === chatId ? { ...c, unreadCount: 0 } : c))
        );

        if (socket && user) {
          socket.emit("read-messages", { chatId, userId: user.id });
        }
      } catch (err) {
        console.error("Error marking messages as read:", err);
      }
    },
    [socket, user]
  );

  // ---- Select a chat and load its messages ----
  const selectChat = useCallback(
    (chat) => {
      setActiveChat(chat);
      if (chat) {
        fetchMessages(chat._id);
        markMessagesAsRead(chat._id);
      } else {
        setMessages([]);
      }
    },
    [fetchMessages, markMessagesAsRead]
  );

  // ---- Send a message ----
  const sendMessage = useCallback(
    async (chatId, content, mediaUrl = "", mediaType = "none") => {
      try {
        // 1. Save to database via REST API
        const res = await api.post("/messages", { chatId, content, mediaUrl, mediaType });

        // 2. Emit via Socket.IO for real-time delivery
        if (socket) {
          socket.emit("send-message", {
            chatId,
            message: res.data,
          });
        }

        return res.data;
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      }
    },
    [socket]
  );

  // ---- Edit a message ----
  const editMessage = useCallback(
    async (messageId, content) => {
      try {
        const res = await api.put(`/messages/${messageId}`, { content });
        const updatedMessage = res.data;

        // Update local state immediately for the sender
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? updatedMessage : m))
        );

        // Broadcast to socket room
        if (socket) {
          socket.emit("edit-message", {
            chatId: updatedMessage.chatId,
            message: updatedMessage,
          });
        }
        return updatedMessage;
      } catch (error) {
        console.error("Error editing message:", error);
        throw error;
      }
    },
    [socket]
  );

  // ---- Delete a message ----
  const deleteMessage = useCallback(
    async (messageId) => {
      try {
        const res = await api.delete(`/messages/${messageId}`);
        const deletedMessage = res.data;

        // Update local state immediately for the sender
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? deletedMessage : m))
        );

        // Also update the chat list last message preview if needed
        setChats((prev) =>
          prev.map((chat) => {
            if (chat._id === deletedMessage.chatId && chat.lastMessage?._id === messageId) {
              return { ...chat, lastMessage: deletedMessage };
            }
            return chat;
          })
        );

        // Broadcast to socket room
        if (socket) {
          socket.emit("delete-message", {
            chatId: deletedMessage.chatId,
            message: deletedMessage,
          });
        }
        return deletedMessage;
      } catch (error) {
        console.error("Error deleting message:", error);
        throw error;
      }
    },
    [socket]
  );

  // ---- Create a new chat ----
  const createChat = useCallback(
    async (chatData) => {
      try {
        const res = await api.post("/chats", chatData);
        const newChat = res.data;

        // Add the new chat to our local state
        setChats((prev) => [newChat, ...prev]);

        // Join the Socket.IO room for this new chat
        if (socket) {
          socket.emit("join-chat", newChat._id);

          // Notify other participants about the new chat
          const participantIds = newChat.participants
            .map((p) => p._id)
            .filter((id) => id !== user?.id);
          socket.emit("new-chat-created", {
            chat: newChat,
            participantIds,
          });
        }

        return newChat;
      } catch (error) {
        console.error("Error creating chat:", error);
        throw error;
      }
    },
    [socket, user]
  );

  // ---- Load chats when user is available ----
  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user, fetchChats]);

  // ---- Listen for real-time events ----
  useEffect(() => {
    if (!socket) return;

    // When a new message arrives in any chat
    const handleReceiveMessage = ({ chatId, message }) => {
      const isSenderCurrent = message.senderId._id === user?.id || message.senderId === user?.id;

      // If this message is for the currently active chat, add it to messages
      if (activeChat && activeChat._id === chatId) {
        setMessages((prev) => {
          // Avoid duplicates (in case sender also receives their own message)
          const exists = prev.some((m) => m._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });

        // Mark as read immediately on server/socket if it's sent by someone else
        if (!isSenderCurrent) {
          markMessagesAsRead(chatId);
        }
      }

      // Update the last message in the chat list
      setChats((prev) => {
        const updated = prev.map((chat) => {
          if (chat._id === chatId) {
            let unreadCount = chat.unreadCount || 0;
            if (activeChat && activeChat._id === chatId) {
              unreadCount = 0;
            } else if (!isSenderCurrent) {
              unreadCount += 1;
            }
            return {
              ...chat,
              lastMessage: message,
              unreadCount,
            };
          }
          return chat;
        });

        // Re-sort: move the chat with the new message to the top
        updated.sort((a, b) => {
          const timeA = a.lastMessage
            ? new Date(a.lastMessage.createdAt)
            : new Date(a.createdAt);
          const timeB = b.lastMessage
            ? new Date(b.lastMessage.createdAt)
            : new Date(b.createdAt);
          return timeB - timeA;
        });

        return updated;
      });
    };

    // When someone reads the messages in a chat
    const handleReceiveMessagesRead = ({ chatId, userId }) => {
      // If we are currently viewing this chat, update our local messages seenBy
      if (activeChat && activeChat._id === chatId) {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.senderId._id !== userId && m.senderId !== userId && !m.seenBy?.includes(userId)) {
              return { ...m, seenBy: [...(m.seenBy || []), userId] };
            }
            return m;
          })
        );
      }
    };

    // When someone creates a new chat that includes us
    const handleChatCreated = (chat) => {
      setChats((prev) => {
        // Don't add if already exists
        const exists = prev.some((c) => c._id === chat._id);
        if (exists) return prev;
        return [chat, ...prev];
      });

      // Join the room for this new chat
      socket.emit("join-chat", chat._id);
    };

    // When someone edits a message
    const handleReceiveMessageEdited = ({ chatId, message }) => {
      if (activeChat && activeChat._id === chatId) {
        setMessages((prev) =>
          prev.map((m) => (m._id === message._id ? message : m))
        );
      }
    };

    // When someone deletes a message
    const handleReceiveMessageDeleted = ({ chatId, message }) => {
      if (activeChat && activeChat._id === chatId) {
        setMessages((prev) =>
          prev.map((m) => (m._id === message._id ? message : m))
        );
      }

      // Also update the chat list last message preview if needed
      setChats((prev) =>
        prev.map((chat) => {
          if (chat._id === chatId && chat.lastMessage?._id === message._id) {
            return { ...chat, lastMessage: message };
          }
          return chat;
        })
      );
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("chat-created", handleChatCreated);
    socket.on("receive-message-edited", handleReceiveMessageEdited);
    socket.on("receive-message-deleted", handleReceiveMessageDeleted);
    socket.on("receive-messages-read", handleReceiveMessagesRead);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("chat-created", handleChatCreated);
      socket.off("receive-message-edited", handleReceiveMessageEdited);
      socket.off("receive-message-deleted", handleReceiveMessageDeleted);
      socket.off("receive-messages-read", handleReceiveMessagesRead);
    };
  }, [socket, activeChat, user, markMessagesAsRead]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        messages,
        loadingChats,
        loadingMessages,
        selectChat,
        sendMessage,
        editMessage,
        deleteMessage,
        createChat,
        fetchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
