import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";

// Custom Audio Player component for voice records
const CustomAudioPlayer = ({ src }) => {
  const audioRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatAudioTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="custom-audio-player">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <button type="button" className="audio-play-btn" onClick={togglePlay}>
        {isPlaying ? (
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <div className="audio-slider-container">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="audio-seek-slider"
        />
        <div className="audio-time-info">
          <span>{formatAudioTime(currentTime)}</span>
          <span>{formatAudioTime(duration)}</span>
        </div>
      </div>
      <div className="audio-mic-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        </svg>
      </div>
    </div>
  );
};

const MessageBubble = ({ message, isGroupChat }) => {
  const { user } = useAuth();
  const { editMessage, deleteMessage, activeChat } = useChat();
  const { onlineUsers } = useSocket();
  
  const isOutgoing = (message.senderId?._id || message.senderId) === (user?.id || user?._id);

  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(message.content);

  const senderName = message.senderId
    ? `${message.senderId.firstName || ""} ${message.senderId.lastName || ""}`.trim() || message.senderId.username
    : "Unknown User";

  const renderTicks = () => {
    if (!isOutgoing) return null;

    const currentUserId = user?.id || user?._id;
    const seenByOthers = message.seenBy?.filter((id) => id !== currentUserId) || [];

    let isRead = false;
    let isDelivered = false;

    if (isGroupChat) {
      const totalParticipants = activeChat?.participants?.length || 2;
      const expectedReaders = totalParticipants - 1;
      
      if (seenByOthers.length >= expectedReaders && expectedReaders > 0) {
        isRead = true;
      }
      isDelivered = true;
    } else {
      const otherParticipant = activeChat?.participants?.find(
        (p) => (p._id || p) !== currentUserId
      );
      const otherParticipantId = otherParticipant?._id || otherParticipant;

      if (otherParticipantId) {
        const hasSeen = message.seenBy?.includes(otherParticipantId);
        if (hasSeen) {
          isRead = true;
        } else {
          const isOtherOnline = onlineUsers?.includes(otherParticipantId);
          if (isOtherOnline) {
            isDelivered = true;
          }
        }
      } else {
        if (seenByOthers.length > 0) {
          isRead = true;
        }
      }
    }

    if (isRead) {
      return (
        <span className="message-ticks read" style={{ marginLeft: '4px', display: 'inline-flex', alignItems: 'center' }}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" style={{ color: '#53bdeb' }}>
            <path d="M0.293,12.293c0.391-0.391,1.023-0.391,1.414,0l4.586,4.586L18.293,4.879c0.391-0.391,1.023-0.391,1.414,0 c0.391,0.391,0.391,1.023,0,1.414l-13,13c-0.391,0.391-1.023,0.391-1.414,0L0.293,13.707C-0.098,13.316-0.098,12.684,0.293,12.293z"/>
            <path d="M6,17.586l4.293-4.293c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414l-5,5c-0.391,0.391-1.023,0.391-1.414,0 L6,17.586z" transform="translate(6, -6)"/>
          </svg>
        </span>
      );
    }

    if (isDelivered) {
      return (
        <span className="message-ticks delivered" style={{ marginLeft: '4px', display: 'inline-flex', alignItems: 'center' }}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" style={{ color: 'var(--text-secondary)' }}>
            <path d="M0.293,12.293c0.391-0.391,1.023-0.391,1.414,0l4.586,4.586L18.293,4.879c0.391-0.391,1.023-0.391,1.414,0 c0.391,0.391,0.391,1.023,0,1.414l-13,13c-0.391,0.391-1.023,0.391-1.414,0L0.293,13.707C-0.098,13.316-0.098,12.684,0.293,12.293z"/>
            <path d="M6,17.586l4.293-4.293c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414l-5,5c-0.391,0.391-1.023,0.391-1.414,0 L6,17.586z" transform="translate(6, -6)"/>
          </svg>
        </span>
      );
    }

    return (
      <span className="message-ticks sent" style={{ marginLeft: '4px', display: 'inline-flex', alignItems: 'center' }}>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" style={{ color: 'var(--text-secondary)' }}>
          <path d="M0.293,12.293c0.391-0.391,1.023-0.391,1.414,0l4.586,4.586L18.293,4.879c0.391-0.391,1.023-0.391,1.414,0 c0.391,0.391,0.391,1.023,0,1.414l-13,13c-0.391,0.391-1.023,0.391-1.414,0L0.293,13.707C-0.098,13.316-0.098,12.684,0.293,12.293z"/>
        </svg>
      </span>
    );
  };

  // Helper to format timestamps: "HH:MM"
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleEdit = async () => {
    if (!editVal.trim()) return;
    try {
      await editMessage(message._id, editVal.trim());
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to edit message:", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteMessage(message._id);
      } catch (err) {
        console.error("Failed to delete message:", err);
      }
    }
  };

  // Extract filename from URL
  const getFileName = (url) => {
    if (!url) return "file";
    const parts = url.split("/");
    const filenameWithPrefix = parts[parts.length - 1];
    // Remove the multer timestamp prefix if possible for cleaner UI (e.g. file-1718900000-name.ext -> name.ext)
    const match = filenameWithPrefix.match(/^file-\d+-\d+-(.+)$/);
    return match ? match[1] : filenameWithPrefix;
  };

  if (message.isDeleted) {
    return (
      <div className={`message-bubble ${isOutgoing ? "message-outgoing" : "message-incoming"}`}>
        {isGroupChat && !isOutgoing && (
          <div className="message-sender-name">{senderName}</div>
        )}
        <div className="message-content message-deleted-text" style={{ fontStyle: "italic", opacity: 0.6, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
          This message was deleted
        </div>
        <div className="message-timestamp">{formatTime(message.createdAt)}</div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className={`message-bubble ${isOutgoing ? "message-outgoing" : "message-incoming"}`}>
        <div className="message-edit-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
          <input
            type="text"
            className="message-edit-input"
            value={editVal}
            onChange={(e) => setEditVal(e.target.value)}
            style={{
              background: 'var(--bg-input)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '14px',
              width: '100%'
            }}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEdit();
              if (e.key === "Escape") setIsEditing(false);
            }}
          />
          <div className="message-edit-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={() => setIsEditing(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px' }}
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              style={{ background: 'var(--primary)', border: 'none', borderRadius: '4px', padding: '4px 10px', color: '#111b21', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
            >
              Save
            </button>
          </div>
        </div>
        <div className="message-timestamp">{formatTime(message.createdAt)}</div>
      </div>
    );
  }

  return (
    <div 
      className={`message-bubble ${isOutgoing ? "message-outgoing" : "message-incoming"}`}
      onMouseLeave={() => setShowMenu(false)}
      style={{ position: 'relative' }}
    >
      {isGroupChat && !isOutgoing && (
        <div className="message-sender-name">{senderName}</div>
      )}

      {/* Message Options Dropdown Button (Only for outgoing messages) */}
      {isOutgoing && (
        <>
          <div className="message-options-trigger" onClick={() => setShowMenu(!showMenu)}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 16, height: 16 }}>
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </div>

          {showMenu && (
            <div className="message-dropdown-menu">
              {/* Only text messages can be edited */}
              {message.mediaType === "none" && (
                <button onClick={() => { 
                  setIsEditing(true); 
                  setEditVal(message.content);
                  setShowMenu(false); 
                }}>
                  Edit
                </button>
              )}
              <button onClick={() => { handleDelete(); setShowMenu(false); }} className="delete-option">
                Delete
              </button>
            </div>
          )}
        </>
      )}

      {/* Render Media content if any */}
      {message.mediaUrl && message.mediaType !== "none" && (
        <div className="message-media" style={{ marginBottom: message.content ? '8px' : '0' }}>
          {message.mediaType === "image" && (
            <img 
              src={`http://localhost:5000${message.mediaUrl}`} 
              alt="Uploaded image" 
              style={{ maxWidth: '100%', borderRadius: '8px', display: 'block' }} 
            />
          )}
          {message.mediaType === "video" && (
            <video 
              src={`http://localhost:5000${message.mediaUrl}`} 
              controls 
              style={{ maxWidth: '100%', borderRadius: '8px', display: 'block' }} 
            />
          )}
          {message.mediaType === "audio" && (
            <CustomAudioPlayer src={`http://localhost:5000${message.mediaUrl}`} />
          )}
          {message.mediaType === "file" && (
            <div className="media-file-card">
              <div className="file-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 20, height: 20 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="file-info">
                <span className="file-name">{getFileName(message.mediaUrl)}</span>
                <span className="file-size">Attachment</span>
              </div>
              <a 
                className="file-download-btn" 
                href={`http://localhost:5000${message.mediaUrl}`} 
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            </div>
          )}
        </div>
      )}

      {message.content && <div className="message-content">{message.content}</div>}

      <div className="message-timestamp" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
        <span>{formatTime(message.createdAt)}</span>
        {message.isEdited && <span className="message-edited-label" style={{ fontSize: '9px', opacity: 0.6, fontStyle: 'italic' }}>(edited)</span>}
        {renderTicks()}
      </div>
    </div>
  );
};

export default MessageBubble;
