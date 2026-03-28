# 🚀 Vanilla — Full Stack Social Media Platform

> A production-style social media application built to demonstrate scalable full-stack architecture, real-time interactions, and modern web development practices.

---

## ⚡ Overview

Vanilla is a feature-rich social platform that showcases end-to-end full-stack development — from authentication and API design to media handling and dynamic UI rendering.

It is built with a strong focus on **modularity, scalability, and real-world engineering practices**.

---

## 🔗 Links

* 🟢 **Live App** → https://aura-x-social-media-app.vercel.app
* 💻 **GitHub Repository** → https://github.com/aaryan498/AuraX-Social-Media-App
* 🔗 **LinkedIn** → https://www.linkedin.com/in/aaryan-kumar-ai-498-coder/

---

## ✨ Core Features

### 🔐 Authentication & User System

* Secure authentication using Clerk
* User profile management
* Connection / follow system

### 📝 Post Management

* Create, edit, and delete posts
* Like and interact with posts
* Image uploads with cloud storage

### 📸 Stories

* Temporary story sharing system
* Media-based stories (Instagram-style)

### 💬 Messaging

* One-to-one messaging system
* Persistent chat history
* Structured conversation handling

### 🌐 Feed System

* Dynamic content rendering
* Responsive and smooth UI
* Optimized state updates

---

## 🛠️ Tech Stack

### 🎨 Frontend

* React (Vite)
* Redux Toolkit
* Tailwind CSS
* React Router DOM
* Axios
* React Hot Toast

### ⚙️ Backend

* Node.js
* Express.js
* MongoDB + Mongoose

### 🔌 Integrations & Tools

* Clerk (Authentication)
* ImageKit (Media Storage)
* Multer (File Uploads)
* Nodemailer (Email Services)
* Inngest (Background Jobs)

---

## 🏗️ System Architecture

The application follows a **client-server architecture** with REST APIs.

**Flow:**
Frontend → API → Backend → Database → Response → UI Update

### Backend Design

* Controllers → Business logic handling
* Routes → API endpoints
* Models → Database schemas
* Middleware → Authentication & validation
* Config → External services & environment setup

### Key Engineering Highlights

* Clean separation of concerns
* Scalable folder structure
* Cloud-based media handling
* Secure authentication flow
* Modular API design

---

## ⚙️ Local Setup

### 1. Clone Repository

```bash id="q8mwsz"
git clone https://github.com/aaryan498/AuraX-Social-Media-App.git
cd AuraX-Social-Media-App
```

---

### 2. Backend Setup

```bash id="4ktqtm"
cd server
npm install
```

Create `.env` file:

```id="3fwzog"
MONGO_URI=your_mongodb_uri
CLERK_SECRET_KEY=your_clerk_key
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_url
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

Run backend:

```bash id="n5fxms"
npm run server
```

---

### 3. Frontend Setup

```bash id="4hscqr"
cd client
npm install
npm run dev
```

---

## 🚀 Usage

* Authenticate using Clerk
* Create and interact with posts
* Upload media content
* Share stories
* Send and receive messages
* Explore user profiles and connections

---

## 📈 Future Scope

* Real-time updates using WebSockets
* Notification system
* Video/media enhancements
* Feed ranking algorithm
* Performance optimization (caching, lazy loading)

---

## 👨‍💻 Developer

Aaryan Kumar
🐙 GitHub: https://github.com/aaryan498
💼 LinkedIn: https://www.linkedin.com/in/aaryan-kumar-ai-498-coder/

---

## ⭐ Support

If you found this project valuable, consider giving it a star ⭐
