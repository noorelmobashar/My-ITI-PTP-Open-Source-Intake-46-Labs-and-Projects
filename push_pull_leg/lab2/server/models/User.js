const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// =============================================
// User Schema
// Stores user account information.
// Passwords are automatically hashed before saving.
// =============================================

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    avatar: {
      type: String,
      default: "", // Optional avatar URL
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// =============================================
// Pre-save Hook: Hash Password
// Before saving a user, if the password has changed,
// we hash it using bcrypt so we never store plain text.
// =============================================
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// =============================================
// Instance Method: Compare Password
// Used during login to check if the provided
// password matches the stored hashed password.
// =============================================
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
