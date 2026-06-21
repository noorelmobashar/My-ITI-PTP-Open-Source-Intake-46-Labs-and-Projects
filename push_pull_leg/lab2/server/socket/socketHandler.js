// We store a mapping of userId -> socketId
// so we can know which users are currently online
const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);


    socket.on("user-online", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`👤 User ${userId} is now online`);

      // Broadcast the updated online users list to everyone
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });


    socket.on("join-chats", (chatIds) => {
      chatIds.forEach((chatId) => {
        socket.join(chatId); // Join the Socket.IO room for this chat
        console.log(`📥 Socket ${socket.id} joined room: ${chatId}`);
      });
    });


    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      console.log(`📥 Socket ${socket.id} joined room: ${chatId}`);
    });


    socket.on("send-message", ({ chatId, message }) => {
      console.log(`💬 Message in room ${chatId}: ${message.content}`);

      io.to(chatId).emit("receive-message", {
        chatId,
        message,
      });
    });


    socket.on("typing", ({ chatId, userId, username }) => {
      socket.to(chatId).emit("user-typing", {
        chatId,
        userId,
        username,
      });
    });


    socket.on("stop-typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("user-stop-typing", {
        chatId,
        userId,
      });
    });


    socket.on("new-chat-created", ({ chat, participantIds }) => {
      // Notify each participant about the new chat
      participantIds.forEach((participantId) => {
        const participantSocketId = onlineUsers.get(participantId);
        if (participantSocketId) {
          io.to(participantSocketId).emit("chat-created", chat);
        }
      });
    });

    socket.on("edit-message", ({ chatId, message }) => {
      io.to(chatId).emit("receive-message-edited", {
        chatId,
        message,
      });
    });


    socket.on("delete-message", ({ chatId, message }) => {
      io.to(chatId).emit("receive-message-deleted", {
        chatId,
        message,
      });
    });


    socket.on("read-messages", ({ chatId, userId }) => {
      socket.to(chatId).emit("receive-messages-read", {
        chatId,
        userId,
      });
    });


    socket.on("disconnect", () => {
      
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`👋 User ${userId} went offline`);
          break;
        }
      }

      // Broadcast the updated online users list
      io.emit("online-users", Array.from(onlineUsers.keys()));
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
