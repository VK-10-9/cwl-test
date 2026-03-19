"use client";

import React from "react";

/**
 * Shared Markdown renderer for legal document previews.
 *
 * Block-level:
 *   Headings (h1–h4), horizontal rules, blockquotes,
 *   callout blocks (> [!NOTE], > [!WARNING], > [!IMPORTANT], > [!TIP], > [!CAUTION]),
 *   ordered / unordered / roman / lettered / checklist lists,
 *   fenced code blocks (```), tables,
 *   step sequences (Step 1: …, Step 2: …),
 *   sub-section numbering (1.1, 2.3.1),
 *   definition terms ("Term" means …),
 *   legal patterns: WHEREAS, WITNESSETH, IN WITNESS WHEREOF,
 *   schedule/annexure/appendix headers, execution blocks,
 *   party definitions (hereinafter), signature blocks
 *
 * Inline:
 *   ***bold italic***, **bold**, *italic*, `code`, [link](url),
 *   ~~strikethrough~~, ==highlight==
 *
 * Used by DocumentEditor and DocumentPreview.
 */

interface MarkdownRendererProps {
    content: string;
    /** Additional className applied to the wrapper */
    className?: string;
}

// ─── Inline Formatting ───────────────────────────────────────────────────────

function renderInline(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    // Order matters — longest / most specific patterns first
    const regex =
        /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|~~(.+?)~~|==(.+?)==)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));

        if (match[2]) {
            // ***bold italic***
            parts.push(
                <strong key={match.index}>
                    <em>{match[2]}</em>
                </strong>,
            );
        } else if (match[3]) {
            // **bold**
            parts.push(<strong key={match.index}>{match[3]}</strong>);
        } else if (match[4]) {
            // *italic*
            parts.push(<em key={match.index}>{match[4]}</em>);
        } else if (match[5]) {
            // `inline code`
            parts.push(
                <code
                    key={match.index}
                    className="px-1 py-0.5 bg-slate-100 text-slate-700 rounded text-[0.85em] font-mono"
                >
                    {match[5]}
                </code>,
            );
        } else if (match[6] && match[7]) {
            // [link](url)
            parts.push(
                <a
                    key={match.index}
                    href={match[7]}
                    className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {match[6]}
                </a>,
            );
        } else if (match[8]) {
            // ~~strikethrough~~
            parts.push(
                <s key={match.index} className="text-slate-400">
                    {match[8]}
                </s>,
            );
        } else if (match[9]) {
            // ==highlight==
            parts.push(
                <mark
                    key={match.index}
                    className="bg-yellow-100 text-yellow-900 px-0.5 rounded-sm font-medium"
                >
                    {match[9]}
                </mark>,
            );
        }

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts.length > 0 ? parts : [text];
}

// ─── Block-Level Classifiers ─────────────────────────────────────────────────

type BlockType =
    | { kind: "blank" }
    | { kind: "hr" }
    | { kind: "h1"; text: string }
    | { kind: "h2"; text: string }
    | { kind: "h3"; text: string }
    | { kind: "h4"; text: string }
    | { kind: "bold-center"; text: string }
    | { kind: "ul-item"; text: string }
    | { kind: "ol-item"; num: string; text: string }
    | { kind: "sub-section"; nums: string; text: string }
    | { kind: "letter-item"; letter: string; text: string }
    | { kind: "roman-item"; numeral: string; text: string }
    | { kind: "checklist-item"; checked: boolean; text: string }
    | { kind: "step"; num: string; title: string }
    | { kind: "definition"; term: string; text: string }
    | { kind: "blockquote"; text: string }
    | { kind: "callout-header"; calloutType: string; text: string }
    | { kind: "table-row"; cells: string[] }
    | { kind: "table-separator" }
    | { kind: "code-fence"; lang: string }
    | { kind: "schedule"; text: string }
    | { kind: "execution"; text: string }
    | { kind: "party-def"; text: string }
    | { kind: "signature"; text: string }
    | { kind: "whereas"; text: string }
    | { kind: "witness"; text: string }
    | { kind: "paragraph"; text: string };

function classifyLine(line: string): BlockType {
    const trimmed = line.trim();

    if (!trimmed) return { kind: "blank" };

    // Fenced code block delimiter
    if (/^`{3}/.test(trimmed)) return { kind: "code-fence", lang: trimmed.slice(3).trim() };

    // Horizontal rule
    if (/^[-_*]{3,}$/.test(trimmed)) return { kind: "hr" };

    // Headings
    if (trimmed.startsWith("#### ")) return { kind: "h4", text: trimmed.slice(5) };
    if (trimmed.startsWith("### ")) return { kind: "h3", text: trimmed.slice(4) };
    if (trimmed.startsWith("## ")) return { kind: "h2", text: trimmed.slice(3) };
    if (trimmed.startsWith("# ")) return { kind: "h1", text: trimmed.slice(2) };

    // Table separator ( |---|---| )
    if (/^\|[\s:|-]+\|$/.test(trimmed)) return { kind: "table-separator" };

    // Table row ( | cell | cell | )
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const cells = trimmed.slice(1, -1).split("|").map((c) => c.trim());
        return { kind: "table-row", cells };
    }

    // Blockquote / Callout
    if (trimmed.startsWith("> ") || trimmed === ">") {
        const inner = trimmed.startsWith("> ") ? trimmed.slice(2) : "";
        const callout = inner.match(/^\[!(NOTE|WARNING|IMPORTANT|TIP|CAUTION)\]\s*(.*)/i);
        if (callout) {
            return { kind: "callout-header", calloutType: callout[1].toLowerCase(), text: callout[2] };
        }
        return { kind: "blockquote", text: inner };
    }

    // ── Legal patterns ──

    // WHEREAS / WITNESSETH / NOW THEREFORE
    if (/^(WHEREAS|WITNESSETH|NOW,?\s*THEREFORE)/i.test(trimmed)) {
        return { kind: "whereas", text: trimmed };
    }

    // IN WITNESS WHEREOF
    if (/^IN WITNESS WHEREOF/i.test(trimmed)) {
        return { kind: "witness", text: trimmed };
    }

    // SCHEDULE / ANNEXURE / APPENDIX / EXHIBIT
    if (/^(SCHEDULE|ANNEXURE|APPENDIX|EXHIBIT)\s/i.test(trimmed)) {
        return { kind: "schedule", text: trimmed };
    }

    // Execution block: "Executed on this…", "Signed at…", "Dated this…"
    if (/^(Executed|Signed|Dated)\s+(on|this|at)\s/i.test(trimmed)) {
        return { kind: "execution", text: trimmed };
    }

    // Party definition: "hereinafter referred to as"
    if (/hereinafter\s+(referred\s+to\s+as|called)/i.test(trimmed)) {
        return { kind: "party-def", text: trimmed };
    }

    // Bold-only line (e.g. **RECITALS**)
    if (
        trimmed.startsWith("**") &&
        trimmed.endsWith("**") &&
        !trimmed.slice(2, -2).includes("**")
    ) {
        return { kind: "bold-center", text: trimmed.slice(2, -2) };
    }

    // Checklist: - [x] or - [ ]
    const checkMatch = trimmed.match(/^[-*]\s+\[([ xX])\]\s+(.*)/);
    if (checkMatch) {
        return {
            kind: "checklist-item",
            checked: checkMatch[1].toLowerCase() === "x",
            text: checkMatch[2],
        };
    }

    // Step: Step 1: Title  or  STEP 2. Title
    const stepMatch = trimmed.match(/^(?:Step|STEP)\s+(\d+)[:.]\s+(.*)/i);
    if (stepMatch) {
        return { kind: "step", num: stepMatch[1], title: stepMatch[2] };
    }

    // Unordered list item (must come AFTER checklist to avoid mis-match)
    if (/^[-•*]\s+/.test(trimmed)) {
        return { kind: "ul-item", text: trimmed.replace(/^[-•*]\s+/, "") };
    }

    // Sub-section numbering: 1.1, 2.3.1, etc. (must come BEFORE simple ordered list)
    const subMatch = trimmed.match(/^(\d+(?:\.\d+)+)\s+(.*)/);
    if (subMatch) {
        return { kind: "sub-section", nums: subMatch[1], text: subMatch[2] };
    }

    // Ordered list: 1. , 2. , 3.
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
        return { kind: "ol-item", num: olMatch[1], text: olMatch[2] };
    }

    // Roman numeral items: (i), (ii), (iii), (iv), (ix), (xii)
    const romanMatch = trimmed.match(/^\(([ivxlcdm]+)\)\s+(.*)/i);
    if (romanMatch) {
        return { kind: "roman-item", numeral: romanMatch[1].toLowerCase(), text: romanMatch[2] };
    }

    // Lettered sub-items: (a), (b), (c)
    const letterMatch = trimmed.match(/^\(([a-z])\)\s+(.*)/);
    if (letterMatch) {
        return { kind: "letter-item", letter: letterMatch[1], text: letterMatch[2] };
    }

    // Definition: "Term" means / shall mean / refers to / includes
    const defMatch = trimmed.match(
        /^["""]([^"""]+)["""]?\s+(means|shall\s+mean|refers?\s+to|includes?)\s/i,
    );
    if (defMatch) {
        return { kind: "definition", term: defMatch[1], text: trimmed };
    }

    // Signature line (5+ underscores)
    if (/_{5,}/.test(trimmed)) {
        return { kind: "signature", text: trimmed };
    }

    return { kind: "paragraph", text: line };
}

// ─── Block Grouping ──────────────────────────────────────────────────────────
// Groups consecutive same-kind lines into composite structures

type GroupedBlock =
    | { kind: "single"; block: BlockType; index: number }
    | { kind: "ul"; items: string[]; startIndex: number }
    | { kind: "ol"; items: { num: string; text: string }[]; startIndex: number }
    | { kind: "roman-list"; items: { numeral: string; text: string }[]; startIndex: number }
    | { kind: "letter-list"; items: { letter: string; text: string }[]; startIndex: number }
    | { kind: "checklist"; items: { checked: boolean; text: string }[]; startIndex: number }
    | { kind: "step-list"; steps: { num: string; title: string }[]; startIndex: number }
    | { kind: "blockquote"; lines: string[]; startIndex: number }
    | { kind: "callout"; calloutType: string; title: string; lines: string[]; startIndex: number }
    | { kind: "table"; header: string[]; rows: string[][]; startIndex: number }
    | { kind: "code-block"; lang: string; lines: string[]; startIndex: number };

function groupBlocks(lines: string[]): GroupedBlock[] {
    const classified = lines.map(classifyLine);
    const groups: GroupedBlock[] = [];
    let i = 0;

    while (i < classified.length) {
        const block = classified[i];

        // ── Fenced code block ──
        if (block.kind === "code-fence") {
            const startIndex = i;
            const lang = block.lang;
            i++; // skip opening fence
            const codeLines: string[] = [];
            while (i < lines.length) {
                if (lines[i].trim().startsWith("```")) {
                    i++; // skip closing fence
                    break;
                }
                codeLines.push(lines[i]);
                i++;
            }
            groups.push({ kind: "code-block", lang, lines: codeLines, startIndex });
            continue;
        }

        // ── Callout block (> [!TYPE]) ──
        if (block.kind === "callout-header") {
            const startIndex = i;
            const { calloutType, text: title } = block;
            i++;
            const bodyLines: string[] = [];
            while (i < classified.length && classified[i].kind === "blockquote") {
                bodyLines.push(
                    (classified[i] as Extract<BlockType, { kind: "blockquote" }>).text,
                );
                i++;
            }
            groups.push({ kind: "callout", calloutType, title, lines: bodyLines, startIndex });
            continue;
        }

        // ── Blockquote ──
        if (block.kind === "blockquote") {
            const bqLines: string[] = [];
            const startIndex = i;
            while (i < classified.length && classified[i].kind === "blockquote") {
                bqLines.push(
                    (classified[i] as Extract<BlockType, { kind: "blockquote" }>).text,
                );
                i++;
            }
            groups.push({ kind: "blockquote", lines: bqLines, startIndex });
            continue;
        }

        // ── Unordered list ──
        if (block.kind === "ul-item") {
            const items: string[] = [];
            const startIndex = i;
            while (i < classified.length && classified[i].kind === "ul-item") {
                items.push(
                    (classified[i] as Extract<BlockType, { kind: "ul-item" }>).text,
                );
                i++;
            }
            groups.push({ kind: "ul", items, startIndex });
            continue;
        }

        // ── Ordered list ──
        if (block.kind === "ol-item") {
            const items: { num: string; text: string }[] = [];
            const startIndex = i;
            while (i < classified.length && classified[i].kind === "ol-item") {
                const ol = classified[i] as Extract<BlockType, { kind: "ol-item" }>;
                items.push({ num: ol.num, text: ol.text });
                i++;
            }
            groups.push({ kind: "ol", items, startIndex });
            continue;
        }

        // ── Roman numeral list ──
        if (block.kind === "roman-item") {
            const items: { numeral: string; text: string }[] = [];
            const startIndex = i;
            while (i < classified.length && classified[i].kind === "roman-item") {
                const r = classified[i] as Extract<BlockType, { kind: "roman-item" }>;
                items.push({ numeral: r.numeral, text: r.text });
                i++;
            }
            groups.push({ kind: "roman-list", items, startIndex });
            continue;
        }

        // ── Letter list ──
        if (block.kind === "letter-item") {
            const items: { letter: string; text: string }[] = [];
            const startIndex = i;
            while (i < classified.length && classified[i].kind === "letter-item") {
                const l = classified[i] as Extract<BlockType, { kind: "letter-item" }>;
                items.push({ letter: l.letter, text: l.text });
                i++;
            }
            groups.push({ kind: "letter-list", items, startIndex });
            continue;
        }

        // ── Checklist ──
        if (block.kind === "checklist-item") {
            const items: { checked: boolean; text: string }[] = [];
            const startIndex = i;
            while (i < classified.length && classified[i].kind === "checklist-item") {
                const c = classified[i] as Extract<BlockType, { kind: "checklist-item" }>;
                items.push({ checked: c.checked, text: c.text });
                i++;
            }
            groups.push({ kind: "checklist", items, startIndex });
            continue;
        }

        // ── Step list ──
        if (block.kind === "step") {
            const steps: { num: string; title: string }[] = [];
            const startIndex = i;
            while (i < classified.length && classified[i].kind === "step") {
                const s = classified[i] as Extract<BlockType, { kind: "step" }>;
                steps.push({ num: s.num, title: s.title });
                i++;
            }
            groups.push({ kind: "step-list", steps, startIndex });
            continue;
        }

        // ── Table ──
        if (block.kind === "table-row") {
            const startIndex = i;
            const header = (classified[i] as Extract<BlockType, { kind: "table-row" }>).cells;
            i++;
            // Skip separator row
            if (i < classified.length && classified[i].kind === "table-separator") i++;
            const rows: string[][] = [];
            while (i < classified.length && classified[i].kind === "table-row") {
                rows.push(
                    (classified[i] as Extract<BlockType, { kind: "table-row" }>).cells,
                );
                i++;
            }
            groups.push({ kind: "table", header, rows, startIndex });
            continue;
        }

        // Skip standalone table separator
        if (block.kind === "table-separator") {
            i++;
            continue;
        }

        groups.push({ kind: "single", block, index: i });
        i++;
    }

    return groups;
}

// ─── Callout Style Map ───────────────────────────────────────────────────────

const CALLOUT_STYLES: Record<
    string,
    { icon: string; border: string; bg: string; label: string; titleColor: string }
> = {
    note: {
        icon: "ℹ️",
        border: "border-blue-300",
        bg: "bg-blue-50",
        label: "Note",
        titleColor: "text-blue-700",
    },
    tip: {
        icon: "💡",
        border: "border-green-300",
        bg: "bg-green-50",
        label: "Tip",
        titleColor: "text-green-700",
    },
    important: {
        icon: "⚠️",
        border: "border-amber-300",
        bg: "bg-amber-50",
        label: "Important",
        titleColor: "text-amber-700",
    },
    warning: {
        icon: "🔶",
        border: "border-orange-300",
        bg: "bg-orange-50",
        label: "Warning",
        titleColor: "text-orange-700",
    },
    caution: {
        icon: "🛑",
        border: "border-red-300",
        bg: "bg-red-50",
        label: "Caution",
        titleColor: "text-red-700",
    },
};

// ─── Render ──────────────────────────────────────────────────────────────────

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
    if (!content.trim()) {
        return (
            <div className="text-center text-muted-foreground py-12 text-sm italic">
                No document content to display.
            </div>
        );
    }

    const lines = content.split("\n");
    const groups = groupBlocks(lines);

    return (
        <div className={`max-w-none font-serif leading-loose ${className}`}>
            {groups.map((group) => {
                // ── Unordered list ──
                if (group.kind === "ul") {
                    return (
                        <ul
                            key={`ul-${group.startIndex}`}
                            className="ml-8 list-disc pl-2 mb-4 space-y-1"
                        >
                            {group.items.map((item, j) => (
                                <li key={j} className="text-justify">
                                    {renderInline(item)}
                                </li>
                            ))}
                        </ul>
                    );
                }

                // ── Ordered list ──
                if (group.kind === "ol") {
                    return (
                        <ol
                            key={`ol-${group.startIndex}`}
                            className="ml-8 list-decimal pl-2 mb-4 space-y-1"
                        >
                            {group.items.map((item, j) => (
                                <li
                                    key={j}
                                    value={parseInt(item.num, 10)}
                                    className="text-justify"
                                >
                                    {renderInline(item.text)}
                                </li>
                            ))}
                        </ol>
                    );
                }

                // ── Roman numeral list ──
                if (group.kind === "roman-list") {
                    return (
                        <ol
                            key={`rom-${group.startIndex}`}
                            className="ml-12 mb-4 space-y-1.5 list-none pl-0"
                        >
                            {group.items.map((item, j) => (
                                <li key={j} className="text-justify flex gap-2">
                                    <span className="text-slate-500 font-mono text-sm shrink-0 w-10 text-right">
                                        ({item.numeral})
                                    </span>
                                    <span>{renderInline(item.text)}</span>
                                </li>
                            ))}
                        </ol>
                    );
                }

                // ── Letter list ──
                if (group.kind === "letter-list") {
                    return (
                        <ol
                            key={`let-${group.startIndex}`}
                            className="ml-12 mb-4 space-y-1.5 list-none pl-0"
                        >
                            {group.items.map((item, j) => (
                                <li key={j} className="text-justify flex gap-2">
                                    <span className="text-slate-500 font-mono text-sm shrink-0 w-6 text-right">
                                        ({item.letter})
                                    </span>
                                    <span>{renderInline(item.text)}</span>
                                </li>
                            ))}
                        </ol>
                    );
                }

                // ── Checklist ──
                if (group.kind === "checklist") {
                    return (
                        <ul
                            key={`chk-${group.startIndex}`}
                            className="ml-6 mb-4 space-y-2 list-none pl-0"
                        >
                            {group.items.map((item, j) => (
                                <li key={j} className="flex items-start gap-2.5">
                                    <span
                                        className={`mt-1 flex-shrink-0 w-4.5 h-4.5 rounded border-2 flex items-center justify-center text-[10px] font-bold ${
                                            item.checked
                                                ? "bg-green-100 border-green-500 text-green-700"
                                                : "bg-slate-50 border-slate-300 text-transparent"
                                        }`}
                                    >
                                        {item.checked ? "✓" : ""}
                                    </span>
                                    <span
                                        className={
                                            item.checked ? "text-slate-500 line-through" : ""
                                        }
                                    >
                                        {renderInline(item.text)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    );
                }

                // ── Step list (with visual step indicators and connector) ──
                if (group.kind === "step-list") {
                    const total = group.steps.length;
                    return (
                        <div key={`stp-${group.startIndex}`} className="my-8 ml-2">
                            <div className="relative pl-10">
                                {/* Vertical connector line */}
                                <div className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-200" />

                                <div className="space-y-0">
                                    {group.steps.map((step, j) => {
                                        const isLast = j === total - 1;
                                        return (
                                            <div
                                                key={j}
                                                className="relative flex items-start gap-4 py-3"
                                            >
                                                {/* Step circle */}
                                                <div
                                                    className={`absolute left-[-26px] mt-0.5 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-10 ${
                                                        isLast
                                                            ? "bg-slate-600 text-white ring-2 ring-slate-300"
                                                            : "bg-slate-800 text-white"
                                                    }`}
                                                >
                                                    {step.num}
                                                </div>
                                                {/* Step content */}
                                                <div className="flex-1 min-w-0 pt-0.5">
                                                    <p className="font-semibold text-slate-800 leading-snug">
                                                        {renderInline(step.title)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                }

                // ── Blockquote ──
                if (group.kind === "blockquote") {
                    return (
                        <blockquote
                            key={`bq-${group.startIndex}`}
                            className="border-l-4 border-slate-300 pl-4 my-4 text-slate-600 italic"
                        >
                            {group.lines.map((ln, j) =>
                                ln ? (
                                    <p key={j} className="mb-1 text-justify">
                                        {renderInline(ln)}
                                    </p>
                                ) : (
                                    <br key={j} />
                                ),
                            )}
                        </blockquote>
                    );
                }

                // ── Callout block ──
                if (group.kind === "callout") {
                    const style = CALLOUT_STYLES[group.calloutType] || CALLOUT_STYLES.note;
                    return (
                        <div
                            key={`co-${group.startIndex}`}
                            className={`my-5 rounded-md border-l-4 ${style.border} ${style.bg} px-4 py-3`}
                        >
                            <div
                                className={`flex items-center gap-2 font-bold text-sm ${style.titleColor}`}
                            >
                                <span>{style.icon}</span>
                                <span>{group.title || style.label}</span>
                            </div>
                            {group.lines.length > 0 && (
                                <div className="text-sm text-slate-700 mt-2 space-y-1">
                                    {group.lines.map((ln, j) =>
                                        ln ? (
                                            <p key={j}>{renderInline(ln)}</p>
                                        ) : (
                                            <br key={j} />
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    );
                }

                // ── Table ──
                if (group.kind === "table") {
                    return (
                        <div
                            key={`tbl-${group.startIndex}`}
                            className="my-6 overflow-x-auto rounded border border-slate-200"
                        >
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="border-b-2 border-slate-300 bg-slate-50">
                                        {group.header.map((cell, j) => (
                                            <th
                                                key={j}
                                                className="px-4 py-2.5 text-left font-bold text-slate-700"
                                            >
                                                {renderInline(cell)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.rows.map((row, j) => (
                                        <tr
                                            key={j}
                                            className="border-b border-slate-200 even:bg-slate-50/50"
                                        >
                                            {row.map((cell, k) => (
                                                <td
                                                    key={k}
                                                    className="px-4 py-2 text-slate-600"
                                                >
                                                    {renderInline(cell)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                }

                // ── Fenced code block ──
                if (group.kind === "code-block") {
                    return (
                        <div
                            key={`code-${group.startIndex}`}
                            className="my-5 rounded-md overflow-hidden border border-slate-200 shadow-sm"
                        >
                            {group.lang && (
                                <div className="bg-slate-100 px-4 py-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                    {group.lang}
                                </div>
                            )}
                            <pre className="bg-slate-50 p-4 overflow-x-auto text-sm font-mono leading-relaxed text-slate-700">
                                <code>{group.lines.join("\n")}</code>
                            </pre>
                        </div>
                    );
                }

                // ── Single blocks ──
                const { block, index } = group;

                switch (block.kind) {
                    case "blank":
                        return <div key={index} className="h-3" />;

                    case "hr":
                        return <hr key={index} className="my-8 border-slate-300" />;

                    case "h1":
                        return (
                            <h1
                                key={index}
                                className="text-2xl font-bold text-center mb-8 uppercase tracking-wider border-b-2 border-black pb-4"
                            >
                                {renderInline(block.text)}
                            </h1>
                        );

                    case "h2":
                        return (
                            <h2
                                key={index}
                                className="text-lg font-bold mt-10 mb-4 uppercase tracking-wide border-b border-slate-300 pb-1"
                            >
                                {renderInline(block.text)}
                            </h2>
                        );

                    case "h3":
                        return (
                            <h3
                                key={index}
                                className="text-base font-semibold mt-6 mb-3"
                            >
                                {renderInline(block.text)}
                            </h3>
                        );

                    case "h4":
                        return (
                            <h4
                                key={index}
                                className="text-sm font-semibold mt-4 mb-2 uppercase tracking-wide text-slate-600"
                            >
                                {renderInline(block.text)}
                            </h4>
                        );

                    case "bold-center":
                        return (
                            <p
                                key={index}
                                className="font-bold text-center mb-6 text-base"
                            >
                                {block.text}
                            </p>
                        );

                    // ── Legal: WHEREAS / WITNESSETH / NOW THEREFORE ──
                    case "whereas":
                        return (
                            <p
                                key={index}
                                className="mb-4 text-justify pl-4 border-l-[3px] border-slate-400 font-semibold italic"
                            >
                                {renderInline(block.text)}
                            </p>
                        );

                    // ── Legal: IN WITNESS WHEREOF ──
                    case "witness":
                        return (
                            <p
                                key={index}
                                className="mt-10 mb-6 text-center font-bold uppercase tracking-widest text-sm border-y border-slate-300 py-3"
                            >
                                {renderInline(block.text)}
                            </p>
                        );

                    // ── Legal: SCHEDULE / ANNEXURE / APPENDIX ──
                    case "schedule":
                        return (
                            <div key={index} className="mt-14 mb-6 text-center">
                                <div className="inline-block border-y-2 border-black py-3 px-8">
                                    <p className="text-lg font-bold uppercase tracking-[0.3em]">
                                        {renderInline(block.text)}
                                    </p>
                                </div>
                            </div>
                        );

                    // ── Legal: Execution block ──
                    case "execution":
                        return (
                            <p
                                key={index}
                                className="mt-8 mb-4 text-justify italic text-slate-600 border-l-2 border-slate-400 pl-4"
                            >
                                {renderInline(block.text)}
                            </p>
                        );

                    // ── Legal: Party definition (hereinafter) ──
                    case "party-def":
                        return (
                            <p
                                key={index}
                                className="mb-4 text-justify bg-slate-50 rounded px-4 py-2.5 border border-slate-200 text-sm leading-relaxed"
                            >
                                {renderInline(block.text)}
                            </p>
                        );

                    // ── Definition: "Term" means … ──
                    case "definition":
                        return (
                            <p
                                key={index}
                                className="mb-4 text-justify pl-4 border-l-2 border-blue-200"
                            >
                                {renderInline(block.text)}
                            </p>
                        );

                    // ── Sub-section numbering: 1.1, 2.3.1 ──
                    case "sub-section":
                        return (
                            <div
                                key={index}
                                className="mb-3 flex gap-3 text-justify ml-6"
                            >
                                <span className="text-slate-500 font-mono text-sm shrink-0 font-semibold tabular-nums">
                                    {block.nums}
                                </span>
                                <span>{renderInline(block.text)}</span>
                            </div>
                        );

                    // ── Signature block ──
                    case "signature":
                        return (
                            <div key={index} className="mt-8 mb-1">
                                <p className="font-mono text-sm text-slate-500">
                                    {renderInline(block.text)}
                                </p>
                            </div>
                        );

                    // ── Default paragraph ──
                    case "paragraph":
                        return (
                            <p
                                key={index}
                                className="mb-4 text-justify indent-8"
                            >
                                {renderInline(block.text)}
                            </p>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}
