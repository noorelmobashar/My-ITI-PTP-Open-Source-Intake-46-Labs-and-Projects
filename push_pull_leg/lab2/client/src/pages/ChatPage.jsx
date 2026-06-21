import { useState } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { useChat } from "../context/ChatContext";

// =============================================
// Chat Page
// Main layout with sidebar (ChatList) and
// chat area (ChatWindow) in a 30/70 split.
// =============================================

const ChatPage = () => {
  const { activeChat } = useChat();

  return (
    <div className={`chat-page ${activeChat ? "chat-active" : ""}`}>
      {/* Left sidebar: chat list */}
      <ChatList />

      {/* Right panel: active chat or empty state */}
      <ChatWindow />
    </div>
  );
};

export default ChatPage;
