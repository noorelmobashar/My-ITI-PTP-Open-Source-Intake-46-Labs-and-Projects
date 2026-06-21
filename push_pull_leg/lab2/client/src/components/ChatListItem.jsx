import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

// =============================================
// ChatListItem
// Displays a single chat in the sidebar list.
// Shows avatar, name, last message preview, and timestamp.
// =============================================

const ChatListItem = ({ chat }) => {
  const { user } = useAuth();
  const { activeChat, selectChat } = useChat();

  // Determine the chat name and avatar initials
  const getChatName = () => {
    if (chat.type === "group") return chat.groupName;

    // For private chats, show the other participant's name
    const otherUser = chat.participants?.find((p) => p._id !== user?.id);
    return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Unknown";
  };

  const getInitials = () => {
    if (chat.type === "group") {
      return chat.groupName?.charAt(0)?.toUpperCase() || "G";
    }
    const otherUser = chat.participants?.find((p) => p._id !== user?.id);
    if (otherUser) {
      return `${otherUser.firstName?.charAt(0) || ""}${otherUser.lastName?.charAt(0) || ""}`.toUpperCase();
    }
    return "?";
  };

  // Format the timestamp for the last message
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    // If today, show time
    if (diff < 86400000 && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    // If yesterday
    if (diff < 172800000) return "Yesterday";

    // Otherwise show date
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Get last message preview text
  const getPreview = () => {
    if (!chat.lastMessage) return "No messages yet";

    const sender = chat.lastMessage.senderId;
    const prefix =
      chat.type === "group" && sender
        ? `${sender.firstName || sender.username}: `
        : "";

    return `${prefix}${chat.lastMessage.content}`;
  };

  const isActive = activeChat?._id === chat._id;

  return (
    <div
      className={`chat-list-item ${isActive ? "active" : ""}`}
      onClick={() => selectChat(chat)}
    >
      <div className={`chat-list-avatar ${chat.type === "group" ? "group" : ""}`}>
        {getInitials()}
      </div>

      <div className="chat-list-info">
        <div className="chat-list-top">
          <span className="chat-list-name">{getChatName()}</span>
          <span className="chat-list-time">
            {formatTime(chat.lastMessage?.createdAt || chat.createdAt)}
          </span>
        </div>
        <div className="chat-list-bottom">
          <span className="chat-list-preview">{getPreview()}</span>
          {chat.unreadCount > 0 && (
            <span className="chat-list-unread-badge">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
