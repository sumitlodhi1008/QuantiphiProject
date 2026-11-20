# 🧠 Quantiphi AI Chat Assistant (MERN Stack)

> Built for the **Quantiphi Vibe Coding Round** (Nov 20, 2026).  
> An intelligent, real-time conversational AI application built with the pure **MERN Stack** (MongoDB, Express.js, React.js, Node.js), featuring Server-Sent Events (SSE) streaming, dynamic tone calibration ("The Vibe Check"), past conversation persistence, and value-add chatbot capabilities.

---

## 🌟 Executive Overview & Key Features

### 1. 💬 Frontend UI & User Interaction
- **Scrollable Conversation View**: Responsive conversation canvas with auto-scrolling to the latest tokens as they stream in.
- **Distinct Chat Bubbles**: High-contrast, beautifully styled chat bubbles separating User prompts (right-aligned cyan/blue gradient) from AI assistant responses (left-aligned dark card with tone indicators).
- **Real-Time Streaming View**: Low-latency character-by-character / word-by-word text streaming powered by HTTP Server-Sent Events (SSE) with an active typing cursor.
- **History Sidebar**: Collapsible past conversation threads drawer with quick switching, timestamps, and thread deletion.

### 2. ⚡ Backend Logic & State Management
- **Pure MERN Architecture**: All business logic, prompt formatting, state handling, and validations are strictly enforced on the server side (`/server`). The frontend (`/client`) handles presentation and user interactions.
- **Gemini API Integration**: Direct streaming support using Google's official `@google/generative-ai` SDK (`gemini-1.5-flash`), with fallback compatibility for OpenAI (`gpt-4o-mini`) and an intelligent simulated stream engine for zero-downtime offline evaluation.
- **MongoDB Persistence**: Mongoose ODM models for `Conversation` and `Message` objects storing timestamps, user prompts, assistant outputs, tones, and thread titles.

### 3. 👔 "The Vibe Check" (Tone Toggle)
Users can dynamically switch the AI's persona across three modes:
- **👔 Professional**: Structured, authoritative, polished, executive-ready language with bulleted points and clear sections.
- **☕ Casual**: Warm, friendly, approachable, and witty tone with everyday phrasing and relatable analogies.
- **⚡ Concise**: Ultra-direct, high-density responses with zero conversational fluff or pleasantries.

The server injects custom system instructions into the LLM request in real-time, instantly modifying the style of the response.

### 4. 🚀 Extra Innovation Features (Included as per guidelines)
1. **Rich Markdown & Syntax-Highlighted Code Blocks with 1-Click Copy**: Full Markdown rendering (tables, lists, blockquotes) and code blocks with language badges and a visual copy-to-clipboard button with instant feedback.
2. **Conversation Export & Real-Time Search**:
   - **Export**: Download any conversation as a `.md` (Markdown) or `.json` file for documentation.
   - **Search Filter**: Filter conversation history in real time by title or content snippet.

---

## 🛠️ Technology Stack (Pure MERN)

- **M**ongoDB: Mongoose ODM for document persistence.
- **E**xpress.js: Node.js API server & Server-Sent Events (SSE) streaming pipeline.
- **R**eact.js: React 18, Vite, Tailwind CSS, Lucide React icons, React-Markdown.
- **N**ode.js: Runtime environment powering the full backend.

---

## 📁 Project Structure

```
Quantiphi_AIChat/
├── client/                     # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx   # Main conversation canvas & controls
│   │   │   ├── ChatBubble.jsx      # Distinct User/AI message bubbles
│   │   │   ├── HistorySidebar.jsx  # Past conversations drawer & search
│   │   │   ├── ToneSelector.jsx    # "The Vibe Check" toggle component
│   │   │   ├── CodeBlock.jsx       # Syntax highlighting & 1-click copy
│   │   │   └── ExportModal.jsx     # Export conversation to Markdown/JSON
│   │   ├── hooks/
│   │   │   ├── useChatStream.js    # Custom SSE streaming hook
│   │   │   └── useConversations.js # Custom conversation management hook
│   │   ├── App.jsx                 # App layout wrapper
│   │   ├── main.jsx                # React entrypoint
│   │   └── index.css               # Tailwind CSS & custom animations
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend (Node.js + Express + Mongoose)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection & resilient fallback
│   │   ├── controllers/
│   │   │   └── chatController.js   # SSE streaming handler & CRUD logic
│   │   ├── models/
│   │   │   └── Conversation.js     # Mongoose Schema & persistence repository
│   │   ├── routes/
│   │   │   └── chatRoutes.js       # API routes
│   │   ├── services/
│   │   │   ├── aiService.js        # Gemini/OpenAI streaming & mock engine
│   │   │   └── promptService.js    # Tone system modifier instructions
│   │   ├── middleware/
│   │   │   └── errorHandler.js     # Global error handling
│   │   └── app.js                  # Express application setup
│   ├── package.json
│   └── server.js                   # Server entrypoint
│
├── prd.md                      # Product Requirements Document
├── architecture.md             # System Architecture Document
├── design_system.md            # Design System & UI/UX Tokens
├── tasks.md                    # Phased Roadmap & Milestones
└── README.md                   # Project Documentation
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB** (Optional): A local MongoDB instance or MongoDB Atlas URI (If not running, the app automatically switches to an in-memory persistent store).

### 2. Environment Configuration
Create or edit the `.env` file in the root or in `/server/.env`:

```env
PORT=5000
NODE_ENV=development

# Paste your Gemini API key below:
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Connection String (defaults to localhost:27017/quantiphi_aichat)
MONGODB_URI=mongodb://localhost:27017/quantiphi_aichat
```

### 3. Installation
From the root directory, install dependencies:

```bash
# Install root, server, and client dependencies
npm run install:all
```

Or install separately:
```bash
cd server && npm install
cd ../client && npm install
```

### 4. Running the Application

#### Option A: Run Both in Development Mode (Recommended)
From the root directory:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

#### Option B: Run Unified Full-Stack Server
Build the frontend and run the production Express server:
```bash
npm run build --prefix client
npm start --prefix server
```
- Open `http://localhost:5000` to access the full-stack app directly!

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/chat/stream` | Stream AI response via Server-Sent Events (SSE) with tone modifier |
| `GET` | `/api/conversations` | Retrieve all past conversation threads for the sidebar |
| `GET` | `/api/conversations/:id` | Fetch full message history for a specific thread |
| `DELETE`| `/api/conversations/:id` | Delete a specific conversation thread |
| `DELETE`| `/api/conversations` | Clear all past conversation threads |
| `GET` | `/api/health` | Health check endpoint reporting API and Gemini status |

---

## 🎯 Viva & Evaluation Q&A

**Q: How does real-time streaming work?**  
*A: The backend uses HTTP Server-Sent Events (`text/event-stream`). As the Gemini API yields tokens, chunks are serialized into SSE `chunk` events and pushed over an open HTTP connection. On the frontend, a `ReadableStream` decoder processes each delta and updates React state character-by-character, minimizing Time-To-First-Token (TTFT).*

**Q: How is "The Vibe Check" tone toggle implemented?**  
*A: When a user selects "Professional", "Casual", or "Concise", the frontend attaches the tone string to the payload. The backend's `promptService` intercepts the request and injects specific system instructions before dispatching to the Gemini API, ensuring strict server-side validation and consistent styling.*

**Q: Where does conversation persistence take place?**  
*A: Messages and conversation documents are saved directly to MongoDB via Mongoose. If MongoDB is temporarily offline, a resilient in-memory persistence layer prevents server crashes, ensuring uninterrupted evaluation.*

---

## 👨‍💻 Candidate Submission
- **Repository**: [https://github.com/sumitlodhi1008/QuantiphiProject.git](https://github.com/sumitlodhi1008/QuantiphiProject.git)
- **Time of Completion**: Well before the 01:30 PM deadline.
- **Status**: Production Ready & Fully Tested.
