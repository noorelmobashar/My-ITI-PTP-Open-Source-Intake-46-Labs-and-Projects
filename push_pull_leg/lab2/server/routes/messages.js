const express = require("express");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const auth = require("../middleware/auth");

const router = express.Router();

// =============================================
// GET /api/messages/:chatId
// Get all messages for a specific chat
// Messages are sorted oldest-first so they
// display chronologically in the chat window
// =============================================
router.get("/:chatId", auth, async (req, res) => {
  try {
    const { chatId } = req.params;

    // Verify the user is a participant of this chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === req.user.id
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch all messages for this chat, sorted by creation time (oldest first)
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .populate("senderId", "username firstName lastName avatar");

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error fetching messages" });
  }
});

// =============================================
// POST /api/messages
// Send a new message
// Body: { chatId, content }
// The senderId comes from the JWT token
//
// NOTE: This route only saves to the database.
// Real-time delivery is handled by Socket.IO
// in the socketHandler.js file.
// =============================================
router.post("/", auth, async (req, res) => {
  try {
    const { chatId, content, mediaUrl, mediaType } = req.body;

    // A message must have either text content or media
    if (!chatId) {
      return res.status(400).json({ message: "chatId is required" });
    }
    if (!content && !mediaUrl) {
      return res.status(400).json({ message: "Message must contain either text or media" });
    }

    // Verify the user is a participant of this chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const isParticipant = chat.participants.some(
      (p) => p.toString() === req.user.id
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Create and save the message
    const message = new Message({
      chatId,
      senderId: req.user.id,
      content: content || "",
      mediaUrl: mediaUrl || "",
      mediaType: mediaType || "none",
      seenBy: [req.user.id],
    });
    await message.save();

    // Populate sender info before sending the response
    const populatedMessage = await Message.findById(message._id).populate(
      "senderId",
      "username firstName lastName avatar"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error sending message" });
  }
});

// =============================================
// PUT /api/messages/:id
// Edit an existing message
// Body: { content }
// =============================================
router.put("/:id", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required to edit" });
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check ownership
    if (message.senderId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to edit this message" });
    }

    if (message.isDeleted) {
      return res.status(400).json({ message: "Cannot edit a deleted message" });
    }

    message.content = content.trim();
    message.isEdited = true;
    await message.save();

    const populated = await Message.findById(message._id).populate(
      "senderId",
      "username firstName lastName avatar"
    );

    res.json(populated);
  } catch (error) {
    console.error("Edit message error:", error);
    res.status(500).json({ message: "Server error editing message" });
  }
});

// =============================================
// DELETE /api/messages/:id
// Soft delete a message ("Delete for Everyone")
// =============================================
router.delete("/:id", auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check ownership
    if (message.senderId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this message" });
    }

    message.content = "This message was deleted";
    message.mediaUrl = "";
    message.mediaType = "none";
    message.isDeleted = true;
    await message.save();

    const populated = await Message.findById(message._id).populate(
      "senderId",
      "username firstName lastName avatar"
    );

    res.json(populated);
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ message: "Server error deleting message" });
  }
});

// =============================================
// PUT /api/messages/read/:chatId
// Mark all messages in a chat as read by the current user
// =============================================
router.put("/read/:chatId", auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Update all messages in this chat sent by others to add current user to seenBy
    await Message.updateMany(
      { chatId, senderId: { $ne: userId }, seenBy: { $ne: userId } },
      { $addToSet: { seenBy: userId } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ message: "Server error marking messages as read" });
  }
});

module.exports = router;
