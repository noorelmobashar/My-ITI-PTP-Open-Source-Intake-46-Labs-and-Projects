import { useState } from "react";
import api from "../utils/api";
import { useChat } from "../context/ChatContext";

// =============================================
// UserSearch
// Search for users by username to start a private chat.
// Displayed in the sidebar search area.
// =============================================

const UserSearch = ({ onChatCreated }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { createChat, selectChat } = useChat();

  const handleSearch = async (value) => {
    setQuery(value);

    if (value.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    try {
      const res = await api.get(`/users/search?username=${value}`);
      setResults(res.data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = async (selectedUser) => {
    try {
      // Create (or get existing) private chat with this user
      const chat = await createChat({ participantId: selectedUser._id });
      selectChat(chat);
      setQuery("");
      setResults([]);
      setShowResults(false);
      if (onChatCreated) onChatCreated();
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <div className="search-wrapper">
      <div className="search-container">
        <div className="search-input-wrapper">
          {/* Search Icon */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search users by username..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="user-search-results">
          {results.map((u) => (
            <div
              key={u._id}
              className="user-list-item"
              onClick={() => handleSelectUser(u)}
            >
              <div className="user-list-avatar">
                {u.firstName?.charAt(0)?.toUpperCase() || "?"}
                {u.lastName?.charAt(0)?.toUpperCase() || ""}
              </div>
              <div className="user-list-info">
                <div className="user-list-name">
                  {u.firstName} {u.lastName}
                </div>
                <div className="user-list-username">@{u.username}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !searching && (
        <div className="user-search-results">
          <div className="chat-list-empty" style={{ padding: "20px" }}>
            <p className="text-secondary text-sm">No users found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
