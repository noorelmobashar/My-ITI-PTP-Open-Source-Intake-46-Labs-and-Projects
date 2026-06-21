import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import ChatListItem from "./ChatListItem";
import UserSearch from "./UserSearch";
import CreateGroupModal from "./CreateGroupModal";

// =============================================
// ChatList
// Sidebar component showing all conversations.
// Features: search users, create group, chat list.
// =============================================

const ChatList = () => {
  const [showGroupModal, setShowGroupModal] = useState(false);
  const { user, logout } = useAuth();
  const { chats, loadingChats } = useChat();

  // Get the user's initials for the avatar
  const initials = user
    ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
    : "?";

  return (
    <div className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-header-left">
          <div className="user-avatar">{initials}</div>
          <h2>{user?.firstName || "Chat"}</h2>
        </div>
        <div className="sidebar-header-actions">
          {/* New Group Button */}
          <button
            className="icon-btn action-create-group"
            title="Create Group"
            onClick={() => setShowGroupModal(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </button>
          {/* Logout Button */}
          <button 
            className="icon-btn action-logout" 
            title="Logout" 
            onClick={logout}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Users */}
      <UserSearch />

      {/* Chat List */}
      <div className="chat-list">
        {loadingChats ? (
          <div className="loading">
            <div className="spinner" />
            <span>Loading chats...</span>
          </div>
        ) : chats.length === 0 ? (
          <div className="chat-list-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>No chats yet</p>
            <p className="text-sm text-secondary">
              Search for a user above to start chatting!
            </p>
          </div>
        ) : (
          chats.map((chat) => <ChatListItem key={chat._id} chat={chat} />)
        )}
      </div>

      {/* Create Group Modal */}
      {showGroupModal && (
        <CreateGroupModal onClose={() => setShowGroupModal(false)} />
      )}
    </div>
  );
};

export default ChatList;
