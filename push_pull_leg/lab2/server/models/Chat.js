const mongoose = require("mongoose");

// =============================================
// Chat Schema
// Represents a conversation — either private (1-on-1)
// or a group chat with multiple participants.
// =============================================

const chatSchema = new mongoose.Schema(
  {
    // "private" for 1-on-1 chats, "group" for group chats
    type: {
      type: String,
      enum: ["private", "group"],
      required: true,
    },

    // Array of user IDs who are part of this chat
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Only used for group chats — the name of the group
    groupName: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Chat", chatSchema);
