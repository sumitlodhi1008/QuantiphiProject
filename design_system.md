# Design System & UI/UX Specifications

## Project: Quantiphi Intelligent AI Chat Assistant
**Theme:** Obsidian Precision (Dark Mode First with High-Contrast Accessibility)  
**Framework:** Tailwind CSS + Radix/Lucide Icons + Highlight.js

---

## 1. Visual Identity & Design Philosophy
The design philosophy bridges **Enterprise Reliability** with **Sleek Modern AI Aesthetics**.
- **Clarity First**: Uncluttered whitespace, crisp typography, and readable line heights for long-form answers.
- **Immediate Responsiveness**: Dynamic visual feedback during real-time streaming (breathing avatar indicator, blinking cursor).
- **Distinguishable Roles**: High contrast differentiation between User inputs and Assistant outputs.
- **Vibe Transparency**: Visual tone indicators reinforcing active persona state at all times.

---

## 2. Color Palette & Semantic Design Tokens

### 2.1 Core Neutral Palette (Dark Mode Base)
| Token Name | HEX Code | Tailwind Utility | Application |
| :--- | :--- | :--- | :--- |
| **Surface Dark** | `#0B0F19` | `bg-slate-950` | Primary application canvas background |
| **Surface Elevation 1** | `#111827` | `bg-slate-900` | Sidebar, modals, and container panels |
| **Surface Elevation 2** | `#1E293B` | `bg-slate-800` | Chat bubble backgrounds, active menu selections |
| **Surface Border** | `#334155` | `border-slate-700` | Subtle borders, dividers, and card outlines |
| **Text Primary** | `#F8FAFC` | `text-slate-50` | High emphasis headings, message content |
| **Text Muted** | `#94A3B8` | `text-slate-400` | Timestamps, labels, placeholders |
| **Text Subtle** | `#64748B` | `text-slate-500` | Inactive icons, subtle meta tags |

### 2.2 Brand & Interaction Accents
| Token Name | HEX Code | Application |
| :--- | :--- | :--- |
| **Primary Brand (Quantiphi Cyan)**| `#06B6D4` / `#0284C7` | Primary buttons, active focus rings, user bubble gradient |
| **AI Glow Accent** | `#6366F1` (Indigo) | AI avatar halo, subtle stream pulsing |
| **Success / Copied** | `#10B981` (Emerald) | "Copied to clipboard" confirmation, active online status |
| **Destructive** | `#EF4444` (Rose) | Delete thread action, error banners |

### 2.3 "The Vibe Check" Tone Selector Tokens
| Tone Mode | Accent Color | Badge Styling | Meaning / Vibe |
| :--- | :--- | :--- | :--- |
| **Professional** | Indigo (`#6366F1`) | `bg-indigo-500/10 text-indigo-400 border-indigo-500/30` | Structured, authoritative, polished |
| **Casual** | Emerald (`#10B981`) | `bg-emerald-500/10 text-emerald-400 border-emerald-500/30` | Warm, relaxed, conversational |
| **Concise** | Amber (`#F59E0B`) | `bg-amber-500/10 text-amber-400 border-amber-500/30` | Direct, distilled, punchy |

---

## 3. Typography & Hierarchy

- **Primary Typeface**: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
- **Monospace Typeface**: "JetBrains Mono", "Fira Code", Consolas, monospace (for code snippets and technical terms).

| Role | Size | Weight | Line Height |
| :--- | :--- | :--- | :--- |
| **App Title / Brand** | `1.125rem (18px)` | SemiBold (600) | 1.4 |
| **Sidebar Thread Title** | `0.875rem (14px)` | Medium (500) | 1.3 |
| **Message Body** | `0.9375rem (15px)`| Normal (400) | 1.6 (Optimal readability) |
| **Code Snippet** | `0.875rem (14px)` | Regular (400) | 1.5 |
| **Meta / Timestamp** | `0.75rem (12px)`  | Normal (400) | 1.2 |

---

## 4. Component Design Specifications

### 4.1 Chat Message Bubbles
- **User Bubble**:
  - Alignment: Right-aligned (`flex justify-end`).
  - Styling: Gradient fill (`bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md`), rounded corners (`rounded-2xl rounded-tr-sm`).
  - Metadata: Subtle timestamp on hover or below bubble.
- **AI Bubble**:
  - Alignment: Left-aligned (`flex justify-start`).
  - Styling: Solid elevated background (`bg-slate-900/90 border border-slate-800 text-slate-100 shadow-sm`), rounded corners (`rounded-2xl rounded-tl-sm`).
  - Features: Model avatar indicator, formatted markdown tables, lists, and code blocks.

### 4.2 Streaming Indicator & Cursor
- During SSE active transmission:
  - Trailing streaming cursor: Inline blinking pulse element (`animate-pulse inline-block w-2 h-4 bg-cyan-400 ml-1 rounded-sm`).
  - Stop Generation Button: Accessible in the input toolbar to abort the streaming controller.

### 4.3 History Sidebar
- **Width**: `280px` on desktop, full-width overlay drawer on mobile screens.
- **Controls**:
  - `+ New Chat` prominent button at the top with primary accent styling.
  - Search input box filtering threads in real-time.
  - List of past threads sorted by `updatedAt` desc with active state highlight (`bg-slate-800/80 text-cyan-400 border-l-2 border-cyan-400`).
  - Hover action: Trash icon for quick thread deletion.

### 4.4 "The Vibe Check" Tone Selector
- Segmented control in the top navigation bar:
  - Three pill buttons: `[ 👔 Professional ]` `[ ☕ Casual ]` `[ ⚡ Concise ]`.
  - Active button highlights with tone accent glow and subtle border.
  - Tooltip explaining how the system instruction adapts for the selected tone.

### 4.5 Extra Features UI Specifications
- **Code Block Component**:
  - Header with language tag (e.g., `JAVASCRIPT`, `PYTHON`, `SQL`).
  - "Copy Code" button with icon that transitions to a green checkmark (`Copied!`) for 2 seconds.
  - Syntax highlighted code body with custom dark theme scrollbar.
- **Export Toolbar**:
  - Header action button: `Export Chat` with dropdown or modal options:
    - `Download as Markdown (.md)`
    - `Download as JSON (.json)`

---

## 5. Animation & Motion Design
- **Fade In**: Messages appear with a smooth `opacity-0` to `opacity-100` transition (`duration-200 ease-out`).
- **Sidebar Slide**: Smooth sliding drawer transition for responsive mobile devices (`transition-transform duration-300`).
- **Auto-Scroll Behavior**: `behavior: 'smooth'` snapping automatically to bottom when new tokens stream in, unless user manually scrolls up.
