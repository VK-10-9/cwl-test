# 📄 DocuForge AI (Stateless MVP)

**DocuForge AI** is an intelligent document automation platform that generates legal documents (NDAs, MOUs, etc.) from structured inputs and refines them using AI.

## 🚀 Features

*   **Stateless Architecture**: No complex database setup required. Runs entirely on local logic and transient state.
*   **AI-Powered Drafting**: Uses **Groq (Llama-3)** for lightning-fast document generation and iteration.
*   **Modern UI**: Beautiful, responsive interface built with **Tailwind CSS v4** and Glassmorphism design principles.
*   **Interactive Workflow**: form input → blueprint review → AI chat iteration → final export.
*   **Export Ready**: Direct export to formatted PDF and DOCX files.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 14 (App Router), React, Tailwind CSS v4, Lucide Icons (via SVG).
*   **Backend**: Next.js API Routes (Stateless).
*   **AI Engine**: Groq SDK (`llama-3-70b-8192` or similar).
*   **Document Logic**: TypeScript templates, Zod validation.

## 📦 precise setup

1.  **Clone the repository** (if not already done).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env` file with your Groq API key:
    ```bash
    GROQ_API_KEY=your_key_here
    DATABASE_URL="file:./dev.db" # (Legacy/Placeholder for build)
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000).

## 📝 License
MIT
