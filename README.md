````markdown
# 🚀 Vedix.Ai

<p align="center">

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express-000000?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)
![Google OAuth](https://img.shields.io/badge/Auth-Google%20OAuth-EA4335?logo=google)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

<p align="center">
<b>An AI-Powered Full Stack Web Platform for Intelligent Conversations, Resume Analysis, Research Assistance, Live News Exploration, and Administrative Management.</b>
</p>

---

# 📖 Project Description

**Vedix.Ai** is a modern AI-powered web application designed to provide multiple productivity tools through a single platform.

The application enables users to communicate with AI, upload images for AI-assisted prompting, analyze resumes, evaluate research papers, browse live news, and manage subscription plans. It also includes a comprehensive **Admin Dashboard** that allows administrators to manage users, platform modules, analytics, AI settings, and application configurations without redeploying the application.

The project follows a scalable MERN architecture with secure authentication, REST APIs, and cloud deployment.

---

# ✨ Features

## 🔐 User Authentication

- User Registration
- Secure Login
- Google Sign-In
- JWT Authentication
- Protected Routes
- Role-Based Authorization
- Admin Access Control

---

## 🤖 AI Chat

- AI Conversation
- Smart Prompt Processing
- Image Prompt Support
- Voice Input
- Text-to-Speech
- Copy AI Response
- Chat History

---

## 📰 Explore News

- Live News Feed
- Search News
- Refresh News
- Hero News Banner
- Live News Ticker
- Calendar & Time
- Multiple Categories

### Categories

- Top Stories
- Technology
- Business
- Sports
- Science
- Health

---

## 📄 Resume Analyzer

Upload resumes and receive AI-powered insights including:

- Resume Score
- Suitable Job Roles
- Skill Detection
- Strength Analysis
- Weakness Detection
- Missing Skills
- Resume Improvement Suggestions

Job recommendations from:

- LinkedIn
- Internshala
- Unstop
- Indeed
- Naukri

---

## 📚 Research Paper Analyzer

Analyze research papers using AI.

Features include:

- AI Summary
- Methodology Analysis
- Findings Extraction
- Limitations Detection
- Missing Content Suggestions
- Improvement Recommendations
- Related Articles
- Similar Research Papers

---

## 💳 Subscription Plans

- Free
- Pro
- Premium

Features

- Usage Limits
- Credit System
- Admin Editable Pricing
- Plan Management
- Upgrade/Downgrade

---

# 👨‍💼 Admin Panel

A complete administrative dashboard with powerful management tools.

### Dashboard

- Overview Cards
- Analytics
- Recent Activity
- AI Usage
- Platform Statistics

### User Management

- View Users
- Search Users
- Edit User
- Delete User
- Change Subscription
- Edit Credits
- Block/Unblock

### Platform Modules

- Dashboard
- Users
- Subscriptions
- Payments
- AI Models
- Prompt Studio
- Knowledge Base
- Resume Analyzer
- Research Analyzer
- Documents
- Chats
- Credits
- Analytics
- Logs
- Notifications
- CMS
- Support
- Security
- Settings
- Admin Management
- AI Cost Monitor
- Feature Flags

Each module supports:

- Enable
- Disable
- Pause
- Edit Description
- Owner
- Action URL
- Notes

---

# 🛠 Tech Stack

| Category | Technology |
|------------|------------|
| Frontend | React, Vite |
| Styling | CSS3 |
| Routing | React Router |
| HTTP Client | Axios |
| Icons | React Icons |
| Backend | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT |
| OAuth | Google OAuth |
| AI | AI Model API |
| Deployment | Vercel + Railway |

---

# 📂 Folder Structure

```text
Vedix.Ai
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── routes
│   │   ├── services
│   │   ├── context
│   │   ├── utils
│   │   └── App.jsx
│   └── package.json
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── models
│   ├── services
│   ├── config
│   ├── utils
│   ├── uploads
│   ├── app.js
│   └── server.js
│
└── README.md
````

---

# 📸 Screenshots

Replace these placeholders with your project screenshots.

```
Home Page

Chat Page

Resume Analyzer

Research Analyzer

News Explorer

Subscription Plans

Admin Dashboard

User Management

Analytics Dashboard
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/vedix-ai.git

cd vedix-ai
```

---

## Install Frontend

```bash
cd frontend

npm install
```

---

## Install Backend

```bash
cd backend

npm install
```

---

# 🔑 Environment Variables

## Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api

VITE_BACKEND_URL=http://localhost:5000

VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

---

## Backend (.env)

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID

GROQ_API_KEY=YOUR_GROQ_KEY

# OR

AI_API_KEY=YOUR_AI_API_KEY

ADMIN_EMAILS=admin@example.com,owner@example.com
```

---

# ▶ Running Locally

## Backend

```bash
npm run dev
```

---

## Frontend

```bash
npm run dev
```

---

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

# 🌐 Backend API Overview

| Endpoint                    | Method | Description       |
| --------------------------- | ------ | ----------------- |
| /api/auth/register          | POST   | Register User     |
| /api/auth/login             | POST   | Login             |
| /api/auth/google            | POST   | Google Login      |
| /api/chat                   | POST   | AI Chat           |
| /api/news                   | GET    | News Feed         |
| /api/analyze/resume         | POST   | Resume Analysis   |
| /api/analyze/research-paper | POST   | Research Analysis |
| /api/subscription           | GET    | Plans             |
| /api/users                  | GET    | User Profile      |
| /api/admin/summary          | GET    | Dashboard Summary |
| /api/admin/users            | GET    | Manage Users      |
| /api/admin/config           | GET    | Admin Config      |

---

# 🛡 Admin Panel

The Admin Panel provides centralized platform management.

Features include:

* Dashboard Overview
* User Management
* Credits Management
* Subscription Management
* Platform Settings
* AI Configuration
* CMS
* Notifications
* Logs
* Analytics
* API Monitoring
* Feature Flags
* Security Controls
* Admin Notes

Admin access is controlled through:

```env
ADMIN_EMAILS
```

Only registered email addresses in this environment variable can access the Admin Dashboard.

---

# 🚀 Deployment

## Frontend (Vercel)

```bash
npm run build
```

Deploy the **frontend** directory to Vercel.

Environment Variables:

```
VITE_API_BASE_URL

VITE_BACKEND_URL

VITE_GOOGLE_CLIENT_ID
```

---

## Backend (Railway)

Deploy the backend folder to Railway.

Environment Variables

```
MONGO_URI

JWT_SECRET

GOOGLE_CLIENT_ID

GROQ_API_KEY

ADMIN_EMAILS
```

Example Backend

```
https://vedixai-production.up.railway.app
```

API Base URL

```
https://your-backend-url/api
```

---

# 📘 Usage Guide

1. Register or Login.
2. Authenticate using Google or Email.
3. Start chatting with AI.
4. Upload images for AI prompts.
5. Analyze resumes.
6. Upload research papers.
7. Browse live news.
8. Upgrade subscription.
9. Access Admin Dashboard (Authorized Users Only).

---

# 🔒 Security Notes

* JWT Authentication
* Password Hashing
* Protected Routes
* Google OAuth
* Role-Based Authorization
* Secure Environment Variables
* Input Validation
* Error Handling
* MongoDB Injection Protection
* API Authentication
* CORS Configuration

---

# 🚀 Future Improvements

* AI Image Generation
* AI Document Chat
* Team Workspaces
* Multi-language Support
* Dark/Light Theme
* Email Notifications
* Payment Gateway Integration
* Chat History Search
* AI Memory
* Usage Analytics Dashboard
* Mobile Application
* Real-Time Notifications
* AI Agents Marketplace
* Voice Conversations
* AI Workflow Automation

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/new-feature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push your branch.

```bash
git push origin feature/new-feature
```

5. Create a Pull Request.

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Ashutosh Mishra**

B.Tech CSE (AI & ML)

Full Stack Developer | Frontend Developer | AI Enthusiast

---

## ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub.

It motivates further development and helps others discover the project.

---

<p align="center">
Made with ❤️ using React, Node.js, Express, MongoDB and AI.
</p>
```
