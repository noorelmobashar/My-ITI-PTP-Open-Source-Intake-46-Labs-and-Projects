const state = {
  models: [],
  chats: [],
  activeChatId: null,
  activeChat: null,
  activeMessages: [],
  selectedModel: "",
  isStreaming: false,
  isEditingLastPrompt: false,
  voiceReplyEnabled: false,
  pendingImage: null,
  isRecording: false,
  isPreparingAudio: false,
  mediaRecorder: null,
  recordingChunks: [],
  recordingStream: null,
};

const promptTemplates = [
  "Summarize the last conversation and list next steps.",
  "Help me debug a failing FastAPI endpoint.",
  "Draft a short product update for a new AI feature.",
  "Brainstorm five ideas for an AI study assistant.",
];

const elements = {
  appShell: document.getElementById("appShell"),
  sidebar: document.getElementById("sidebar"),
  sidebarBackdrop: document.getElementById("sidebarBackdrop"),
  sidebarOpenButton: document.getElementById("sidebarOpenButton"),
  sidebarCloseButton: document.getElementById("sidebarCloseButton"),
  chatList: document.getElementById("chatList"),
  newChatButton: document.getElementById("newChatButton"),
  deleteChatButton: document.getElementById("deleteChatButton"),
  modelSelect: document.getElementById("modelSelect"),
  modelCapabilityBadge: document.getElementById("modelCapabilityBadge"),
  activeChatTitle: document.getElementById("activeChatTitle"),
  activeChatMeta: document.getElementById("activeChatMeta"),
  messages: document.getElementById("messages"),
  messageInput: document.getElementById("messageInput"),
  sendButton: document.getElementById("sendButton"),
  imageInput: document.getElementById("imageInput"),
  attachImageButton: document.getElementById("attachImageButton"),
  attachmentPreview: document.getElementById("attachmentPreview"),
  recordButton: document.getElementById("recordButton"),
  voiceReplyButton: document.getElementById("voiceReplyButton"),
  regenerateButton: document.getElementById("regenerateButton"),
  editLastPromptButton: document.getElementById("editLastPromptButton"),
  deleteLastPromptButton: document.getElementById("deleteLastPromptButton"),
  audioStatus: document.getElementById("audioStatus"),
  streamStatus: document.getElementById("streamStatus"),
  toast: document.getElementById("toast"),
};

let toastTimer = null;
let activeStreamController = null;
let modelSelectGuardObserver = null;

const STREAM_REQUEST_TIMEOUT_MS = 120000;

function enforceModelSelectEnabled() {
  if (!elements.modelSelect) {
    return;
  }

  if (elements.modelSelect.disabled) {
    elements.modelSelect.disabled = false;
  }

  if (elements.modelSelect.hasAttribute("disabled")) {
    elements.modelSelect.removeAttribute("disabled");
  }
}

function guardModelSelectEnabled() {
  enforceModelSelectEnabled();

  if (modelSelectGuardObserver || !window.MutationObserver || !elements.modelSelect) {
    return;
  }

  modelSelectGuardObserver = new MutationObserver(() => {
    enforceModelSelectEnabled();
  });

  modelSelectGuardObserver.observe(elements.modelSelect, {
    attributes: true,
    attributeFilter: ["disabled"],
  });
}

function compactDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderPlainText(value) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function renderMarkdown(value) {
  const source = String(value || "");
  const placeholders = [];

  // Extract markdown images BEFORE escaping (data URIs contain special chars)
  let preprocessed = source.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, url) => {
    const index = placeholders.length;
    placeholders.push(
      `<img class="message-image" src="${url}" alt="${alt || 'Generated image'}" />`
    );
    return `@@PLACEHOLDER_${index}@@`;
  });

  let html = escapeHtml(preprocessed).replace(/\r\n/g, "\n");

  html = html.replace(/```([a-zA-Z0-9_+-]*)\n([\s\S]*?)```/g, (_match, language, code) => {
    const label = (language || "text").trim().toLowerCase();
    const index = placeholders.length;
    placeholders.push(
      `<pre class="code-block"><div class="code-lang">${escapeHtml(label)}</div><code>${code}</code></pre>`
    );
    return `@@PLACEHOLDER_${index}@@`;
  });

  html = html
    .replace(/^###\s+(.+)$/gm, "<h4>$1</h4>")
    .replace(/^##\s+(.+)$/gm, "<h3>$1</h3>")
    .replace(/^#\s+(.+)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`\n]+)`/g, "<code>$1</code>");

  const blocks = html.split("\n\n");
  html = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) {
        return "";
      }

      if (
        trimmed.startsWith("<h2>")
        || trimmed.startsWith("<h3>")
        || trimmed.startsWith("<h4>")
        || trimmed.startsWith("@@PLACEHOLDER_")
      ) {
        return trimmed;
      }

      const lines = trimmed.split("\n").map((line) => line.trim());
      const isBulletList = lines.every((line) => line.startsWith("- ") || line.startsWith("* "));
      const isNumberedList = lines.every((line) => /^\d+\.\s+/.test(line));

      if (isBulletList) {
        return `<ul>${lines.map((line) => `<li>${line.slice(2).trim()}</li>`).join("")}</ul>`;
      }

      if (isNumberedList) {
        return `<ol>${lines.map((line) => `<li>${line.replace(/^\d+\.\s+/, "").trim()}</li>`).join("")}</ol>`;
      }

      return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");

  placeholders.forEach((block, index) => {
    html = html.replace(`@@PLACEHOLDER_${index}@@`, block);
  });

  return html;
}

function modelById(modelId) {
  return state.models.find((model) => model.id === modelId) || null;
}

function selectedModel() {
  return modelById(elements.modelSelect.value || state.selectedModel);
}

function selectedModelSupportsAudio() {
  return Boolean(selectedModel()?.accepts_audio);
}

function selectedModelSupportsImage() {
  return Boolean(selectedModel()?.accepts_image);
}

function capabilityTokens(model) {
  if (!model) {
    return ["Text"];
  }

  const tokens = ["Text"];
  if (model.accepts_image) {
    tokens.push("Image");
  }
  if (model.accepts_audio) {
    tokens.push("Audio");
  }
  return tokens;
}

function modelLabel(modelId) {
  const match = modelById(modelId);
  return match ? match.label : modelId;
}

function showToast(message) {
  if (!message) {
    return;
  }

  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");
  toastTimer = setTimeout(() => {
    elements.toast.classList.add("hidden");
  }, 3200);
}

async function api(path, options = {}) {
  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  if (options.body !== undefined) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(path, config);

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") {
        message = body.detail;
      }
    } catch (_error) {
      const text = await response.text();
      if (text.trim()) {
        message = text.trim();
      }
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function syncVoiceUi() {
  const model = selectedModel();
  const supportsAudio = Boolean(model?.accepts_audio);
  const supportsImage = Boolean(model?.accepts_image);

  if (!supportsAudio) {
    state.voiceReplyEnabled = false;
  }

  elements.modelCapabilityBadge.textContent = capabilityTokens(model).join(" + ");
  elements.voiceReplyButton.disabled = !supportsAudio || state.isStreaming || state.isPreparingAudio;
  elements.recordButton.disabled = !supportsAudio || state.isStreaming || state.isPreparingAudio;
  elements.attachImageButton.disabled = !supportsImage || state.isStreaming || state.isPreparingAudio;
  elements.voiceReplyButton.classList.toggle("active", state.voiceReplyEnabled);
  elements.voiceReplyButton.textContent = state.voiceReplyEnabled ? "Voice reply on" : "Voice reply off";

  if (state.isRecording) {
    elements.recordButton.textContent = "Send voice";
    elements.audioStatus.textContent = "Recording... click again to send.";
    syncPromptActionUi();
    return;
  }

  if (state.isPreparingAudio) {
    elements.recordButton.textContent = "Preparing...";
    elements.audioStatus.textContent = "Processing the recording...";
    syncPromptActionUi();
    return;
  }

  elements.recordButton.textContent = "Start voice";

  if (!supportsAudio) {
    elements.audioStatus.textContent = supportsImage
      ? "This model accepts images. Choose an audio model to use voice."
      : "Choose an image or audio capable model to unlock more inputs.";
    syncPromptActionUi();
    return;
  }

  elements.audioStatus.textContent = state.voiceReplyEnabled
    ? "Voice replies are enabled for this model."
    : "Voice input is ready. Toggle voice reply if you want spoken output.";
  syncPromptActionUi();
}

function lastUserMessage() {
  for (let index = state.activeMessages.length - 1; index >= 0; index -= 1) {
    const message = state.activeMessages[index];
    if (message.role === "user") {
      return message;
    }
  }
  return null;
}

function syncPromptActionUi() {
  const hasLastUser = Boolean(lastUserMessage());
  const blocked = state.isStreaming || state.isPreparingAudio;

  if (elements.regenerateButton) {
    elements.regenerateButton.disabled = blocked || !hasLastUser;
  }

  if (elements.editLastPromptButton) {
    elements.editLastPromptButton.disabled = blocked || !hasLastUser;
    elements.editLastPromptButton.classList.toggle("active", state.isEditingLastPrompt);
    elements.editLastPromptButton.textContent = state.isEditingLastPrompt
      ? "Cancel edit"
      : "Edit last prompt";
  }

  if (elements.deleteLastPromptButton) {
    elements.deleteLastPromptButton.disabled = blocked || !hasLastUser;
  }

  if (!state.isStreaming) {
    elements.sendButton.textContent = state.isEditingLastPrompt ? "Save + send" : "Send";
  }
}

function setEditingLastPrompt(enabled) {
  state.isEditingLastPrompt = Boolean(enabled);
  syncPromptActionUi();
}

async function regenerateLastPromptForChat(chatId, { manageStreaming = true } = {}) {
  if (!chatId) {
    return false;
  }

  if (manageStreaming) {
    setStreaming(true);
    elements.streamStatus.textContent = "Regenerating...";
  }

  try {
    await api(`/api/chats/${chatId}/regenerate`, {
      method: "POST",
      body: {
        model: elements.modelSelect.value || state.selectedModel,
      },
    });

    await refreshChats();
    await loadChat(chatId);
    return true;
  } catch (error) {
    showToast(error instanceof Error ? error.message : "Regenerate failed");
    return false;
  } finally {
    if (manageStreaming) {
      setStreaming(false);
      elements.messageInput.focus();
    }
  }
}

function loadLastPromptIntoComposer() {
  const lastUser = lastUserMessage();
  if (!lastUser) {
    showToast("No user prompt to edit.");
    return;
  }

  elements.messageInput.value = lastUser.content || "";

  if (lastUser.has_image && lastUser.image_base64) {
    if (state.pendingImage?.previewUrl && state.pendingImage.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(state.pendingImage.previewUrl);
    }
    const mimeType = lastUser.image_mime_type || "image/png";
    state.pendingImage = {
      name: "last-prompt-image",
      mimeType,
      base64: lastUser.image_base64,
      previewUrl: `data:${mimeType};base64,${lastUser.image_base64}`,
    };
    renderPendingImage();
  } else {
    clearPendingImage();
  }

  autoResizeTextarea();
  elements.messageInput.focus();
  setEditingLastPrompt(true);
}

async function submitEditedLastPrompt() {
  if (!state.activeChatId) {
    return;
  }

  const chatId = state.activeChatId;
  const nextMessage = elements.messageInput.value.trim() || (state.pendingImage ? "Sent an image" : "");
  if (!nextMessage) {
    showToast("Edited prompt cannot be empty.");
    return;
  }

  setStreaming(true);
  elements.streamStatus.textContent = "Updating...";

  try {
    await api(`/api/chats/${chatId}/last-prompt`, {
      method: "PATCH",
      body: {
        message: nextMessage,
      },
    });

    elements.messageInput.value = "";
    autoResizeTextarea();
    clearPendingImage();
    setEditingLastPrompt(false);

    await regenerateLastPromptForChat(chatId, { manageStreaming: false });
  } catch (error) {
    showToast(error instanceof Error ? error.message : "Edit last prompt failed");
  } finally {
    setStreaming(false);
    elements.messageInput.focus();
  }
}

async function deleteLastPrompt() {
  if (!state.activeChatId) {
    return;
  }

  const lastUser = lastUserMessage();
  if (!lastUser) {
    showToast("No user prompt to delete.");
    return;
  }

  const shouldDelete = window.confirm("Delete your last prompt and its response?");
  if (!shouldDelete) {
    return;
  }

  setStreaming(true);
  elements.streamStatus.textContent = "Deleting...";

  try {
    await api(`/api/chats/${state.activeChatId}/last-prompt`, {
      method: "DELETE",
    });

    setEditingLastPrompt(false);
    elements.messageInput.value = "";
    autoResizeTextarea();
    clearPendingImage();

    await refreshChats();
    await loadChat(state.activeChatId);
  } catch (error) {
    showToast(error instanceof Error ? error.message : "Delete last prompt failed");
  } finally {
    setStreaming(false);
    elements.messageInput.focus();
  }
}

function setStreaming(isStreaming) {
  state.isStreaming = isStreaming;
  elements.sendButton.disabled = isStreaming;
  elements.newChatButton.disabled = isStreaming;
  elements.deleteChatButton.disabled = isStreaming || !state.activeChatId;
  enforceModelSelectEnabled();
  elements.streamStatus.textContent = isStreaming ? "Working..." : "Ready";
  elements.sendButton.textContent = isStreaming ? "Working" : "Send";
  syncVoiceUi();
  syncPromptActionUi();
}

function updateHeader() {
  const chat = state.activeChat;

  if (!chat) {
    elements.activeChatTitle.textContent = "New chat";
    elements.activeChatMeta.textContent = "Pick a model and start chatting.";
    syncVoiceUi();
    return;
  }

  elements.activeChatTitle.textContent = chat.title;
  elements.activeChatMeta.textContent = [
    modelLabel(chat.model),
    `${state.activeMessages.length} messages`,
    `Updated ${compactDate(chat.updated_at)}`,
  ].join(" • ");
  syncVoiceUi();
}

function audioSource(format, base64) {
  if (!format || !base64) {
    return "";
  }
  return `data:audio/${format};base64,${base64}`;
}

function createMessageElement(message, isStreaming = false) {
  const article = document.createElement("article");
  article.className = `message ${message.role}`;
  article.dataset.messageId = message.id;

  if (isStreaming) {
    article.classList.add("streaming");
  }

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = message.role === "assistant" ? "AI" : "YOU";

  const stack = document.createElement("div");
  stack.className = "message-stack";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  const content = document.createElement("div");
  content.className = "message-content";
  content.innerHTML =
    message.role === "assistant"
      ? renderMarkdown(message.content || "")
      : renderPlainText(message.content || "");
  bubble.appendChild(content);

  if (message.has_image && message.image_base64) {
    const image = document.createElement("img");
    image.className = "message-image";
    image.src = `data:${message.image_mime_type || "image/png"};base64,${message.image_base64}`;
    image.alt = message.content || "Attached image";
    bubble.appendChild(image);
  }

  if (message.has_audio) {
    if (message.role === "assistant" && message.audio_base64) {
      const player = document.createElement("audio");
      player.className = "audio-player";
      player.controls = true;
      player.preload = "none";
      player.src = audioSource(message.audio_format || "wav", message.audio_base64);
      bubble.appendChild(player);
    } else {
      const chip = document.createElement("div");
      chip.className = "audio-chip";
      chip.textContent = "Voice message";
      bubble.appendChild(chip);
    }
  }

  const meta = document.createElement("div");
  meta.className = "message-meta";
  const label = message.role === "assistant"
    ? modelLabel(message.model || state.activeChat?.model || state.selectedModel || "Assistant")
    : "You";
  const parts = [label, compactDate(message.created_at)].filter(Boolean);
  meta.textContent = parts.join(" • ");

  stack.append(bubble, meta);
  article.append(avatar, stack);
  return article;
}

function renderEmptyState() {
  elements.messages.innerHTML = "";

  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.innerHTML = `
    <h3>How can I help?</h3>
    <p>Choose a model, start typing, or switch to an audio-capable model if you want to talk and hear replies.</p>
    <div class="empty-state-actions">
      ${promptTemplates
        .map(
          (prompt) => `
            <button type="button" class="empty-state-action" data-prompt="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>
          `
        )
        .join("")}
    </div>
  `;

  empty.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      elements.messageInput.value = button.dataset.prompt || "";
      autoResizeTextarea();
      elements.messageInput.focus();
    });
  });

  elements.messages.appendChild(empty);
}

function renderMessages() {
  if (!state.activeMessages.length) {
    renderEmptyState();
    return;
  }

  elements.messages.innerHTML = "";
  state.activeMessages.forEach((message) => {
    elements.messages.appendChild(createMessageElement(message));
  });
  elements.messages.scrollTop = elements.messages.scrollHeight;
}

function appendMessageToView(message, isStreaming = false) {
  if (elements.messages.querySelector(".empty-state")) {
    elements.messages.innerHTML = "";
  }

  elements.messages.appendChild(createMessageElement(message, isStreaming));
  elements.messages.scrollTop = elements.messages.scrollHeight;
}

function replaceMessageInView(messageId, message) {
  const previous = elements.messages.querySelector(`[data-message-id="${messageId}"]`);
  if (!previous) {
    appendMessageToView(message);
    return;
  }

  previous.replaceWith(createMessageElement(message));
  elements.messages.scrollTop = elements.messages.scrollHeight;
}

function updateStreamingBubble(messageId, content, done = false) {
  const messageElement = elements.messages.querySelector(`[data-message-id="${messageId}"]`);
  if (!messageElement) {
    return;
  }

  const contentElement = messageElement.querySelector(".message-content");
  const role = messageElement.classList.contains("assistant") ? "assistant" : "user";
  contentElement.innerHTML = role === "assistant" ? renderMarkdown(content || "") : renderPlainText(content || "");

  if (done) {
    messageElement.classList.remove("streaming");
  }

  elements.messages.scrollTop = elements.messages.scrollHeight;
}

function renderChatList() {
  elements.chatList.innerHTML = "";

  if (!state.chats.length) {
    const placeholder = document.createElement("div");
    placeholder.className = "chat-list-empty";
    placeholder.textContent = "No chats yet. Start a new conversation.";
    elements.chatList.appendChild(placeholder);
    return;
  }

  state.chats.forEach((chat) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chat-item";
    if (chat.id === state.activeChatId) {
      button.classList.add("active");
    }

    button.innerHTML = `
      <div class="chat-item-title">${escapeHtml(chat.title)}</div>
      <div class="chat-item-meta">
        <span>${escapeHtml(modelLabel(chat.model))}</span>
        <span>${escapeHtml(compactDate(chat.updated_at))}</span>
      </div>
      <div class="chat-item-snippet">${escapeHtml(chat.snippet || "No messages yet.")}</div>
    `;

    button.addEventListener("click", () => {
      loadChat(chat.id);
      closeSidebar();
    });

    elements.chatList.appendChild(button);
  });
}

function autoResizeTextarea() {
  elements.messageInput.style.height = "0px";
  const nextHeight = Math.min(elements.messageInput.scrollHeight, 180);
  elements.messageInput.style.height = `${nextHeight}px`;
}

function clearPendingImage() {
  if (state.pendingImage?.previewUrl && state.pendingImage.previewUrl.startsWith("blob:")) {
    URL.revokeObjectURL(state.pendingImage.previewUrl);
  }
  state.pendingImage = null;
  elements.imageInput.value = "";
  elements.attachmentPreview.innerHTML = "";
  elements.attachmentPreview.classList.add("hidden");
}

function renderPendingImage() {
  if (!state.pendingImage) {
    elements.attachmentPreview.innerHTML = "";
    elements.attachmentPreview.classList.add("hidden");
    return;
  }

  elements.attachmentPreview.classList.remove("hidden");
  elements.attachmentPreview.innerHTML = `
    <img src="${escapeHtml(state.pendingImage.previewUrl)}" alt="${escapeHtml(state.pendingImage.name)}" />
    <div class="attachment-preview-copy">
      <strong>${escapeHtml(state.pendingImage.name)}</strong>
      <span>${escapeHtml(state.pendingImage.mimeType)}</span>
    </div>
    <button type="button" class="attachment-remove" id="attachmentRemoveButton">Remove</button>
  `;

  const removeButton = document.getElementById("attachmentRemoveButton");
  if (removeButton) {
    removeButton.addEventListener("click", clearPendingImage);
  }
}

function openSidebar() {
  elements.sidebar.classList.add("open");
  elements.sidebarBackdrop.classList.add("visible");
}

function closeSidebar() {
  elements.sidebar.classList.remove("open");
  elements.sidebarBackdrop.classList.remove("visible");
}

async function loadModels() {
  enforceModelSelectEnabled();
  const data = await api("/api/models");
  state.models = data.models || [];
  elements.modelSelect.innerHTML = "";

  state.models.forEach((model) => {
    const option = document.createElement("option");
    option.value = model.id;
    option.textContent = `${model.label} [${capabilityTokens(model).join("/")}]`;
    elements.modelSelect.appendChild(option);
  });

  if (!state.models.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No models configured";
    elements.modelSelect.appendChild(option);
    syncVoiceUi();
    return;
  }

  state.selectedModel = state.models[0].id;
  elements.modelSelect.value = state.selectedModel;
  state.voiceReplyEnabled = Boolean(state.models[0].accepts_audio);
  enforceModelSelectEnabled();
  syncVoiceUi();
}

async function refreshChats() {
  const data = await api("/api/chats");
  state.chats = data.chats || [];
  renderChatList();
}

async function loadChat(chatId) {
  const data = await api(`/api/chats/${chatId}`);
  state.activeChatId = data.chat.id;
  state.activeChat = data.chat;
  state.activeMessages = data.messages || [];

  if (data.chat.model) {
    state.selectedModel = data.chat.model;
    elements.modelSelect.value = data.chat.model;
    if (!selectedModelSupportsAudio()) {
      state.voiceReplyEnabled = false;
    }
  }

  renderChatList();
  renderMessages();
  updateHeader();
  syncPromptActionUi();
  elements.deleteChatButton.disabled = false;
}

async function createNewChat() {
  const created = await api("/api/chats", {
    method: "POST",
    body: {
      model: state.selectedModel || state.models[0]?.id,
    },
  });

  await refreshChats();
  await loadChat(created.id);
}

async function deleteActiveChat() {
  if (!state.activeChatId) {
    return;
  }

  const shouldDelete = window.confirm("Delete this chat permanently?");
  if (!shouldDelete) {
    return;
  }

  await api(`/api/chats/${state.activeChatId}`, {
    method: "DELETE",
  });

  state.activeChatId = null;
  state.activeChat = null;
  state.activeMessages = [];

  await refreshChats();
  if (state.chats.length) {
    await loadChat(state.chats[0].id);
  } else {
    await createNewChat();
  }
}

function parseSseEvent(block) {
  if (!block) {
    return null;
  }

  let event = "message";
  const dataChunks = [];

  block.split("\n").forEach((line) => {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataChunks.push(line.slice(5).trim());
    }
  });

  if (!dataChunks.length) {
    return null;
  }

  const raw = dataChunks.join("\n");
  try {
    return { event, data: JSON.parse(raw) };
  } catch (_error) {
    return { event, data: { text: raw } };
  }
}

async function consumeSse(readable, onEvent) {
  const reader = readable.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");

    let separatorIndex = buffer.indexOf("\n\n");
    while (separatorIndex !== -1) {
      const rawEvent = buffer.slice(0, separatorIndex).trim();
      buffer = buffer.slice(separatorIndex + 2);

      const parsed = parseSseEvent(rawEvent);
      if (parsed) {
        await onEvent(parsed.event, parsed.data);
      }

      separatorIndex = buffer.indexOf("\n\n");
    }
  }

  const tailEvent = parseSseEvent(buffer.trim());
  if (tailEvent) {
    await onEvent(tailEvent.event, tailEvent.data);
  }
}

function clearActiveStreamController() {
  if (!activeStreamController) {
    return;
  }
  try {
    activeStreamController.abort();
  } catch (_error) {
    // Ignore abort errors.
  }
  activeStreamController = null;
}

async function sendTextStreamMessage(messageText) {
  const imageAttachment = state.pendingImage;

  if (!state.activeChatId) {
    await createNewChat();
  }

  const chatId = state.activeChatId;
  const selectedModelId = elements.modelSelect.value || state.selectedModel;

  if (state.activeChat) {
    state.activeChat.model = selectedModelId;
  }

  const userMessage = {
    id: `local-user-${Date.now()}`,
    chat_id: chatId,
    role: "user",
    content: messageText || "Sent an image",
    model: null,
    token_estimate: 0,
    has_audio: false,
    has_image: Boolean(imageAttachment),
    image_base64: imageAttachment?.base64 || null,
    image_mime_type: imageAttachment?.mimeType || null,
    created_at: new Date().toISOString(),
  };

  const assistantMessage = {
    id: `local-assistant-${Date.now()}`,
    chat_id: chatId,
    role: "assistant",
    content: "",
    model: selectedModelId,
    token_estimate: 0,
    has_audio: false,
    created_at: new Date().toISOString(),
  };

  state.activeMessages.push(userMessage, assistantMessage);
  appendMessageToView(userMessage);
  appendMessageToView(assistantMessage, true);

  elements.messageInput.value = "";
  clearPendingImage();
  autoResizeTextarea();
  updateHeader();
  setStreaming(true);

  try {
    clearActiveStreamController();
    const controller = new AbortController();
    activeStreamController = controller;

    const timeoutHandle = window.setTimeout(() => {
      controller.abort(new Error("Request timed out"));
    }, STREAM_REQUEST_TIMEOUT_MS);

    const response = await fetch(`/api/chats/${chatId}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        message: messageText,
        model: selectedModelId,
        image_base64: imageAttachment?.base64 || null,
        image_mime_type: imageAttachment?.mimeType || null,
      }),
    });

    window.clearTimeout(timeoutHandle);

    if (!response.ok || !response.body) {
      let detail = `Streaming request failed (${response.status})`;
      try {
        const body = await response.json();
        if (body?.detail) {
          detail = body.detail;
        }
      } catch (_error) {
        // Keep fallback detail.
      }
      throw new Error(detail);
    }

    let fullAssistantText = "";
    await consumeSse(response.body, async (event, data) => {
      if (event === "token") {
        const token = typeof data.token === "string" ? data.token : "";
        fullAssistantText += token;
        assistantMessage.content = fullAssistantText;
        updateStreamingBubble(assistantMessage.id, fullAssistantText, false);
      } else if (event === "error") {
        throw new Error(data?.message || "Streaming failed");
      }
    });

    if (!assistantMessage.content) {
      assistantMessage.content = "I was not able to generate a response this time.";
    }

    updateStreamingBubble(assistantMessage.id, assistantMessage.content, true);

    await refreshChats();
    await loadChat(chatId);
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === "AbortError";
    const messageTextValue = aborted
      ? "The request took too long and was cancelled."
      : error instanceof Error
        ? error.message
        : "Unexpected streaming error";
    assistantMessage.content = `Error: ${messageTextValue}`;
    updateStreamingBubble(assistantMessage.id, assistantMessage.content, true);
    showToast(messageTextValue);
  } finally {
    clearActiveStreamController();
    setStreaming(false);
    elements.messageInput.focus();
  }
}

async function autoplayAssistantAudio(messageId) {
  await new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });

  const audio = elements.messages.querySelector(`[data-message-id="${messageId}"] audio`);
  if (!audio) {
    return;
  }

  try {
    await audio.play();
  } catch (_error) {
    // Ignore autoplay rejection.
  }
}

async function sendAudioTurn({
  messageText = "",
  audioBase64 = null,
  audioFormat = null,
  userDisplayText = null,
}) {
  if (!selectedModelSupportsAudio()) {
    showToast("Choose an audio-capable model to use voice.");
    return;
  }

  if (!messageText && !audioBase64) {
    return;
  }

  if (!state.activeChatId) {
    await createNewChat();
  }

  const chatId = state.activeChatId;
  const selectedModelId = elements.modelSelect.value || state.selectedModel;

  if (state.activeChat) {
    state.activeChat.model = selectedModelId;
  }

  const userMessage = {
    id: `local-user-${Date.now()}`,
    chat_id: chatId,
    role: "user",
    content: userDisplayText || messageText || "Voice message",
    model: null,
    token_estimate: 0,
    has_audio: Boolean(audioBase64),
    audio_format: audioFormat,
    created_at: new Date().toISOString(),
  };

  const assistantMessage = {
    id: `local-assistant-${Date.now()}`,
    chat_id: chatId,
    role: "assistant",
    content: "Working on your reply...",
    model: selectedModelId,
    token_estimate: 0,
    has_audio: false,
    created_at: new Date().toISOString(),
  };
  const assistantLocalId = assistantMessage.id;

  state.activeMessages.push(userMessage, assistantMessage);
  appendMessageToView(userMessage);
  appendMessageToView(assistantMessage, true);

  elements.messageInput.value = "";
  autoResizeTextarea();
  updateHeader();
  setStreaming(true);

  try {
    const payload = await api(`/api/chats/${chatId}/audio`, {
      method: "POST",
      body: {
        message: messageText || "",
        audio_base64: audioBase64,
        audio_format: audioFormat,
        model: selectedModelId,
        voice: "alloy",
        response_format: "wav",
      },
    });

    assistantMessage.id = payload.id || assistantMessage.id;
    assistantMessage.content = payload.text || payload.audio_transcript || "I was not able to generate a response this time.";
    assistantMessage.has_audio = Boolean(payload.audio_base64);
    assistantMessage.audio_base64 = payload.audio_base64 || null;
    assistantMessage.audio_format = payload.audio_format || "wav";
    assistantMessage.audio_transcript = payload.audio_transcript || null;
    assistantMessage.audio_voice = payload.audio_voice || null;
    replaceMessageInView(assistantLocalId, assistantMessage);

    await refreshChats();
    await loadChat(chatId);

    if (payload.audio_base64 && payload.id) {
      await autoplayAssistantAudio(payload.id);
    }
  } catch (error) {
    const messageValue = error instanceof Error ? error.message : "Audio request failed";
    assistantMessage.content = `Error: ${messageValue}`;
    replaceMessageInView(assistantMessage.id, assistantMessage);
    showToast(messageValue);
  } finally {
    setStreaming(false);
    elements.messageInput.focus();
  }
}

function writeAscii(view, offset, value) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function mixToMono(audioBuffer) {
  const channelCount = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const mono = new Float32Array(length);

  for (let channel = 0; channel < channelCount; channel += 1) {
    const samples = audioBuffer.getChannelData(channel);
    for (let index = 0; index < length; index += 1) {
      mono[index] += samples[index] / channelCount;
    }
  }

  return mono;
}

function encodeWav(audioBuffer) {
  const samples = mixToMono(audioBuffer);
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, audioBuffer.sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }

  return buffer;
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

async function fileToBase64(file) {
  const buffer = await file.arrayBuffer();
  return arrayBufferToBase64(buffer);
}

async function handleImageSelection(file) {
  if (!file) {
    return;
  }

  if (!selectedModelSupportsImage()) {
    showToast("Choose a model that accepts images first.");
    elements.imageInput.value = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    showToast("Please choose an image file.");
    elements.imageInput.value = "";
    return;
  }

  const base64 = await fileToBase64(file);
  if (state.pendingImage?.previewUrl) {
    URL.revokeObjectURL(state.pendingImage.previewUrl);
  }

  state.pendingImage = {
    name: file.name,
    mimeType: file.type || "image/png",
    base64,
    previewUrl: URL.createObjectURL(file),
  };
  renderPendingImage();
}

async function convertBlobToWavBase64(blob) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error("This browser cannot process recorded audio.");
  }

  const audioContext = new AudioContextClass();

  try {
    const rawBuffer = await blob.arrayBuffer();
    const decoded = await audioContext.decodeAudioData(rawBuffer.slice(0));
    return arrayBufferToBase64(encodeWav(decoded));
  } catch (_error) {
    throw new Error("Could not convert the recorded audio to wav.");
  } finally {
    await audioContext.close().catch(() => {});
  }
}

function cleanupRecordingStream() {
  if (!state.recordingStream) {
    return;
  }

  state.recordingStream.getTracks().forEach((track) => track.stop());
  state.recordingStream = null;
}

function pickRecorderMimeType() {
  if (!window.MediaRecorder || typeof window.MediaRecorder.isTypeSupported !== "function") {
    return "";
  }

  const options = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];

  return options.find((value) => window.MediaRecorder.isTypeSupported(value)) || "";
}

async function startRecording() {
  if (!selectedModelSupportsAudio()) {
    showToast("Choose an audio-capable model to record voice.");
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    showToast("Audio recording is not supported in this browser.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = pickRecorderMimeType();
    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

    state.recordingStream = stream;
    state.mediaRecorder = recorder;
    state.recordingChunks = [];
    state.isRecording = true;
    syncVoiceUi();

    recorder.addEventListener("dataavailable", (event) => {
      if (event.data && event.data.size) {
        state.recordingChunks.push(event.data);
      }
    });

    recorder.addEventListener("stop", async () => {
      const blob = new Blob(state.recordingChunks, {
        type: recorder.mimeType || mimeType || "audio/webm",
      });

      state.recordingChunks = [];
      state.mediaRecorder = null;
      cleanupRecordingStream();

      try {
        const audioBase64 = await convertBlobToWavBase64(blob);
        await sendAudioTurn({
          messageText: elements.messageInput.value.trim(),
          audioBase64,
          audioFormat: "wav",
          userDisplayText: elements.messageInput.value.trim() || "Voice message",
        });
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Voice message failed");
      } finally {
        state.isPreparingAudio = false;
        syncVoiceUi();
      }
    });

    recorder.start();
  } catch (error) {
    cleanupRecordingStream();
    state.isRecording = false;
    state.mediaRecorder = null;
    syncVoiceUi();
    showToast(error instanceof Error ? error.message : "Microphone access failed");
  }
}

function stopRecordingAndSend() {
  if (!state.mediaRecorder || state.mediaRecorder.state === "inactive") {
    return;
  }

  state.isRecording = false;
  state.isPreparingAudio = true;
  syncVoiceUi();
  state.mediaRecorder.stop();
}

async function sendMessage() {
  if (state.isStreaming || state.isPreparingAudio) {
    return;
  }

  if (state.isEditingLastPrompt) {
    await submitEditedLastPrompt();
    return;
  }

  const messageText = elements.messageInput.value.trim();
  if (!messageText && !state.pendingImage) {
    return;
  }

  if (state.pendingImage && !selectedModelSupportsImage()) {
    showToast("Selected model does not accept images.");
    return;
  }

  if (selectedModelSupportsAudio() && state.voiceReplyEnabled) {
    await sendAudioTurn({
      messageText,
      userDisplayText: messageText,
    });
    return;
  }

  await sendTextStreamMessage(messageText);
}

function bindEvents() {
  elements.newChatButton.addEventListener("click", async () => {
    if (state.isStreaming) {
      return;
    }

    try {
      await createNewChat();
      closeSidebar();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not create chat");
    }
  });

  elements.deleteChatButton.addEventListener("click", async () => {
    if (state.isStreaming) {
      return;
    }

    try {
      await deleteActiveChat();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not delete chat");
    }
  });

  elements.modelSelect.addEventListener("change", () => {
    const previousSupportsAudio = Boolean(modelById(state.selectedModel)?.accepts_audio);
    state.selectedModel = elements.modelSelect.value;

    if (state.activeChat) {
      state.activeChat.model = state.selectedModel;
    }

    if (!selectedModelSupportsAudio()) {
      state.voiceReplyEnabled = false;
    } else if (!previousSupportsAudio) {
      state.voiceReplyEnabled = true;
    }

    updateHeader();
    renderChatList();
    renderPendingImage();
  });

  elements.attachImageButton.addEventListener("click", () => {
    if (!selectedModelSupportsImage()) {
      showToast("Choose a model that accepts images first.");
      return;
    }
    elements.imageInput.click();
  });

  elements.imageInput.addEventListener("change", () => {
    const [file] = elements.imageInput.files || [];
    handleImageSelection(file).catch((error) => {
      showToast(error instanceof Error ? error.message : "Image upload failed");
    });
  });

  elements.sendButton.addEventListener("click", () => {
    sendMessage().catch((error) => {
      showToast(error instanceof Error ? error.message : "Send failed");
      setStreaming(false);
    });
  });

  elements.messageInput.addEventListener("input", autoResizeTextarea);

  elements.messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage().catch((error) => {
        showToast(error instanceof Error ? error.message : "Send failed");
        setStreaming(false);
      });
    }
  });

  elements.recordButton.addEventListener("click", () => {
    if (state.isRecording) {
      stopRecordingAndSend();
      return;
    }

    startRecording().catch((error) => {
      showToast(error instanceof Error ? error.message : "Voice recording failed");
    });
  });

  elements.voiceReplyButton.addEventListener("click", () => {
    if (!selectedModelSupportsAudio() || state.isStreaming) {
      return;
    }
    state.voiceReplyEnabled = !state.voiceReplyEnabled;
    syncVoiceUi();
  });

  elements.regenerateButton.addEventListener("click", () => {
    if (state.isStreaming || state.isPreparingAudio || !state.activeChatId) {
      return;
    }

    setEditingLastPrompt(false);
    regenerateLastPromptForChat(state.activeChatId).catch((error) => {
      showToast(error instanceof Error ? error.message : "Regenerate failed");
    });
  });

  elements.editLastPromptButton.addEventListener("click", () => {
    if (state.isStreaming || state.isPreparingAudio) {
      return;
    }

    if (state.isEditingLastPrompt) {
      setEditingLastPrompt(false);
      clearPendingImage();
      elements.messageInput.value = "";
      autoResizeTextarea();
      return;
    }

    loadLastPromptIntoComposer();
  });

  elements.deleteLastPromptButton.addEventListener("click", () => {
    if (state.isStreaming || state.isPreparingAudio) {
      return;
    }

    deleteLastPrompt().catch((error) => {
      showToast(error instanceof Error ? error.message : "Delete last prompt failed");
    });
  });

  elements.sidebarOpenButton.addEventListener("click", openSidebar);
  elements.sidebarCloseButton.addEventListener("click", closeSidebar);
  elements.sidebarBackdrop.addEventListener("click", closeSidebar);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (state.isRecording) {
        stopRecordingAndSend();
        return;
      }
      closeSidebar();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) {
      closeSidebar();
    }
  });
}

async function initialize() {
  clearActiveStreamController();
  guardModelSelectEnabled();
  setStreaming(false);
  bindEvents();
  autoResizeTextarea();
  syncPromptActionUi();

  try {
    await loadModels();
    await refreshChats();

    if (state.chats.length) {
      await loadChat(state.chats[0].id);
    } else {
      await createNewChat();
    }

    elements.messageInput.focus();
  } catch (error) {
    showToast(error instanceof Error ? error.message : "App initialization failed");
    renderEmptyState();
  }
}

window.addEventListener("pageshow", () => {
  clearActiveStreamController();
  setStreaming(false);
});

window.addEventListener("beforeunload", () => {
  clearActiveStreamController();
});

initialize().catch((error) => {
  showToast(error instanceof Error ? error.message : "Fatal startup error");
});
