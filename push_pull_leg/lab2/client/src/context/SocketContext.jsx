import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

// =============================================
// Socket Context
// Manages the Socket.IO connection lifecycle.
//
// How it works:
// 1. When the user logs in, we create a socket connection
// 2. We emit "user-online" to register the user
// 3. We provide the socket instance to all components
// 4. When the user logs out, we disconnect
//
// All real-time features (messages, typing, etc.)
// use this socket instance.
// =============================================

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    // Only connect if the user is logged in
    if (user && token) {
      const newSocket = io("http://localhost:5000", {

      });

      // When connected, tell the server who we are
      newSocket.on("connect", () => {
        console.log("🔌 Socket connected:", newSocket.id);
        newSocket.emit("user-online", user.id);
      });

      // Listen for the online users list
      newSocket.on("online-users", (users) => {
        setOnlineUsers(users);
      });

      setSocket(newSocket);

      // Cleanup: disconnect when user changes or component unmounts
      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [user, token]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
