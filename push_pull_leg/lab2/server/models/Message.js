const mongoose = require("mongoose");

// =============================================
// Message Schema
// Stores individual messages sent within a chat.
// Each message belongs to a specific chat and
// was sent by a specific user.
// =============================================

const messageSchema = new mongoose.Schema(
  {
    // Which chat this message belongs to
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    // Who sent this message
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The text content of the message
    content: {
      type: String,
      trim: true,
      default: "", // Content is optional if there's media
    },

    // URL to the uploaded media file
    mediaUrl: {
      type: String,
      default: "",
    },

    // Type of media (image, video, audio, file, none)
    mediaType: {
      type: String,
      enum: ["image", "video", "audio", "file", "none"],
      default: "none",
    },

    // Whether the message has been edited
    isEdited: {
      type: Boolean,
      default: false,
    },

    // Whether the message has been deleted
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // Users who have seen this message
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // createdAt = when the message was sent
  }
);

module.exports = mongoose.model("Message", messageSchema);
