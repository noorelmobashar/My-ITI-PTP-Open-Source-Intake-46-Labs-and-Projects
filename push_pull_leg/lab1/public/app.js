const path = window.location.pathname;
const clientId = path === "/1" ? "A" : "B";
document.getElementById("clientLabel").textContent = clientId;
document.title = `Chat — Client ${clientId}`;

let mode = "short";
let since = new Date(0).toISOString();
let pollTimer = null;
let abortController = null;

const SHORT_POLL_INTERVAL = 1000;

const consoleLog = document.getElementById("consoleLog");
const messagesDiv = document.getElementById("messages");
const sendForm = document.getElementById("sendForm");
const msgInput = document.getElementById("msgInput");
const btnShort = document.getElementById("btnShort");
const btnLong = document.getElementById("btnLong");

function log(text, type = "poll") {
  const time = new Date().toLocaleTimeString();
  const entry = document.createElement("div");
  entry.className = `log-entry ${type}`;
  entry.textContent = `[${time}] ${text}`;
  consoleLog.appendChild(entry);
  consoleLog.scrollTop = consoleLog.scrollHeight;
  console.log(`[Client ${clientId}] ${text}`);
}

function renderMessages(newMsgs) {
  newMsgs.forEach((msg) => {
    const div = document.createElement("div");
    const isMine = msg.sender === clientId;
    div.className = `msg ${isMine ? "mine" : "theirs"}`;
    div.innerHTML = `
      <div>${msg.text}</div>
      <div class="meta">Client ${msg.sender} · ${new Date(msg.timestamp).toLocaleTimeString()}</div>
    `;
    messagesDiv.appendChild(div);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function updateSince(msgs) {
  if (msgs.length > 0) {
    since = msgs[msgs.length - 1].timestamp;
  }
}

sendForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = msgInput.value.trim();
  if (!text) return;

  log(`📤 Sending: "${text}"`, "send");

  try {
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, text }),
    });
    const data = await res.json();
    log(`✅ Message sent (id: ${data.message._id})`, "send");
  } catch (err) {
    log(`❌ Send failed: ${err.message}`, "error");
  }

  msgInput.value = "";
});

function startShortPolling() {
  log("🔄 Starting SHORT polling (every 3s)...", "mode");

  async function tick() {
    log(`🔄 Short-poll request → since: ${since}`, "poll");

    try {
      const res = await fetch(`/api/short-poll?clientId=${clientId}&since=${since}`);
      const data = await res.json();

      if (data.messages.length > 0) {
        log(`📬 Received ${data.messages.length} new message(s)`, "recv");
        renderMessages(data.messages);
        updateSince(data.messages);
      } else {
        log(`📭 No new messages`, "poll");
      }
    } catch (err) {
      log(`❌ Poll error: ${err.message}`, "error");
    }

    pollTimer = setTimeout(tick, SHORT_POLL_INTERVAL);
  }

  tick();
}

function startLongPolling() {
  log("⏳ Starting LONG polling...", "mode");

  async function poll() {
    log(`⏳ Long-poll request → since: ${since} (waiting...)`, "poll");
    abortController = new AbortController();

    try {
      const res = await fetch(
        `/api/long-poll?clientId=${clientId}&since=${since}`,
        { signal: abortController.signal }
      );
      const data = await res.json();

      if (data.messages.length > 0) {
        log(`📬 Long-poll returned ${data.messages.length} new message(s)`, "recv");
        renderMessages(data.messages);
        updateSince(data.messages);
      } else {
        log(`⏳ Long-poll timed out, re-connecting...`, "poll");
      }

      poll();
    } catch (err) {
      if (err.name === "AbortError") {
        log(`🛑 Long-poll aborted (mode switch)`, "mode");
      } else {
        log(`❌ Long-poll error: ${err.message} — retrying in 2s`, "error");
        pollTimer = setTimeout(poll, 2000);
      }
    }
  }

  poll();
}

function setMode(newMode) {
  if (newMode === mode) return;

  if (pollTimer) {
    clearTimeout(pollTimer);
    pollTimer = null;
  }
  if (abortController) {
    abortController.abort();
    abortController = null;
  }

  mode = newMode;
  btnShort.classList.toggle("active", mode === "short");
  btnLong.classList.toggle("active", mode === "long");
  log(`🔀 Switched to ${mode.toUpperCase()} polling`, "mode");

  if (mode === "short") {
    startShortPolling();
  } else {
    startLongPolling();
  }
}

log(`🟢 Client ${clientId} initialized`, "mode");
startShortPolling();
