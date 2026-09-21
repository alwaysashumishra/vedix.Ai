# ⚡ Vedix.Ai

### Next-Generation AI Productivity Platform & Intelligence Hub

![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Build-Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Framework-Express_4-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Auth-Google_OAuth_2.0-EA4335?style=for-the-badge&logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Vedix.Ai** is a unified, full-stack AI ecosystem integrating multi-modal AI chat, automated ATS resume scanning, academic research analysis, autonomous travel itinerary planning, real-time news intelligence, collaborative study vaults, and centralized admin governance.

---

## 🌟 Executive Overview

Vedix.Ai simplifies AI workflow fragmentation by consolidating essential productivity engines into one seamless glassmorphic interface. Built on a scalable MERN architecture, it delivers real-time streaming response capabilities, role-based security access, credit consumption tracking, and zero-downtime admin control.

---

## 🖼️ Interface Showcase & Visual Tour

### 1. Central Command Dashboard

![Home Page Dashboard](./src/assets/home1.png)

**Capabilities**: Modern glassmorphic landing page with instant guest access, quick-launch tool shortcuts, live response latency tracking, and dynamic hero animations.

---

### 2. Core Microservices Matrix

![Features Overview](./src/assets/features.png)

**Capabilities**: Modular ecosystem grid displaying tool statuses, capability badges, and tier access levels for seamless navigation.

---

### 3. Multi-Model AI Chat & Vision Engine

![AI Chat Interface](./src/assets/chat.png)

**Capabilities**: Multi-turn AI conversations with multimodal image attachment analysis, voice-to-text dictation, text-to-speech audio synthesis, and instant code block export.

---

### 4. Real-Time News & Market Intelligence

![News Intelligence Explorer](./src/assets/news.png)

**Capabilities**: Live news aggregation categorized by Tech, Business, Science, and Health with real-time ticker feeds, calendar integration, and AI summary previews.

---

### 5. Resume ATS & Career Optimization Scanner

![Resume ATS Scanner](./src/assets/resume.png)

**Capabilities**: Automated Applicant Tracking System (ATS) scoring, technical skill gap detection, formatting improvement recommendations, and direct job board links (LinkedIn, Indeed, Naukri, Internshala).

---

### 6. Academic Research Paper Assistant

![Research Paper Assistant](./src/assets/research.png)

**Capabilities**: Instant paper extraction rendering executive summaries, methodology breakdowns, study limitation analysis, and related research recommendations.

---

### 7. Smart Notes & Knowledge Vault

![Smart Notes Vault](./src/assets/notes.png)

**Capabilities**: Centralized digital workspace for markdown note-taking, AI prompt saving, instant keyword search, and automatic note summarization.

---

### 8. Collaborative Study & Team Hubs

![Collaborative Study Groups](./src/assets/group.png)

**Capabilities**: Private and public study circles with invite keys, shared document repositories, team notes feed, and role-based permissions.

---

### 9. Autonomous AI Travel Planner

![AI Travel Planner](./src/assets/travel.png)

**Capabilities**: Generative trip creation algorithms customized by destination, budget tier, travel style, and companion preferences.

---

### 10. Hourly Travel Itineraries & Schedules

![Travel Itineraries](./src/assets/travel1.png)

**Capabilities**: Complete day-by-day activity timelines, local culinary suggestions, hotel recommendations, expense calculators, and printable guides.

---

### 11. User Profile & Usage Management

![User Profile](./src/assets/profile.png)

**Capabilities**: Personal account settings, live AI credit meter, tier upgrades (Free / Pro / Premium), and connected authentication management.

---

### 12. Support & Feedback Portal

![Contact & Support](./src/assets/contactus.png)

**Capabilities**: Direct user communication portal with topic tagging, automated submission confirmation, and inquiry tracking.

---

### 13. Authentication & Sign In Modal

![Authentication Modal](./src/assets/login.png)

**Capabilities**: Sleek modal interface supporting 1-click Google OAuth 2.0, JWT token sessions, guest login, and password protection.

---

## 🛠️ Technology Architecture

| Layer | Technology Stack | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 5, Axios, CSS3 Glassmorphic System | High-performance SPA with real-time UI updates |
| **Backend** | Node.js, Express.js | Scalable REST API gateway with middleware validation |
| **Database** | MongoDB, Mongoose ODM | Document storage for users, chats, notes, and logs |
| **Auth** | JWT, Google OAuth 2.0 | Secure stateless session control & role authorization |
| **AI Processing** | Groq API / Custom LLM Gateway | Low-latency inference for chat, ATS, & research tools |
| **Deployment** | Vercel (Frontend), Railway (Backend) | Production cloud hosting with environment variable safety |

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB Instance
- API Keys for Google OAuth & AI Models

### Environment Setup

#### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

#### Backend (`.env`)
```env
PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GROQ_API_KEY=YOUR_GROQ_KEY
ADMIN_EMAILS=admin@example.com
```

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/alwaysashumishra/vedix.Ai.git
   cd vedix.Ai
   ```

2. **Frontend Launch**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Launch**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

---

## 🌐 API Reference Overview

| Route Path | Method | Access Level | Function |
| :--- | :---: | :---: | :--- |
| `/api/auth/register` | `POST` | Public | Register new user account |
| `/api/auth/login` | `POST` | Public | Authenticate user & issue JWT |
| `/api/auth/google` | `POST` | Public | Google OAuth token verification |
| `/api/chat` | `POST` | User | Process multi-modal AI chat prompt |
| `/api/news` | `GET` | User | Fetch live categorized news feed |
| `/api/analyze/resume` | `POST` | User | Execute ATS resume analysis |
| `/api/analyze/research-paper` | `POST` | User | Parse scientific research paper |
| `/api/admin/summary` | `GET` | Admin | Administrative platform stats |
| `/api/admin/users` | `GET` | Admin | Manage platform registered users |

---

## 👨‍💼 Centralized Admin Governance

The **Vedix.Ai Admin Panel** provides real-time system monitoring without requiring application redeployments:

- **User Governance**: Search, edit, suspend, or upgrade user subscription tiers and credit allocations.
- **Module Control**: Toggle platform modules (AI Chat, Resume Analyzer, Research Engine, Travel Agent) dynamically.
- **AI Cost Monitoring**: Track token usage, API query limits, and response latencies across services.
- **Security & Logs**: Inspect access logs, system events, and security exceptions.

---

## 📄 License & Author

Distributed under the **MIT License**.

Designed & Developed by **Ashutosh Mishra**  
*B.Tech CSE (AI & ML) | Full Stack Developer | AI Systems Enthusiast*

---

**⭐ If you find Vedix.Ai useful, give it a star on GitHub! ⭐**
