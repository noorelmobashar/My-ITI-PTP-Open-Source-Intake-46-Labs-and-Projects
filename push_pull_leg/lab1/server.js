const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = 3001;
const MONGO_URI = "mongodb://localhost:27017/polling-chat";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(MONGO_URI).then(() => {
  console.log("[SERVER] ✅ Connected to MongoDB");
});

const messageSchema = new mongoose.Schema({
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

const subscribers = [];

app.get("/1", (req, res) => {
  console.log("[SERVER] Client A page requested");
  res.sendFile(path.join(__dirname, "public", "client.html"));
});

app.get("/2", (req, res) => {
  console.log("[SERVER] Client B page requested");
  res.sendFile(path.join(__dirname, "public", "client.html"));
});

app.post("/api/send", async (req, res) => {
  const { clientId, text } = req.body;

  const message = await Message.create({
    sender: clientId,
    text,
  });

  console.log(`[SERVER] 💬 New message from Client ${clientId}: "${text}" (id: ${message._id})`);

  const count = await Message.countDocuments();
  console.log(`[SERVER] Total messages in DB: ${count}`);

  for (let i = subscribers.length - 1; i >= 0; i--) {
    const sub = subscribers[i];
    const newMsgs = await Message.find({ timestamp: { $gt: sub.since } }).sort({ timestamp: 1 });

    if (newMsgs.length > 0) {
      console.log(`[SERVER] 📤 Waking up long-poll subscriber (Client ${sub.clientId}) — sending ${newMsgs.length} new message(s)`);
      sub.res.json({ messages: newMsgs });
      clearTimeout(sub.timeout);
      subscribers.splice(i, 1);
    }
  }

  res.json({ success: true, message });
});

app.get("/api/short-poll", async (req, res) => {
  const { clientId, since } = req.query;
  const sinceDate = since ? new Date(since) : new Date(0);

  const newMsgs = await Message.find({ timestamp: { $gt: sinceDate } }).sort({ timestamp: 1 });

  console.log(`[SERVER] 🔄 Short-poll from Client ${clientId} — since: ${sinceDate.toISOString()} — found ${newMsgs.length} new message(s)`);

  res.json({ messages: newMsgs });
});

app.get("/api/long-poll", async (req, res) => {
  const { clientId, since } = req.query;
  const sinceDate = since ? new Date(since) : new Date(0);

  const newMsgs = await Message.find({ timestamp: { $gt: sinceDate } }).sort({ timestamp: 1 });

  if (newMsgs.length > 0) {
    console.log(`[SERVER] ⏳ Long-poll from Client ${clientId} — found ${newMsgs.length} message(s) immediately`);
    return res.json({ messages: newMsgs });
  }

  console.log(`[SERVER] ⏳ Long-poll from Client ${clientId} — no new messages, HOLDING connection open...`);

  const timeout = setTimeout(() => {
    console.log(`[SERVER] ⏳ Long-poll TIMEOUT for Client ${clientId} — releasing after 30s`);
    const idx = subscribers.findIndex((s) => s.res === res);
    if (idx !== -1) subscribers.splice(idx, 1);
    res.json({ messages: [] });
  }, 30000);

  const subscriber = { res, clientId, since: sinceDate, timeout };
  subscribers.push(subscriber);

  req.on("close", () => {
    console.log(`[SERVER] 🔌 Client ${clientId} disconnected — cleaning up subscriber`);
    clearTimeout(timeout);
    const idx = subscribers.findIndex((s) => s.res === res);
    if (idx !== -1) subscribers.splice(idx, 1);
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`   Client A: http://localhost:${PORT}/1`);
  console.log(`   Client B: http://localhost:${PORT}/2\n`);
});
