import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

// =============================================
// ChatWindow
// The main chat area on the right side.
// Shows: chat header, messages, typing indicator,
// and message input.
//
// If no chat is selected, shows an empty state.
// =============================================

const ChatWindow = () => {
  const { user } = useAuth();
  const { activeChat, messages, loadingMessages, selectChat } = useChat();
  const { socket, onlineUsers } = useSocket();
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for typing indicators
  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ chatId, username }) => {
      if (activeChat && chatId === activeChat._id) {
        setTypingUser(username);
      }
    };

    const handleStopTyping = ({ chatId }) => {
      if (activeChat && chatId === activeChat._id) {
        setTypingUser(null);
      }
    };

    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);

    return () => {
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
    };
  }, [socket, activeChat]);

  // Clear typing indicator when switching chats
  useEffect(() => {
    setTypingUser(null);
  }, [activeChat]);

  // ---- Empty State (no chat selected) ----
  if (!activeChat) {
    return (
      <div className="chat-window">
        <div className="chat-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h3>WhatsApp Clone</h3>
          <p>
            Send and receive messages in real time. Search for a user or create a group
            to get started.
          </p>
        </div>
      </div>
    );
  }

  // ---- Get chat details ----
  const isGroup = activeChat.type === "group";

  const getChatName = () => {
    if (isGroup) return activeChat.groupName;
    const other = activeChat.participants?.find((p) => p._id !== user?.id);
    return other ? `${other.firstName} ${other.lastName}` : "Unknown";
  };

  const getInitials = () => {
    if (isGroup) return activeChat.groupName?.charAt(0)?.toUpperCase() || "G";
    const other = activeChat.participants?.find((p) => p._id !== user?.id);
    if (other) {
      return `${other.firstName?.charAt(0) || ""}${other.lastName?.charAt(0) || ""}`.toUpperCase();
    }
    return "?";
  };

  const getStatus = () => {
    if (isGroup) {
      const names = activeChat.participants
        ?.map((p) => (p._id === user?.id ? "You" : p.firstName))
        .join(", ");
      return names;
    }
    const other = activeChat.participants?.find((p) => p._id !== user?.id);
    if (other && onlineUsers.includes(other._id)) return "online";
    return "offline";
  };

  const status = getStatus();
  const isOnline = status === "online";

  // ---- Group messages by date ----
  const groupMessagesByDate = () => {
    const groups = [];
    let currentDate = null;

    messages.forEach((msg) => {
      const msgDate = new Date(msg.createdAt).toLocaleDateString();
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: msgDate, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });

    return groups;
  };

  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toLocaleDateString() === today.toLocaleDateString()) return "Today";
    if (date.toLocaleDateString() === yesterday.toLocaleDateString()) return "Yesterday";
    return date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  };

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-header">
        {/* Back button for mobile */}
        <button
          className="icon-btn"
          onClick={() => selectChat(null)}
          style={{ display: "none" }}
          id="back-btn-mobile"
        >
          ←
        </button>

        <div className={`chat-header-avatar ${isGroup ? "group" : ""}`}>
          {getInitials()}
        </div>

        <div className="chat-header-info">
          <div className="chat-header-name">{getChatName()}</div>
          <div className={`chat-header-status ${isOnline ? "online" : ""}`}>
            {isGroup ? status : isOnline ? "online" : "offline"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {loadingMessages ? (
          <div className="loading">
            <div className="spinner" />
            <span>Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-empty-state" style={{ opacity: 0.5 }}>
            <p>No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          groupMessagesByDate().map((group) => (
            <div key={group.date} className="message-group">
              <div className="message-date-separator">
                <span>{formatDateLabel(group.date)}</span>
              </div>
              {group.messages.map((msg) => (
                <MessageBubble
                  key={msg._id}
                  message={msg}
                  isGroupChat={isGroup}
                />
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingUser && (
        <div className="typing-indicator">{typingUser} is typing...</div>
      )}

      {/* Message Input */}
      <MessageInput chatId={activeChat._id} />
    </div>
  );
};

export default ChatWindow;
