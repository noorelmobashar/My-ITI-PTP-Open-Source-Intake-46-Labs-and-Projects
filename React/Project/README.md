# Smart Notes Workspace

Full Stack application built with React and Node.js. Includes authentication, protected routes, CRUD operations, and responsive UI.

## Tech Stack

### Frontend
- React 19 (Vite)
- React Router DOM
- React Hook Form + Zod
- TanStack Query
- Redux Toolkit
- Axios
- React Bootstrap

### Backend
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- Joi Validation
- Multer (file upload)

## Project Structure

```
Project/
├── frontend/          # React application
│   └── src/
│       ├── api/           # Axios instance
│       ├── components/    # Reusable components
│       ├── layouts/       # Layout wrapper
│       ├── pages/         # All pages
│       └── store/         # Redux store + slices
├── backend/           # Node.js API
│   ├── controllers/   # Request handlers
│   ├── middlewares/    # Auth, validation, error handling
│   ├── models/        # Mongoose models
│   ├── routes/        # Express routes
│   ├── services/      # Business logic
│   ├── utils/         # Utility classes
│   └── validations/   # Joi schemas
├── .env.example
└── Smart_Notes_Workspace.postman_collection.json
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Fill in your `.env` values:
   ```
   DATABASE_URI="mongodb://localhost:27017/smart-notes"
   PORT=5000
   JWT_SECRET="your-secret-key-here"
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   App runs on `http://localhost:5173`

## API Endpoints

| Method | Endpoint       | Description          | Auth |
|--------|---------------|----------------------|------|
| POST   | /auth/register | Register new user    | No   |
| POST   | /auth/login    | Login user           | No   |
| GET    | /auth/me       | Get current user     | Yes  |
| PATCH  | /auth/me       | Update profile       | Yes  |
| GET    | /notes         | List notes (paginated) | Yes |
| GET    | /notes/:id     | Get single note      | Yes  |
| POST   | /notes         | Create note          | Yes  |
| PATCH  | /notes/:id     | Update note          | Yes  |
| DELETE | /notes/:id     | Delete note          | Yes  |

### Query Parameters for GET /notes

| Param   | Description                     | Example          |
|---------|---------------------------------|------------------|
| page    | Page number                     | 1                |
| limit   | Items per page                  | 10               |
| search  | Search in title and content     | "meeting"        |
| category| Filter by category              | personal/work/study/other |
| status  | Filter by status                | draft/published/archived |
| sortBy  | Sort field                      | createdAt/updatedAt/title |
| order   | Sort direction                  | asc/desc         |

## Features

- JWT Authentication (Register/Login)
- Protected Routes
- Full CRUD for Notes
- Search (debounced)
- Filter by Category/Status
- Sorting
- Pagination
- Loading, Error, and Empty States
- Confirmation before Delete
- Dark/Light Theme Toggle
- Profile Image Upload
- Responsive Design

## Postman

Import `Smart_Notes_Workspace.postman_collection.json` into Postman. The collection auto-saves the token after Register/Login requests.

## Database Models

### User
- name (String, required)
- email (String, unique, required)
- password (String, required)
- profileImage (String)
- timestamps

### Note
- title (String, required)
- content (String, required)
- category (String, enum: personal/work/study/other)
- tags (Array of Strings)
- status (String, enum: draft/published/archived)
- isPinned (Boolean)
- user (ObjectId, ref: User)
- timestamps
