# AuraX — Full Stack Social Media Platform

<div align="center">

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)]()
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)]()
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge)]()
[![ImageKit](https://img.shields.io/badge/Storage-ImageKit-1C3144?style=for-the-badge)]()
[![Redux](https://img.shields.io/badge/State-Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)]()

### Production-Grade Social Media Application

A feature-rich, full-stack social media platform demonstrating scalable architecture, real-time interactions, modern authentication, and production-level engineering practices. Connect with users globally through posts, stories, messaging, and user discovery.

</div>

---

## 🔗 Links

| Platform | Link |
|---|---|
| 🟢 Live App | https://aura-x-social-media-app.vercel.app |
| 💻 GitHub Repository | https://github.com/aaryan498/AuraX-Social-Media-App |
| 👤 LinkedIn | https://www.linkedin.com/in/aaryan-kumar-ai-498-coder/ |

---

# Overview

**AuraX** is a comprehensive, production-style social media application that showcases modern full-stack development practices — from secure authentication and scalable API design to cloud-based media handling and responsive user interface.

The platform demonstrates:
- **Clean Architecture**: Separation of concerns with modular design
- **Scalable Infrastructure**: Cloud storage, database optimization, and efficient state management
- **Real-World Features**: Authentication, media uploads, messaging, and social networking
- **Enterprise Standards**: Error handling, security, and code organization

Perfect for understanding how professional social media platforms are built and maintained.

---

# ✨ Core Features

## 🔐 Authentication & User System

- **Secure Authentication**: Clerk OAuth integration for safe user authentication
- **User Profiles**: Customizable profiles with bio, profile picture, and cover photo
- **User Discovery**: Search and discover users by name, username, bio, or location
- **Follower System**: Follow/unfollow users and build your network
- **Connection Requests**: Send, accept, and manage connection requests

## 📝 Post Management

- **Create Posts**: Share text, images, or combined text-with-image posts
- **Like Posts**: Like and unlike posts from your feed
- **Post Feed**: Dynamic feed showing posts from connections and following
- **Media Support**: Upload up to 4 images per post with cloud storage
- **Post Type Classification**: Automatic detection of post type (text, image, text-with-image)

## 📸 Stories

- **Story Sharing**: Create temporary stories with text or media
- **Auto-Deletion**: Stories automatically delete after 24 hours using background jobs
- **Story Viewing**: View stories from connections and following
- **Multiple Media Types**: Support for text, image, and video stories
- **Background Customization**: Customize story background colors

## 💬 Real-Time Messaging

- **One-to-One Messaging**: Send and receive messages from other users
- **Message History**: Persistent chat history for all conversations
- **Media Sharing**: Share images through messages
- **Message Status**: Track read/unread message status
- **Recent Messages**: Quick access to recent conversations

## 🌐 Social Network

- **Connections**: Manage user connections and relationships
- **Following System**: Follow users and see their content in feed
- **User Cards**: Quick user information cards with follow/connect options
- **Profile Visiting**: Visit other users' profiles and see their posts

## 🎨 User Interface

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Built with Tailwind CSS for clean, modern design
- **Smooth Animations**: Framer Motion for fluid user interactions
- **Toast Notifications**: Real-time feedback for user actions
- **Redux State Management**: Efficient global state management

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose | Version |
|---|---|---|
| **React** | UI Framework | 19.2.0 |
| **Vite** | Build Tool | Latest |
| **Redux Toolkit** | State Management | 2.11.2 |
| **React Router DOM** | Navigation | 7.13.0 |
| **Tailwind CSS** | Styling | 4.1.18 |
| **Axios** | HTTP Client | 1.13.6 |
| **React Hot Toast** | Notifications | 2.6.0 |
| **Lucide React** | Icons | 0.563.0 |
| **Moment.js** | Date/Time | 2.30.1 |
| **Clerk React** | Authentication | 5.60.0 |

## Backend

| Technology | Purpose | Version |
|---|---|---|
| **Node.js** | Runtime | Latest |
| **Express.js** | Framework | 5.2.1 |
| **MongoDB** | Database | Latest |
| **Mongoose** | ODM | 9.2.2 |
| **Clerk Express** | Auth Middleware | 1.7.74 |
| **ImageKit** | Media Storage | 6.0.0 |
| **Multer** | File Upload | 2.0.2 |
| **Inngest** | Background Jobs | 3.52.3 |
| **Nodemailer** | Email Service | 8.0.1 |
| **CORS** | Cross-Origin | 2.8.6 |
| **Dotenv** | Env Variables | 17.3.1 |

## External Services

| Service | Purpose |
|---|---|
| **Clerk** | User Authentication & Management |
| **ImageKit** | Image/Media Storage & Optimization |
| **MongoDB Atlas** | Cloud Database |
| **Inngest** | Background Job Processing |
| **Nodemailer** | Email Notifications |
| **Vercel** | Frontend Deployment |

---

# 🏗️ Project Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (React/Vite)                      │
│  ┌─────────────┬──────────────┬────────────┬──────────────┐ │
│  │   Pages     │ Components   │   Redux    │  API Calls   │ │
│  └─────────────┴──────────────┴────────────┴──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↓ REST API
┌─────────────────────────────────────────────────────────────┐
│               Backend (Express.js/Node.js)                  │
│  ┌─────────────┬──────────────┬──────────────┬────────────┐ │
│  │   Routes    │ Controllers  │ Middlewares  │  Models    │ │
│  └─────────────┴──────────────┴──────────────┴────────────┘ │
│  ┌─────────────┬──────────────┬──────────────┐             │
│  │  Services   │  Background  │  Config      │             │
│  │             │  Jobs        │              │             │
│  └─────────────┴──────────────┴──────────────┘             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              Databases & External Services                  │
│  ┌──────────────┬──────────────┬──────────────┐             │
│  │  MongoDB     │  ImageKit    │  Clerk Auth  │             │
│  └──────────────┴──────────────┴──────────────┘             │
│  ┌──────────────┬──────────────┐                           │
│  │  Inngest Jobs│  Nodemailer  │                           │
│  └──────────────┴──────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

## Backend Structure

```text
server/
├── configs/
│   ├── db.js                 # MongoDB connection
│   ├── multer.js             # File upload configuration
│   └── imagekit.js           # ImageKit SDK setup
│
├── controllers/
│   ├── userController.js     # User logic (follow, discover, connect)
│   ├── postController.js     # Post management (create, like, feed)
│   ├── storyController.js    # Story operations
│   └── messageController.js  # Messaging system
│
├── middlewares/
│   └── auth.js               # Clerk authentication middleware
│
├── models/
│   ├── userModel.js          # User schema
│   ├── postModel.js          # Post schema
│   ├── storyModel.js         # Story schema
│   ├── messageModel.js       # Message schema
│   └── connectionModel.js    # Connection requests schema
│
├── routes/
│   ├── userRoutes.js         # User endpoints
│   ├── postRoutes.js         # Post endpoints
│   ├── storyRoutes.js        # Story endpoints
│   └── messageRoutes.js      # Message endpoints
│
├── inngest/
│   └── index.js              # Background job definitions
│
└── server.js                 # Express app entry point
```

## Frontend Structure

```text
client/
├── src/
│   ├── api/
│   │   └── axios.js          # Axios configuration
│   │
│   ├── app/
│   │   └── store.js          # Redux store setup
│   │
│   ├── assets/
│   │   ├── assets.js         # Images and dummy data
│   │   └── [images]          # PNG, JPG files
│   │
│   ├── components/
│   │   ├── PostCard.jsx      # Post display component
│   │   ├── UserCard.jsx      # User card component
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── StoriesBar.jsx    # Stories display
│   │   └── [other]           # Various UI components
│   │
│   ├── features/
│   │   ├── user/
│   │   │   └── userSlice.js  # User state management
│   │   ├── messages/
│   │   │   └── messagesSlice.js
│   │   └── connections/
│   │       └── connectionsSlice.js
│   │
│   ├── pages/
│   │   ├── Feed.jsx          # Home feed
│   │   ├── Messages.jsx      # Messaging page
│   │   ├── ChatBox.jsx       # Individual chat
│   │   ├── Connections.jsx   # Connections management
│   │   ├── Discover.jsx      # User discovery
│   │   ├── Profile.jsx       # User profile
│   │   ├── CreatePost.jsx    # Post creation
│   │   └── Login.jsx         # Authentication
│   │
│   ├── App.jsx               # Main app component
│   └── main.jsx              # React entry point
│
└── package.json
```

---

# 📊 Database Models

## User Model

```javascript
{
  _id: String (Clerk User ID),
  email: String,
  full_name: String,
  username: String (unique),
  bio: String,
  profile_picture: String,
  cover_photo: String,
  location: String,
  followers: [String],      // User IDs
  following: [String],      // User IDs
  connections: [String],    // User IDs
  createdAt: Date,
  updatedAt: Date
}
```

## Post Model

```javascript
{
  _id: ObjectId,
  user: String (ref: User),
  content: String,
  image_urls: [String],
  post_type: String,        // 'text', 'image', 'text-with-image'
  likes_count: [String],    // User IDs who liked
  createdAt: Date,
  updatedAt: Date
}
```

## Story Model

```javascript
{
  _id: ObjectId,
  user: String (ref: User),
  content: String,
  media_url: String,
  media_type: String,       // 'text', 'image', 'video'
  views_count: [String],    // User IDs who viewed
  background_color: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Message Model

```javascript
{
  _id: ObjectId,
  from_user_id: String (ref: User),
  to_user_id: String (ref: User),
  text: String,
  message_type: String,     // 'text', 'image'
  media_url: String,
  seen: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Connection Model

```javascript
{
  _id: ObjectId,
  from_user_id: String (ref: User),
  to_user_id: String (ref: User),
  status: String,           // 'pending', 'accepted'
  createdAt: Date,
  updatedAt: Date
}
```

---

# 🔌 API Endpoints

## User Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/user/data` | Get current user data | Required |
| POST | `/api/user/update` | Update user profile | Required |
| POST | `/api/user/discover` | Discover users by search | Required |
| POST | `/api/user/follow` | Follow a user | Required |
| POST | `/api/user/unfollow` | Unfollow a user | Required |
| POST | `/api/user/connect` | Send connection request | Required |
| POST | `/api/user/accept` | Accept connection request | Required |
| GET | `/api/user/connections` | Get user connections | Required |
| POST | `/api/user/profiles` | Get user profiles data | Optional |

## Post Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/post/add` | Create new post | Required |
| GET | `/api/post/feed` | Get user feed | Required |
| POST | `/api/post/like` | Like/unlike post | Required |

## Story Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/story/create` | Create new story | Required |
| GET | `/api/story/get` | Get stories | Required |

## Message Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/message/:userId` | Get chat with user (SSE) | Required |
| POST | `/api/message/send` | Send message | Required |
| POST | `/api/message/get` | Get chat history | Required |

---

# 🚀 Getting Started

## Prerequisites

Before running AuraX locally, ensure you have:

- **Node.js** (v18 or later)
- **npm** (comes with Node.js)
- **MongoDB** (local or MongoDB Atlas)
- **Git**
- **Clerk Account** (for authentication)
- **ImageKit Account** (for media storage)

Verify installation:

```bash
node -v
npm -v
git --version
```

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/aaryan498/AuraX-Social-Media-App.git
cd AuraX-Social-Media-App
```

### 2. Backend Setup

Navigate to server directory:

```bash
cd server
npm install
```

Create `.env` file in server directory:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Email Service (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Server Configuration
PORT=4000
NODE_ENV=development
```

Start backend server:

```bash
npm run server
```

Expected output:
```
Server running on Port: 4000
Database Connected Successfully
```

### 3. Frontend Setup

In a new terminal, navigate to client directory:

```bash
cd client
npm install
```

Create `.env` file in client directory:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# API Configuration
VITE_API_BASE_URL=http://localhost:4000
```

Start frontend development server:

```bash
npm run dev
```

Expected output:
```
  VITE v[version] ready in [time] ms

  ➜  Local:   http://localhost:5173/
```

### 4. Access Application

Open your browser and visit:

```
http://localhost:5173
```

---

## Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Verify connection string is correct
- Ensure MongoDB is running
- Check IP whitelist on MongoDB Atlas

**Clerk Authentication Error**
- Verify `CLERK_SECRET_KEY` is correct
- Ensure Clerk webhook is configured
- Check Clerk dashboard for API keys

**Port 4000 Already in Use**
- Change `PORT` in `.env`
- Or kill process: `lsof -i :4000` (Mac/Linux)

**ImageKit Upload Failed**
- Verify ImageKit credentials
- Check file size limits
- Ensure URL endpoint is correct

### Frontend Issues

**Cannot Connect to Backend**
- Verify `VITE_API_BASE_URL` is correct
- Ensure backend server is running
- Check network connectivity

**Clerk Login Not Working**
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is correct
- Check Clerk dashboard settings
- Ensure redirect URLs are configured

**Port 5173 Already in Use**
- Run on different port: `npm run dev -- --port 3000`
- Or kill process using the port

---

# 🔄 How It Works

## User Flow

```
1. User arrives at login page
   ↓
2. Authenticates with Clerk OAuth
   ↓
3. User profile is created/fetched from MongoDB
   ↓
4. User is redirected to feed
   ↓
5. Can create posts, browse feed, message users, etc.
```

## Post Creation Flow

```
1. User clicks "Create Post"
   ↓
2. Selects images (optional) and writes content
   ↓
3. Submits form
   ↓
4. Frontend sends FormData to backend
   ↓
5. Backend uploads images to ImageKit
   ↓
6. Post document is saved to MongoDB
   ↓
7. Post appears in user's feed
```

## Feed Generation

```
1. User views feed
   ↓
2. Frontend fetches with user's auth token
   ↓
3. Backend gets user's connections and following list
   ↓
4. Queries posts from those users
   ↓
5. Returns posts sorted by creation date
   ↓
6. Frontend renders posts
```

## Story Auto-Deletion

```
1. User creates story
   ↓
2. Inngest receives background job
   ↓
3. Job scheduled to run 24 hours later
   ↓
4. After 24 hours, story is deleted from MongoDB
   ↓
5. Story no longer visible to any user
```

---

# 📈 Current Implementation Status

| Status | Feature |
|---|---|
| ✅ Complete | User Authentication (Clerk) |
| ✅ Complete | User Profiles & Profiles |
| ✅ Complete | Post Creation & Feed |
| ✅ Complete | Like/Unlike Posts |
| ✅ Complete | Stories with Auto-Deletion |
| ✅ Complete | Messaging System (with SSE) |
| ✅ Complete | User Discovery & Search |
| ✅ Complete | Follow/Unfollow System |
| ✅ Complete | Connection Requests |
| ✅ Complete | Media Upload (ImageKit) |
| ✅ Complete | Image Optimization |
| ✅ Complete | Responsive UI |
| 🔄 In Progress | Real-time Notifications |
| 📋 Planned | WebSocket Real-Time Updates |
| 📋 Planned | Video Support |
| 📋 Planned | Feed Algorithm |
| 📋 Planned | Hashtag System |
| 📋 Planned | Direct Message Groups |
| 📋 Planned | User Verification Badge |
| 📋 Planned | Analytics Dashboard |

---

# 🤝 Contribution Areas

Contributors can work on different aspects of the platform:

## Frontend Development

- UI/UX improvements and modern design
- Responsive design optimization
- Component refactoring
- Animation enhancements
- Accessibility improvements
- Performance optimization

## Backend Development

- API optimization
- Database query optimization
- Error handling improvements
- New feature implementation
- Security enhancements
- Caching strategies

## Features

- Video support and streaming
- Advanced search and filters
- Feed ranking algorithm
- Hashtag and trending system
- User verification system
- Direct message groups
- Real-time notifications

## Infrastructure

- CI/CD pipeline setup
- Docker containerization
- Monitoring and logging
- Performance benchmarking
- Database optimization
- Deployment automation

## Testing & Quality

- Unit test coverage
- Integration tests
- End-to-end testing
- Performance testing
- Bug fixes

---

# 📋 Current Implementation Status

**Completed Features:**
- ✅ Full authentication system with Clerk
- ✅ User profile management
- ✅ Post creation, editing, and deletion
- ✅ Like/unlike functionality
- ✅ Feed system with personalization
- ✅ Story creation and auto-deletion
- ✅ One-to-one messaging
- ✅ User discovery and search
- ✅ Follow/unfollow system
- ✅ Connection requests
- ✅ Image uploads with optimization
- ✅ Responsive mobile-first design

**Planned Features:**
- 🔄 Real-time notifications
- 📋 WebSocket real-time updates
- 📋 Video support
- 📋 Feed ranking algorithm
- 📋 Hashtag system
- 📋 Direct message groups
- 📋 User verification
- 📋 Advanced analytics

---

# 🎓 Learning Outcomes

By studying and contributing to AuraX, you'll learn:

- **Full-Stack Development**: Build complete applications from database to UI
- **Modern Web Architecture**: REST APIs, microservices patterns
- **Authentication**: OAuth integration and user security
- **Database Design**: Relational data modeling with MongoDB
- **File Upload**: Handling and optimizing media uploads
- **State Management**: Redux for complex application state
- **API Design**: RESTful principles and best practices
- **Performance**: Optimization and scalability techniques
- **Real-Time Systems**: WebSockets and Server-Sent Events
- **Deployment**: Vercel and production environments

---

# 🙏 Support the Project

If you find AuraX valuable, please consider:

- Starring the repository ⭐
- Forking and contributing
- Sharing with your network
- Reporting bugs and suggesting features
- Contributing code or documentation
- Providing feedback and improvements

Every contribution helps improve AuraX for the entire community!

---

# 📞 Get in Touch

- **GitHub**: https://github.com/aaryan498
- **LinkedIn**: https://www.linkedin.com/in/aaryan-kumar-ai-498-coder/
- **Live Demo**: https://aura-x-social-media-app.vercel.app

---

# 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

# 🙌 Acknowledgments

AuraX is built with modern technologies and best practices demonstrated by leading tech companies. Special thanks to:

- The open-source community
- Clerk for authentication
- ImageKit for media management
- MongoDB for the database
- Vercel for hosting
- All contributors and users

Together, we're building amazing software! 🚀
