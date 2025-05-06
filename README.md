# 📝 TaskMaster - Team Task Management Backend

TaskMaster is a collaborative team-based task management backend system built with Node.js, Express.js, MongoDB, and WebSockets. It supports user authentication, project and team management, task tracking, real-time updates, and AI-generated task descriptions.

---

## 🚀 Features

- 🔐 User Registration, Login, and Secure Logout
- 👥 Team/Project creation and member invitations
- ✅ Task assignment, status updates, filtering & search
- 💬 Comment system for collaborative discussions
- 📂 File attachments with static upload support
- 🔔 Real-time notifications using WebSockets (Socket.io)
- 🧠 AI-powered task summaries via OpenAI GPT
- 🧾 User profile management (GET/UPDATE)

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas via Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **AI**: OpenAI GPT-3.5
- **Storage**: Multer for file uploads
- **Dev Tools**: Nodemon, Postman for testing

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/seenapv-here/taskmaster.git
cd taskmaster
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
```

### 4. Start the Server

```bash
npm run dev
```

---

## 🔑 API Endpoints Overview

### 🧑 Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get token |
| PUT | `/api/auth/:id` | Update user profile |
| POST | `/api/auth/logout` | Securely log out |

### 📋 Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for logged-in user |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id/complete` | Mark a task as completed |
| PUT | `/api/tasks/:id/assign` | Assign task to another member |
| GET | `/api/tasks/filter?status=completed` | Filter by status |
| GET | `/api/tasks/search?q=title` | Search by title/description |
| POST | `/api/tasks/generate-description` | AI-generated task summary |

### 👥 Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/teams` | Create a team |
| POST | `/api/teams/:id/invite` | Invite member by email |

### 💬 Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/comments/:taskId` | Add comment to a task |
| GET | `/api/comments/:taskId` | Get comments for a task |

---

## 📁 File Uploads

Files uploaded to tasks are stored under the `uploads/` directory and accessible via:

```
http://localhost:5000/uploads/<filename>
```

---

## 🧠 AI Integration

TaskMaster uses OpenAI to generate smart task descriptions. To enable:

- Set `OPENAI_API_KEY` in your `.env`
- Use `/api/tasks/generate-description` with a task title

---

## 🔌 WebSocket Notifications

Real-time updates are powered by `socket.io`:

- New task assigned
- Task status updates
- Comments

Integrate on the frontend with the socket server running on the same port.

---
## 🧪 Postman Collection

A pre-built Postman collection is available under `/postman/TaskMaster.postman_collection.json`

---

## 🙌 Acknowledgements

- [Express](https://expressjs.com)
- [Mongoose](https://mongoosejs.com)
- [Socket.io](https://socket.io)
- [OpenAI](https://platform.openai.com)
- [Multer](https://github.com/expressjs/multer)

---

> Built with ❤️ by Seena