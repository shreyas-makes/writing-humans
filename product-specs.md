# Product Specification: Human-First AI Writing App with Daemon Suggestions

## Overview

A minimalist writing app where **100% of the text is written by the human**. AI is present only in the form of background characters called **"daemons"** who make passive, contextual suggestions. These suggestions are presented ambiently and never inserted into the text directly. Users can bookmark them to review later or dismiss them entirely.

The app is built with **Next.js 14 App Router**, **ShadCN UI**, **Supabase**, **Tiptap**, and **Vercel's AI SDK**.

---

## Key Constraints

* The AI **never modifies** or inserts content into the text.
* All writing is explicitly done by the human.
* AI can only **suggest**, and suggestions are external to the document.

---

## Core Features

### 1. **Editor Interface**

* Rich text editor powered by **Tiptap**.
* Google Docs-style page layout: centered writing area with side margins.
* Support for formatting via:

  * Slash commands (`/h1`, `/bold`, `/quote`, etc.)
  * Keyboard shortcuts

### 2. **Daemon System (Ambient AI Suggestions)**

* Triggered on sentence pause or text highlight

* Tooltip appears with:

  * Daemon name + icon
  * Suggestion text
  * Two actions only: `Bookmark` or `Delete`

* If **Bookmark** is chosen:

  * Tooltip collapses into a small **dot marker** in the margin
  * Clicking the marker reopens the suggestion in a ShadCN `Popover`
  * Suggestion is always passive and external

### 3. **Daemon Roles** (AI Agents using Vercel AI SDK)

Each daemon uses `createAI()` and a unique system prompt:

| Daemon Name      | Role Description                                     |
| ---------------- | ---------------------------------------------------- |
| Devil's Advocate | Challenges claims or assumptions                     |
| Synthesizer      | Suggests more concise phrasing                       |
| Complimenter     | Praises elegant or well-structured writing           |
| Elaborator       | Points out vague statements and requests elaboration |
| Researcher       | Suggests sources, citations, or supporting evidence  |

### 4. **Slash Command Menu**

* Built with ShadCN `Command` + `Popover`
* Appears when user types `/`
* Supported commands: heading levels, bold, italic, quote, code block

### 5. **Sidebar (Optional)**

* Lists active suggestion bookmarks
* Filterable by daemon type
* Allows navigation to specific markers

---

## Tech Stack

| Layer      | Tool                      |
| ---------- | ------------------------- |
| Framework  | Next.js 14                |
| Editor     | Tiptap                    |
| Auth/DB    | Supabase                  |
| UI Library | ShadCN (Radix + Tailwind) |
| AI Layer   | Vercel AI SDK             |

---

## File Structure (Proposed)

```
/app
  /editor
    page.tsx
/components
  /editor
    CommandMenu.tsx
    DaemonPopover.tsx
    MarkerDot.tsx
/lib
  /ai/daemons
    devil.ts
    synth.ts
    compliment.ts
    elaborate.ts
    research.ts
/types
  suggestion.ts
/schemas
  supabase.sql or prisma.schema
```

---

## Supabase Schema

```sql
table documents {
  id uuid primary key,
  user_id uuid references users,
  title text,
  content jsonb,
  created_at timestamp
}

table suggestions {
  id uuid primary key,
  document_id uuid references documents,
  daemon_type text,
  original_text text,
  suggestion_text text,
  paragraph_id text,
  offset int,
  status enum ('bookmarked', 'dismissed'),
  created_at timestamp
}
```

---

## Summary

This product creates a new kind of AI-powered writing tool where the **AI is a silent partner**, not a co-author. It provides insight, challenge, praise, and evidence — but never writes a word for you. The app is designed to respect and preserve the craft of writing while enhancing the quality of thought.
