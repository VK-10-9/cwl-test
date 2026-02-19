"use client";

/**
 * Shared lightweight Markdown renderer for legal document previews.
 * Handles headings (h1–h3), bold lines, list items, and paragraphs.
 * Used by both DocumentEditor and DocumentPreview to avoid duplication.
 */

interface MarkdownRendererProps {
    content: string;
    /** Additional className applied to the prose wrapper */
    className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
    if (!content.trim()) {
        return (
            <div className="text-center text-muted-foreground py-12 text-sm italic">
                No document content to display.
            </div>
        );
    }

    return (
        <div className={`prose prose-slate max-w-none font-serif leading-loose ${className}`}>
            {content.split("\n").map((line, i) => {
                const trimmed = line.trim();

                if (!trimmed) return <br key={i} className="mb-4" />;

                // H1 — document title
                if (trimmed.startsWith("# ")) {
                    return (
                        <h1
                            key={i}
                            className="text-3xl font-bold text-center mb-8 uppercase tracking-wider border-b-2 border-black pb-4"
                        >
                            {trimmed.replace(/^#\s+/, "")}
                        </h1>
                    );
                }

                // H2 — section heading
                if (trimmed.startsWith("## ")) {
                    return (
                        <h2
                            key={i}
                            className="text-xl font-bold mt-8 mb-4 uppercase tracking-wide border-b border-slate-300 pb-1"
                        >
                            {trimmed.replace(/^##\s+/, "")}
                        </h2>
                    );
                }

                // H3 — sub-heading
                if (trimmed.startsWith("### ")) {
                    return (
                        <h3 key={i} className="text-lg font-semibold mt-6 mb-3">
                            {trimmed.replace(/^###\s+/, "")}
                        </h3>
                    );
                }

                // Bold-only line (e.g. **WHEREAS**)
                if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                    return (
                        <p key={i} className="font-bold text-center mb-6 text-lg">
                            {trimmed.replace(/\*\*/g, "")}
                        </p>
                    );
                }

                // Unordered list item
                if (trimmed.startsWith("- ")) {
                    return (
                        <li key={i} className="ml-8 list-disc pl-2 mb-2">
                            {trimmed.replace(/^-\s+/, "")}
                        </li>
                    );
                }

                // Numbered clause (e.g. "1. Definitions")
                if (/^\d+\.\s/.test(trimmed)) {
                    return (
                        <p key={i} className="mb-4 text-justify">
                            {line}
                        </p>
                    );
                }

                // Default paragraph
                return (
                    <p key={i} className="mb-4 text-justify indent-8">
                        {line}
                    </p>
                );
            })}
        </div>
    );
}
