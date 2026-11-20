# Product Requirements Document (PRD)
## Project: Quantiphi Intelligent AI Chat Assistant
**Author:** Candidate  
**Date:** November 20, 2026  
**Status:** In Progress / Implementation Phase  
**Target Completion:** Prior to 01:30 PM IST (1-Hour Assessment Window)

---

## 1. Executive Summary & Mission
The objective is to design, develop, and deliver a production-grade, real-time AI Chat Assistant application. The system couples a sleek, modern, and accessible user interface with a robust, scalable backend architecture. 

It satisfies all evaluation criteria specified in the **Quantiphi Vibe Coding Round**:
1. **Interactive Real-Time Chat Interface**: Scrollable conversation stream with distinct user/AI chat bubbles.
2. **Real-Time Streaming View**: Low-latency character-by-character / chunk streaming simulation and Server-Sent Events (SSE).
3. **Conversation History Sidebar**: Persistent thread management allowing users to browse, switch, create, and delete past conversations.
4. **Backend State & Persistence**: MongoDB-backed storage for threads, user prompts, assistant responses, metadata, and timestamps.
5. **The Vibe Check (Tone Toggle)**: Dynamic tone selection (**"Professional"**, **"Casual"**, **"Concise"**) passed server-side to modify the AI system instructions in real-time.
6. **Value-Add Extra Features**:
   - **Feature 1:** Rich Markdown rendering with Syntax-Highlighted Code Blocks and One-Click Copy.
   - **Feature 2:** Chat Export (Markdown / JSON) and Real-Time Sidebar Search/Filter for threads.

---

## 2. Problem Statement Analysis & Target Personas

### 2.1 The Problem
Users interacting with conversational AI require an immediate, engaging, and context-aware interface. Static or batch-loading interfaces feel unresponsive and clunky. Furthermore, business and personal users frequently need to calibrate the persona and tone of the AI—from authoritative and enterprise-ready, to friendly and brainstorming-friendly, to terse and high-throughput. 

### 2.2 Target Users
- **Enterprise Professionals**: Need structured, professional, and well-researched insights.
- **Developers / Technical Users**: Need code snippets with syntax highlighting, copy-to-clipboard functionality, and structured formatting.
- **Casual Users / Creators**: Prefer natural, warm, conversational dialogue.
- **Power Users**: Need fast search through past threads, multi-session management, and data export.

---

## 3. Scope & Feature Specifications

### 3.1 Core Requirements (As Defined in Problem Statement)

| Feature | Requirement Details | Implementation Approach |
| :--- | :--- | :--- |
| **Chat Interface** | Scrollable conversation view, distinct bubbles for User & AI, automatic smooth auto-scroll to latest tokens. | React/Tailwind CSS with custom message bubbles, avatars, timestamps, and auto-scroll ref hook. |
| **Streaming View** | Text appearing progressively / character-by-character to simulate real-time processing and low time-to-first-token (TTFT). | Server-Sent Events (SSE) `/api/chat/stream` endpoint with streaming text decoder on frontend. |
| **History Sidebar** | Collapsible sidebar listing past conversation threads ordered chronologically with active highlight & quick switch. | MongoDB collection `conversations` with title generation, date grouping, and instant load. |
| **Backend & Persistence** | MongoDB storage for conversation documents: `conversationId`, `title`, `messages: [{ role, content, tone, timestamp }]`. | Express.js / Node.js REST + SSE API with Mongoose ODM (with automatic in-memory fallback if standalone DB is unconfigured). |
| **The Vibe Check (Tone Toggle)** | User toggle with 3 options: `Professional`, `Casual`, `Concise`. Backend prepends tone-specific system instructions to LLM prompts. | Dropdown/Segmented controller in top navigation; passed in payload `{ prompt, tone, conversationId }`. |

### 3.2 Tone Modifiers Specification ("The Vibe Check")
The backend enforces server-side validation and injects the following system prompts:
1. **Professional**: 
   > *"You are an executive enterprise AI assistant. Respond with formal, polite, objective, structured, and polished language. Use bullet points and clear sections where appropriate."*
2. **Casual**: 
   > *"You are an approachable, friendly, and engaging AI companion. Use a warm, conversational, natural tone with lively phrasing and helpful insights."*
3. **Concise**: 
   > *"You are an ultra-concise AI assistant. Provide direct, highly distilled answers with zero fluff or conversational filler. Give only what is strictly necessary."*

### 3.3 Two Extra Innovation Features (Beyond Requirements)
1. **Extra Feature A: Rich Markdown & Syntax-Highlighted Code Blocks with 1-Click Copy**
   - Full Markdown support (bold, italics, lists, tables, blockquotes).
   - Code blocks with syntax highlighting across languages (JavaScript, Python, JSON, SQL, Bash) + visual "Copy Code" button with instant feedback.
2. **Extra Feature B: Conversation Export & Real-Time Thread Search**
   - **Export Feature**: Download active chat thread as a cleanly formatted `.md` (Markdown) or `.json` file for local documentation.
   - **Search Filter**: Instant client-side search bar in the History Sidebar to filter past conversations by keyword/title.

---

## 4. Technical Architecture & Constraints
- **Client**: Single Page Application (React 18 / Vite / Tailwind CSS / Lucide Icons).
- **Server**: Node.js / Express.js REST + Server-Sent Events (SSE).
- **Database**: MongoDB (via Mongoose ODM).
- **AI Integration**: OpenAI / Claude API endpoint compatible; equipped with intelligent fallback generator so that the system remains 100% operational and interactive even without external API credentials during evaluation.
- **Execution & Validation**: Strict server-side validation for all incoming requests (prompts, tone values, conversation IDs).

---

## 5. Non-Functional Requirements
- **Performance**: Time-To-First-Token (TTFT) < 300ms in streaming mode.
- **Resilience**: Graceful error handling for database disconnections and LLM API rate limits.
- **Responsive Design**: Fluid layout adapting from mobile screens (<768px) to desktop wide screens (>1280px).
- **Clean Code & Modularity**: Separation of concerns across controllers, routes, models, services, and UI components.
- **Git Hygiene**: Atomic, descriptive commits following conventional commit standards (`feat:`, `fix:`, `docs:`, `refactor:`).

---

## 6. Success & Evaluation Checklist
- [x] Scrollable conversation view with distinct bubbles.
- [x] Progressive character/word streaming view.
- [x] Past conversation history sidebar with real-time switching.
- [x] Persistent MongoDB storage for prompt, response, timestamp, and tone.
- [x] Tone selector ("Professional", "Casual", "Concise") modifying backend system instructions.
- [x] 2 extra chatbot features (Code highlighting/copy + Conversation Export & Search).
- [x] Clean architecture separating frontend presentation from server-side logic.
- [x] Complete project delivered before 01:30 PM deadline.
