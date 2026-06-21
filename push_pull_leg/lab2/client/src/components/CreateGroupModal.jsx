import { useState } from "react";
import api from "../utils/api";
import { useChat } from "../context/ChatContext";

// =============================================
// CreateGroupModal
// Modal dialog for creating a new group chat.
// Features: group name input, user search,
// participant selection with chips.
// =============================================

const CreateGroupModal = ({ onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const { createChat, selectChat } = useChat();

  const handleSearch = async (value) => {
    setSearchQuery(value);

    if (value.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await api.get(`/users/search?username=${value}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const toggleUser = (user) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u._id === user._id);
      if (exists) {
        return prev.filter((u) => u._id !== user._id);
      }
      return [...prev, user];
    });
  };

  const removeUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  const handleCreate = async () => {
    if (!groupName.trim()) {
      setError("Please enter a group name");
      return;
    }
    if (selectedUsers.length < 1) {
      setError("Please select at least one participant");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const chat = await createChat({
        participants: selectedUsers.map((u) => u._id),
        groupName: groupName.trim(),
      });
      selectChat(chat);
      onClose();
    } catch (err) {
      setError("Failed to create group. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Create New Group</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Error */}
          {error && <div className="auth-error mb-3">{error}</div>}

          {/* Group Name */}
          <div className="form-group mb-3">
            <label>Group Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          {/* Selected Participants Chips */}
          {selectedUsers.length > 0 && (
            <div className="selected-chips">
              {selectedUsers.map((user) => (
                <div key={user._id} className="chip">
                  <span>{user.firstName} {user.lastName}</span>
                  <button
                    className="chip-remove"
                    onClick={() => removeUser(user._id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search Users */}
          <div className="form-group mb-3">
            <label>Add Participants</label>
            <input
              type="text"
              className="form-input"
              placeholder="Search users by username..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* User List */}
          <div className="user-list">
            {searchResults.map((user) => {
              const isSelected = selectedUsers.some((u) => u._id === user._id);

              return (
                <div
                  key={user._id}
                  className={`user-list-item ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleUser(user)}
                >
                  <div className="user-list-avatar">
                    {user.firstName?.charAt(0)?.toUpperCase() || "?"}
                    {user.lastName?.charAt(0)?.toUpperCase() || ""}
                  </div>
                  <div className="user-list-info">
                    <div className="user-list-name">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="user-list-username">@{user.username}</div>
                  </div>
                  <div className={`user-list-check ${isSelected ? "checked" : ""}`}>
                    {isSelected && "✓"}
                  </div>
                </div>
              );
            })}

            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <p className="text-secondary text-sm text-center mt-2">
                No users found
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleCreate}
            disabled={creating}
            style={{ marginTop: 0, padding: "10px 24px" }}
          >
            {creating ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
