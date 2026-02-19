# DocuForge AI — Project Instructions for Claude Code

## Project Overview
DocuForge AI is a web-based document automation platform. Users select a document type
(NDA, MOU, Request Letter, etc.), fill a structured form, and receive a professionally
formatted legal draft via a two-stage AI generation process. They can then refine it
through a natural-language iteration loop before exporting as PDF or DOCX.

## Tech Stack
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Zod (form validation)
- **Backend:** Next.js API routes (keep it simple, one repo)
- **Database:** SQLite (local file) - Stateless operation for MVP
- **AI Layer:** Groq API (openai/gpt-oss-120b) via Groq SDK
- **PDF Export:** Puppeteer
- **DOCX Export:** docx.js

## Project Structure
```
doc-fuge/
├── app/
│   ├── page.tsx                  # Landing / document type selection
│   ├── generate/
│   │   ├── page.tsx              # Main generation flow
│   │   └── [docType]/page.tsx    # Dynamic form per document type
│   └── api/
│       ├── generate/route.ts     # Blueprint generation endpoint
│       ├── iterate/route.ts      # AI iteration loop endpoint
│       └── export/route.ts       # PDF/DOCX export endpoint
├── components/
│   ├── DocumentSelector.tsx
│   ├── DynamicForm.tsx
│   ├── BlueprintViewer.tsx
│   ├── IterationChat.tsx
│   └── DocumentPreview.tsx
├── lib/
│   ├── ai.ts                     # AI client setup (Groq)
│   ├── prompts.ts                # All prompt templates
│   ├── templates/                # Document clause definitions
│   │   ├── nda.ts
│   │   ├── mou.ts
│   │   ├── request-letter.ts
│   │   ├── internship-cert.ts
│   │   └── sponsorship-letter.ts
│   └── exporters/
│       ├── pdf.ts
│       └── docx.ts
├── prisma/
│   └── schema.prisma
└── types/
    └── index.ts
```

## Core Coding Rules
- Always use TypeScript with strict types — no `any`
- Use Zod for all form validation AND API input validation
- All Anthropic API calls go through `lib/anthropic.ts` — never call the SDK directly in components
- Use `async/await`, never raw `.then()` chains
- Keep API routes thin — business logic goes in `lib/`
- Every component must have a clear single responsibility

## Document Types (MVP — exactly these 5)
1. `nda` — Non-Disclosure Agreement
2. `mou` — Memorandum of Understanding
3. `request-letter` — Official Request Letter
4. `internship-cert` — Internship Certificate
5. `sponsorship-letter` — Sponsorship Letter

## AI Generation: Two-Stage Process (CRITICAL)
### Stage 1 — Blueprint
- Generate a JSON clause list, NOT the full document text
- Each clause has: `id`, `title`, `description` (plain English), `included: boolean`, `risk: low|medium|high`
- This is fast and cheap — users review this first

### Stage 2 — Full Document
- Only triggered after user approves the blueprint
- Expands each included clause into formal legal language
- Returns complete formatted document text

## Environment Variables Required
```
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Schema (Prisma — keep it minimal for MVP)
- `Organisation` — id, name, address, jurisdiction, signatoryName, createdAt
- `Document` — id, type, status (draft|approved|exported), orgAId, orgBId?, blueprintJson, fullText, version, createdAt, updatedAt
- `Iteration` — id, documentId, userMessage, aiResponse, createdAt

## What NOT to build in MVP
- Do NOT build: e-sign, role-based access, multi-user auth, risk scoring dashboard, clause marketplace
- Do NOT add: complex animations, dark mode toggle, analytics
- Keep it fast and working first

## Style Guidelines
- Clean, minimal UI — think Notion meets a legal firm
- Color palette: Navy (#1F3864) primary, white background, light grey cards
- Font: Inter (Google Fonts)
- No flashy gradients — professional and trustworthy
