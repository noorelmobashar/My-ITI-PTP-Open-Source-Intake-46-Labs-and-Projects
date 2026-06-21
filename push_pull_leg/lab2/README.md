# WhatsApp Clone 💬

A real-time messaging application built with React, Express.js, Socket.IO, and MongoDB. Features one-to-one chat, group messaging, and a WhatsApp-inspired dark theme.

## ✨ Features

- **User Authentication** — Register, login, and session persistence via JWT
- **One-to-One Chat** — Real-time messaging between two users
- **Group Chats** — Create groups, add participants, and chat in real time
- **Chat List** — All conversations sorted by recent activity with message previews
- **Real-Time Communication** — Powered by Socket.IO with rooms
- **Typing Indicators** — See when someone is typing
- **Online Status** — See which users are currently online
- **Chat History** — Messages persist in MongoDB and load on page refresh

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router, Axios |
| Backend | Express.js, Node.js |
| Real-Time | Socket.IO |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcrypt |
| Styling | Vanilla CSS (WhatsApp dark theme) |

## 📁 Project Structure

```
├── server/                  # Backend
│   ├── index.js             # Express + Socket.IO + MongoDB setup
│   ├── models/
│   │   ├── User.js          # User schema with password hashing
│   │   ├── Chat.js          # Chat schema (private/group)
│   │   └── Message.js       # Message schema
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js          # Register, login, profile
│   │   ├── users.js         # User search
│   │   ├── chats.js         # Create/list chats
│   │   └── messages.js      # Send/fetch messages
│   └── socket/
│       └── socketHandler.js # Socket.IO event handlers
│
├── client/                  # Frontend (Vite + React)
│   └── src/
│       ├── App.jsx          # Routing & providers
│       ├── index.css        # Design system (WhatsApp theme)
│       ├── context/
│       │   ├── AuthContext.jsx   # Auth state management
│       │   ├── SocketContext.jsx # Socket.IO connection
│       │   └── ChatContext.jsx   # Chat & messages state
│       ├── pages/
│       │   ├── AuthPage.jsx      # Login/Register
│       │   └── ChatPage.jsx      # Main chat layout
│       ├── components/
│       │   ├── ChatList.jsx      # Sidebar chat list
│       │   ├── ChatListItem.jsx  # Individual chat item
│       │   ├── ChatWindow.jsx    # Active chat view
│       │   ├── MessageBubble.jsx # Message bubble component
│       │   ├── MessageInput.jsx  # Message text input
│       │   ├── UserSearch.jsx    # Search users
│       │   └── CreateGroupModal.jsx # Group creation dialog
│       └── utils/
│           └── api.js       # Axios instance with JWT interceptor
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd lab2
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Edit `server/.env` with your MongoDB connection string:

```env
MONGO_URI=mongodb://localhost:27017/whatsapp-clone
JWT_SECRET=your_secret_key_here
PORT=5000
```

Start the backend:

```bash
npm run dev
```

### 3. Setup the Frontend

```bash
cd client
npm install
npm run dev
```

The app will be running at **http://localhost:5173**

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get current user profile | ✅ |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| GET | `/api/users/search?username=query` | Search users | ✅ |

### Chats

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| GET | `/api/chats` | List all user's chats | ✅ |
| POST | `/api/chats` | Create a new chat | ✅ |
| GET | `/api/chats/:chatId` | Get chat details | ✅ |

### Messages

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| GET | `/api/messages/:chatId` | Get messages for a chat | ✅ |
| POST | `/api/messages` | Send a new message | ✅ |

## 🔌 Socket.IO Events

### Client → Server

| Event | Data | Description |
|-------|------|-------------|
| `user-online` | `userId` | Register user as online |
| `join-chats` | `[chatId1, chatId2, ...]` | Join all chat rooms |
| `join-chat` | `chatId` | Join a specific chat room |
| `send-message` | `{ chatId, message }` | Send a message to a room |
| `typing` | `{ chatId, userId, username }` | User is typing |
| `stop-typing` | `{ chatId, userId }` | User stopped typing |
| `new-chat-created` | `{ chat, participantIds }` | Notify about new chat |

### Server → Client

| Event | Data | Description |
|-------|------|-------------|
| `online-users` | `[userId1, userId2, ...]` | Updated online users list |
| `receive-message` | `{ chatId, message }` | New message received |
| `user-typing` | `{ chatId, userId, username }` | Someone is typing |
| `user-stop-typing` | `{ chatId, userId }` | Someone stopped typing |
| `chat-created` | `chat` | New chat was created for you |

## 🎨 Design System

The UI follows a WhatsApp-inspired dark theme ("Shadow Green Communication System"):

- **Background**: `#0B141A` (deep dark)
- **Surface**: `#111B21` (sidebar, headers)
- **Outgoing Bubbles**: `#005C4B` (WhatsApp green)
- **Incoming Bubbles**: `#202C33` (dark gray)
- **Primary Green**: `#25D366` (buttons, accents)
- **Font**: Inter

## 📝 License

This project is for educational purposes (ITI Training).
