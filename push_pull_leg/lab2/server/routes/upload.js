const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files in the server/uploads directory
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    // Generate a unique filename: timestamp + original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
});

// Helper function to infer media type from mimetype
const getMediaType = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "audio";
  return "file";
};

// =============================================
// POST /api/upload
// Upload a media file
// Requires: Valid JWT token, multipart/form-data with "file" field
// Returns: { mediaUrl, mediaType }
// =============================================
router.post("/", auth, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // The file is saved. We return the URL path that the client can use.
    // e.g., "/uploads/file-12345.jpg"
    const mediaUrl = `/uploads/${req.file.filename}`;
    const mediaType = getMediaType(req.file.mimetype);

    res.status(201).json({
      mediaUrl,
      mediaType,
      originalName: req.file.originalname,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during file upload" });
  }
});

module.exports = router;
