# Implementation Tasks & Phased Roadmap

## Project: Quantiphi Intelligent AI Chat Assistant
**Assessment Window:** 12:00 PM – 01:30 PM IST (Nov 20, 2026)  
**Target Completion:** 01:15 PM IST (Leaving 15 minutes for final testing, Git verification & Unstop submission)

---

## Phased Implementation Plan

| Phase | Description | Estimated Time | Target End Time | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 0** | Problem Analysis & Architecture Documentation (`prd.md`, `architecture.md`, `design_system.md`, `tasks.md`) | 10 mins | 12:30 PM | **Completed** |
| **Phase 1** | Project Initialization & Monorepo Scaffolding (Backend Express + Frontend Vite React + Tailwind) | 10 mins | 12:40 PM | **Completed** |
| **Phase 2** | Backend Implementation: MongoDB Schema, Prompt Service (Tone Modifiers), SSE Streaming Controller | 12 mins | 12:52 PM | **Completed** |
| **Phase 3** | Frontend Chat Interface: Distinct Bubbles, Streaming Text Decoder, Auto-Scroll, Input Area | 12 mins | 01:04 PM | **Completed** |
| **Phase 4** | Conversation History Sidebar: Thread Listing, Switching, Creation, Deletion & Search Filter | 8 mins | 01:12 PM | **Completed** |
| **Phase 5** | The Vibe Check ("Tone Toggle"): Professional / Casual / Concise system modifier integration | 5 mins | 01:17 PM | **Completed** |
| **Phase 6** | Extra Features: Syntax-Highlighted Code Blocks with 1-Click Copy + Chat Export (MD/JSON) | 6 mins | 01:23 PM | **Completed** |
| **Phase 7** | End-to-End Testing, Cross-Browser Verification, Final Git Commits & Submission | 7 mins | 01:30 PM | **Completed** |

---

## Detailed Task Breakdown

### Phase 0: Analysis & Specifications (Completed)
- [x] Analyze problem statement and candidate guidelines.
- [x] Define Product Requirements Document (`prd.md`).
- [x] Define System Architecture & Data Model (`architecture.md`).
- [x] Define UI/UX Design System & Color Tokens (`design_system.md`).
- [x] Formulate Phased Implementation Roadmap (`tasks.md`).
- [x] Initial Git commit for documentation & project structure.

---

### Phase 1: Environment & Project Scaffolding (Completed)
- [x] Initialize Root `package.json` with concurrently / helper scripts.
- [x] Setup Express backend (`/server`): Express, cors, dotenv, mongoose, @google/generative-ai, openai.
- [x] Setup React + Vite frontend (`/client`): React 18, Vite, Tailwind CSS, Lucide React, Markdown parser.
- [x] Verify local dev server startup and connectivity.
- [x] Git commit: `chore: scaffold client and server workspaces with initial configuration`

---

### Phase 2: Backend Core & Persistence (Completed)
- [x] Build MongoDB `Conversation` and `Message` Mongoose schema with timestamps and tone metadata.
- [x] Implement `db.js` with primary MongoDB connection and automatic in-memory fallback.
- [x] Implement `promptService.js` containing system instruction modifiers for Professional, Casual, and Concise tones.
- [x] Implement `aiService.js` with streaming chunk generator (Gemini API support + OpenAI fallback + intelligent resilient mock streaming engine).
- [x] Implement `chatController.js` and `chatRoutes.js`:
  - `POST /api/chat/stream`: Server-Sent Events (SSE) streaming endpoint.
  - `GET /api/conversations`: List past conversation threads.
  - `GET /api/conversations/:id`: Fetch messages for specific thread.
  - `DELETE /api/conversations/:id`: Delete conversation.
- [x] Git commit: `feat(server): implement MongoDB schemas, tone prompt engine, and SSE chat streaming`

---

### Phase 3: Frontend Chat UI & Real-Time Streaming (Completed)
- [x] Create chat canvas layout with scrollable conversation stream.
- [x] Create `ChatBubble` component with distinct styles for User (gradient, right-aligned) and Assistant (dark card, left-aligned).
- [x] Implement custom hook `useChatStream` for consuming SSE streams, handling character-by-character chunking, and error handling.
- [x] Implement smooth auto-scroll to bottom as new tokens arrive.
- [x] Add active streaming cursor and stop generation button.
- [x] Git commit: `feat(client): build responsive chat interface with distinct bubbles and SSE streaming hook`

---

### Phase 4: Conversation History Sidebar & Persistence Integration (Completed)
- [x] Build `HistorySidebar` component with collapsible drawer for mobile and desktop.
- [x] Implement `+ New Chat` action to reset active conversation session.
- [x] List past conversation threads with active thread indicator, formatted timestamps, and delete button.
- [x] Connect frontend to `GET /api/conversations` and `GET /api/conversations/:id`.
- [x] Implement Real-Time Search Filter in sidebar to filter conversations by title/content.
- [x] Git commit: `feat(client): implement history sidebar with thread persistence and real-time search`

---

### Phase 5: The Vibe Check (Tone Toggle) (Completed)
- [x] Build `ToneSelector` component (Professional 👔, Casual ☕, Concise ⚡).
- [x] Wire tone selection state to chat dispatch so every prompt carries the chosen tone.
- [x] Verify backend applies matching system prompt modifier and LLM responds with visibly distinct tone styles.
- [x] Display active tone badge on AI messages for clear visual feedback.
- [x] Git commit: `feat(vibe-check): implement dynamic tone toggle with backend system prompt modifiers`

---

### Phase 6: Extra Innovation Features (Completed)
- [x] **Feature 1**: Implement Markdown rendering with `CodeBlock` component (language label, syntax highlighting, and 1-Click Copy with visual checkmark feedback).
- [x] **Feature 2**: Implement `ExportModal` / Chat Export action allowing users to download current conversation as `.md` (Markdown) or `.json`.
- [x] Git commit: `feat(bonus): add syntax-highlighted code blocks with copy button and conversation export`

---

### Phase 7: Verification, Polish & Submission (Completed)
- [x] End-to-end test streaming responses, tone switches, conversation switching, deletion, and export.
- [x] Verify server runs cleanly and handles disconnections gracefully.
- [x] Create detailed `README.md` with architecture explanation, setup instructions, and evaluation walkthrough for the Viva round.
- [x] Review Git commit log to ensure meaningful and incremental stages.
- [x] Final Git commit and preparation for GitHub repository upload before 01:30 PM.
