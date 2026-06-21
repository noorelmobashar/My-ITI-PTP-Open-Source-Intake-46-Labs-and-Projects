// =============================================
// Server Entry Point
// Sets up Express, MongoDB, and Socket.IO
// =============================================

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const chatRoutes = require("./routes/chats");
const messageRoutes = require("./routes/messages");
const uploadRoutes = require("./routes/upload");

// Import socket handler
const socketHandler = require("./socket/socketHandler");

// =============================================
// 1. Create Express App
// =============================================
const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests from the React frontend
app.use(express.json()); // Parse JSON request bodies

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =============================================
// 2. Mount API Routes
// =============================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);

// Simple health check route
app.get("/", (req, res) => {
  res.json({ message: "WhatsApp Clone API is running! 🚀" });
});

// =============================================
// 3. Create HTTP Server
// We need a raw HTTP server (not just Express)
// because Socket.IO needs to attach to it.
// =============================================
const server = http.createServer(app);

// =============================================
// 4. Set Up Socket.IO
// Create a Socket.IO server attached to our HTTP server.
// The cors config allows our React frontend to connect.
// =============================================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite dev server default port
    methods: ["GET", "POST"],
  },
});

// Initialize the socket event handlers
socketHandler(io);

// =============================================
// 5. Connect to MongoDB & Start Server
// =============================================
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
