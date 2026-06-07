<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-950 p-4 font-sans">
    <div class="flex flex-col w-full max-w-2xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-gray-800 bg-gray-900">

      <!-- Header -->
      <header class="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 shrink-0">
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
            </svg>
          </div>
          <span class="absolute -bottom-0.5 -right-0.5 block w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-indigo-600"></span>
        </div>
        <div>
          <h1 class="text-white font-semibold text-lg leading-tight">AI Support Agent</h1>
          <p class="text-indigo-200 text-xs">Always online · Powered by AI</p>
        </div>
        <button
          @click="startNewSession"
          class="ml-auto text-xs font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all duration-200"
        >
          New Chat
        </button>
      </header>

      <!-- Message History -->
      <div ref="messageContainer" class="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth custom-scrollbar">

        <!-- Welcome message when empty -->
        <div v-if="messages.length === 0 && !isLoading" class="flex flex-col items-center justify-center h-full text-center gap-4 opacity-60">
          <div class="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
            </svg>
          </div>
          <div>
            <p class="text-gray-300 font-medium text-sm">How can I help you today?</p>
            <p class="text-gray-500 text-xs mt-1">Send a message to start the conversation.</p>
          </div>
        </div>

        <!-- Messages -->
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="flex"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <!-- AI avatar -->
          <div v-if="msg.role === 'ai'" class="shrink-0 mr-2 mt-1">
            <div class="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-indigo-400" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
              </svg>
            </div>
          </div>

          <div class="max-w-[75%] space-y-1">
            <!-- Bubble -->
            <div
              class="px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words"
              :class="msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-2xl rounded-br-md'
                : 'bg-gray-800 text-gray-200 rounded-2xl rounded-bl-md border border-gray-700/50'"
            >
              {{ msg.text }}
            </div>

            <!-- Tools badge (AI messages only) -->
            <div v-if="msg.role === 'ai' && msg.tools && msg.tools.length" class="flex flex-wrap gap-1.5 px-1">
              <span
                v-for="(tool, tIdx) in msg.tools"
                :key="tIdx"
                class="inline-flex items-center gap-1 text-[10px] font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2 py-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a9 9 0 0 1-15.2 9.3L2 18.6l3.7-4.3a9 9 0 0 1 9-8z"/>
                </svg>
                {{ tool }}
              </span>
            </div>

            <!-- Timestamp -->
            <p
              class="text-[10px] px-1"
              :class="msg.role === 'user' ? 'text-gray-500 text-right' : 'text-gray-600'"
            >
              {{ msg.timestamp }}
            </p>
          </div>

          <!-- User avatar -->
          <div v-if="msg.role === 'user'" class="shrink-0 ml-2 mt-1">
            <div class="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="isLoading" class="flex justify-start">
          <div class="shrink-0 mr-2 mt-1">
            <div class="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-indigo-400" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
              </svg>
            </div>
          </div>
          <div class="bg-gray-800 border border-gray-700/50 rounded-2xl rounded-bl-md px-5 py-3 flex items-center gap-1.5">
            <span class="typing-dot w-2 h-2 rounded-full bg-indigo-400"></span>
            <span class="typing-dot w-2 h-2 rounded-full bg-indigo-400 animation-delay-200"></span>
            <span class="typing-dot w-2 h-2 rounded-full bg-indigo-400 animation-delay-400"></span>
          </div>
        </div>
      </div>

      <!-- Error banner -->
      <div v-if="errorMsg" class="mx-4 mb-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center justify-between">
        <span>{{ errorMsg }}</span>
        <button @click="errorMsg = ''" class="text-red-400 hover:text-red-300 ml-2">✕</button>
      </div>

      <!-- Input Area -->
      <div class="shrink-0 px-4 py-3 bg-gray-900 border-t border-gray-800">
        <form @submit.prevent="sendMessage" class="flex items-end gap-2">
          <div class="flex-1 relative">
            <textarea
              ref="inputRef"
              v-model="userInput"
              @keydown.enter.exact.prevent="sendMessage"
              :disabled="isLoading"
              rows="1"
              placeholder="Type your message..."
              class="w-full resize-none rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-100 placeholder-gray-500 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 disabled:opacity-40 custom-scrollbar"
              :class="{ 'ring-2 ring-indigo-500/30': isFocused }"
              @focus="isFocused = true"
              @blur="isFocused = false"
              @input="autoResize"
            ></textarea>
          </div>
          <button
            type="submit"
            :disabled="isLoading || !userInput.trim()"
            class="shrink-0 w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white flex items-center justify-center transition-all duration-200 active:scale-95"
          >
            <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m5 12 7-7 7 7" /><path d="M12 19V5" />
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

// ── State ──────────────────────────────────────────
const messages = ref([])
const userInput = ref('')
const isLoading = ref(false)
const isFocused = ref(false)
const errorMsg = ref('')
const sessionId = ref(null)

const messageContainer = ref(null)
const inputRef = ref(null)

const API_URL = 'http://localhost:8000/api/chat/'

// ── Helpers ────────────────────────────────────────
function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function scrollToBottom() {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

function autoResize(event) {
  const el = event.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

// ── Actions ────────────────────────────────────────
async function sendMessage() {
  const text = userInput.value.trim()
  if (!text || isLoading.value) return

  // Push user message
  messages.value.push({
    role: 'user',
    text,
    timestamp: formatTime()
  })

  userInput.value = ''
  // Reset textarea height
  if (inputRef.value) {
    inputRef.value.style.height = 'auto'
  }

  isLoading.value = true
  errorMsg.value = ''
  scrollToBottom()

  try {
    const body = { user_text: text }
    if (sessionId.value) {
      body.session_id = sessionId.value
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `Server error (${response.status})`)
    }

    // Persist the session ID for follow-up messages
    if (data.session) {
      sessionId.value = data.session
    }

    // Push AI response
    messages.value.push({
      role: 'ai',
      text: data.ai_response || 'No response received.',
      tools: data.tools_used || [],
      timestamp: formatTime()
    })
  } catch (err) {
    errorMsg.value = err.message || 'Something went wrong. Please try again.'
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

function startNewSession() {
  messages.value = []
  sessionId.value = null
  errorMsg.value = ''
  nextTick(() => inputRef.value?.focus())
}

// ── Lifecycle ──────────────────────────────────────
onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style scoped>
/* Typing dots animation */
.typing-dot {
  animation: typingBounce 1.4s infinite ease-in-out both;
}
.animation-delay-200 {
  animation-delay: 0.2s;
}
.animation-delay-400 {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.2);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.4);
}
</style>
