const express = require("express");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const auth = require("../middleware/auth");

const router = express.Router();

// =============================================
// GET /api/chats
// Get all chats for the current user
// Returns chats sorted by most recent activity
// Each chat includes the latest message preview
// =============================================
router.get("/", auth, async (req, res) => {
  try {
    // Find all chats where the current user is a participant
    const chats = await Chat.find({
      participants: req.user.id,
    }).populate("participants", "-password"); // Populate user info (without passwords)

    // For each chat, find the latest message and count unread messages
    const chatsWithLastMessage = await Promise.all(
      chats.map(async (chat) => {
        const lastMessage = await Message.findOne({ chatId: chat._id })
          .sort({ createdAt: -1 }) // Get the most recent message
          .populate("senderId", "username firstName lastName");

        const unreadCount = await Message.countDocuments({
          chatId: chat._id,
          senderId: { $ne: req.user.id },
          seenBy: { $ne: req.user.id },
        });

        return {
          ...chat.toObject(),
          lastMessage: lastMessage || null,
          unreadCount,
        };
      })
    );

    // Sort chats by the latest message timestamp (most recent first)
    chatsWithLastMessage.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(a.createdAt);
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(b.createdAt);
      return timeB - timeA;
    });

    res.json(chatsWithLastMessage);
  } catch (error) {
    console.error("Get chats error:", error);
    res.status(500).json({ message: "Server error fetching chats" });
  }
});

// =============================================
// POST /api/chats
// Create a new chat
// For private: { participantId: "userId" }
// For group: { participants: ["id1", "id2"], groupName: "..." }
// =============================================
router.post("/", auth, async (req, res) => {
  try {
    const { participantId, participants, groupName } = req.body;

    // ---- Private Chat ----
    if (participantId) {
      // Check if a private chat already exists between these two users
      const existingChat = await Chat.findOne({
        type: "private",
        participants: { $all: [req.user.id, participantId], $size: 2 },
      }).populate("participants", "-password");

      // If it already exists, return the existing chat
      if (existingChat) {
        return res.json(existingChat);
      }

      // Create a new private chat
      const chat = new Chat({
        type: "private",
        participants: [req.user.id, participantId],
      });
      await chat.save();

      // Populate participants before sending back
      const populatedChat = await Chat.findById(chat._id).populate(
        "participants",
        "-password"
      );

      return res.status(201).json(populatedChat);
    }

    // ---- Group Chat ----
    if (participants && groupName) {
      // Make sure the creator is included in participants
      const allParticipants = [...new Set([req.user.id, ...participants])];

      const chat = new Chat({
        type: "group",
        participants: allParticipants,
        groupName,
      });
      await chat.save();

      const populatedChat = await Chat.findById(chat._id).populate(
        "participants",
        "-password"
      );

      return res.status(201).json(populatedChat);
    }

    res.status(400).json({ message: "Invalid chat creation data" });
  } catch (error) {
    console.error("Create chat error:", error);
    res.status(500).json({ message: "Server error creating chat" });
  }
});

// =============================================
// GET /api/chats/:chatId
// Get a single chat with all participants
// =============================================
router.get("/:chatId", auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId).populate(
      "participants",
      "-password"
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Make sure the requesting user is a participant
    const isParticipant = chat.participants.some(
      (p) => p._id.toString() === req.user.id
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(chat);
  } catch (error) {
    console.error("Get chat error:", error);
    res.status(500).json({ message: "Server error fetching chat" });
  }
});

module.exports = router;
