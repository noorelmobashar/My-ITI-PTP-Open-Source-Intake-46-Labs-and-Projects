import React, { useState, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";
import api from "../utils/api";

const MessageInput = ({ chatId }) => {
  const [text, setText] = useState("");
  const { sendMessage } = useChat();
  const { socket } = useSocket();
  
  const fileInputRef = useRef(null);
  
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleChange = (e) => {
    setText(e.target.value);
    
    // Emit typing event if we have text
    if (socket && chatId) {
      if (e.target.value.trim()) {
        socket.emit("typing", chatId);
      } else {
        socket.emit("stop-typing", chatId);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !chatId) return;

    try {
      await sendMessage(chatId, text.trim());
      setText("");
      if (socket) {
        socket.emit("stop-typing", chatId);
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !chatId) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload file to server
      const uploadRes = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const { mediaUrl, mediaType } = uploadRes.data;
      
      // Send message with media
      await sendMessage(chatId, "", mediaUrl, mediaType);
    } catch (error) {
      console.error("File upload failed:", error);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", audioBlob, `voice-${Date.now()}.webm`);

        try {
          const uploadRes = await api.post("/upload", formData, {
             headers: { "Content-Type": "multipart/form-data" },
          });
          const { mediaUrl, mediaType } = uploadRes.data;
          await sendMessage(chatId, "", mediaUrl, mediaType);
        } catch (error) {
           console.error("Voice upload failed:", error);
        }

        // Stop all tracks to release mic
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert("Microphone access is required to record voice messages.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="message-input-wrapper">
      <form className="message-input-container" onSubmit={handleSubmit}>
        
        {/* Hidden file input */}
        <input 
          type="file" 
          style={{ display: "none" }} 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
        />

        {/* Attach File Button */}
        <button 
          type="button" 
          className="icon-btn" 
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          title="Attach file"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--text-secondary)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: 20, height: 20}}>
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        <input
          type="text"
          className="message-input"
          placeholder={isRecording ? "Recording audio..." : "Type a message"}
          value={text}
          onChange={handleChange}
          disabled={isRecording}
        />
        
        {text.trim() ? (
          <button type="submit" className="send-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" style={{width: 20, height: 20}}>
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        ) : (
          <button 
            type="button" 
            className={`send-btn`}
            onClick={isRecording ? stopRecording : startRecording}
            style={isRecording ? { backgroundColor: '#EA4335' } : {}}
            title={isRecording ? "Stop recording" : "Record voice message"}
          >
            {isRecording ? (
               <svg viewBox="0 0 24 24" fill="currentColor" style={{width: 20, height: 20}}>
                 <rect x="6" y="6" width="12" height="12" />
               </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: 20, height: 20, color: '#111B21'}}>
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            )}
          </button>
        )}
      </form>
    </div>
  );
};

export default MessageInput;
