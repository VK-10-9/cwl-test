"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bot, Send, X, Loader2, MessageSquare, Sparkles,
    CheckCircle2, ArrowDownRight, Minimize2, Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DocumentType } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface ExtractedFields {
    [key: string]: string | number | boolean;
}

interface FormAssistantProps {
    docType: DocumentType;
    currentFormData: Record<string, string | number | boolean>;
    onApplyFields: (fields: ExtractedFields) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractJsonFields(text: string): ExtractedFields | null {
    // Match ```json { "fields": { ... } } ``` blocks
    const fencedMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
    if (fencedMatch) {
        try {
            const parsed = JSON.parse(fencedMatch[1]);
            if (parsed.fields && typeof parsed.fields === "object") {
                return parsed.fields as ExtractedFields;
            }
        } catch { /* ignore parse errors */ }
    }

    // Fallback: look for any { "fields": { ... } } pattern
    const inlineMatch = text.match(/\{\s*"fields"\s*:\s*(\{[\s\S]*?\})\s*\}/);
    if (inlineMatch) {
        try {
            return JSON.parse(inlineMatch[1]) as ExtractedFields;
        } catch { /* ignore */ }
    }

    return null;
}

function renderMessageContent(content: string, appliedFields: Set<string>, onApply: (fields: ExtractedFields) => void) {
    const parts: React.ReactNode[] = [];
    const jsonRegex = /```json\s*(\{[\s\S]*?\})\s*```/g;
    let lastIndex = 0;
    let match;
    let partIndex = 0;

    while ((match = jsonRegex.exec(content)) !== null) {
        // Text before the JSON block
        if (match.index > lastIndex) {
            const textBefore = content.slice(lastIndex, match.index).trim();
            if (textBefore) {
                parts.push(
                    <p key={`text-${partIndex++}`} className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {textBefore}
                    </p>
                );
            }
        }

        // Parse the JSON block
        let fields: ExtractedFields | null = null;
        try {
            const parsed = JSON.parse(match[1]);
            fields = parsed.fields || parsed;
        } catch { /* ignore */ }

        if (fields && Object.keys(fields).length > 0) {
            const fieldKey = Object.keys(fields).sort().join(",");
            const isApplied = appliedFields.has(fieldKey);

            parts.push(
                <div key={`json-${partIndex++}`} className="my-2 bg-primary/5 border border-primary/20 rounded-lg overflow-hidden">
                    <div className="px-3 py-2 border-b border-primary/10 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-primary uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3" />
                            Suggested Fields ({Object.keys(fields).length})
                        </span>
                        {isApplied ? (
                            <span className="text-[10px] font-mono text-green-400 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Applied
                            </span>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-[10px] font-mono text-primary hover:text-primary hover:bg-primary/10"
                                onClick={() => onApply(fields as ExtractedFields)}
                            >
                                <ArrowDownRight className="h-3 w-3 mr-1" />
                                Apply to Form
                            </Button>
                        )}
                    </div>
                    <div className="px-3 py-2 space-y-1">
                        {Object.entries(fields).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2 text-xs font-mono">
                                <span className="text-muted-foreground">{key}:</span>
                                <span className="text-foreground truncate">
                                    {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        lastIndex = match.index + match[0].length;
    }

    // Remaining text after last JSON block
    if (lastIndex < content.length) {
        const remaining = content.slice(lastIndex).trim();
        if (remaining) {
            parts.push(
                <p key={`text-${partIndex++}`} className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {remaining}
                </p>
            );
        }
    }

    // If no JSON blocks found, render entire content as text
    if (parts.length === 0) {
        parts.push(
            <p key="text-only" className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {content}
            </p>
        );
    }

    return parts;
}

// ─── Suggestion chips ────────────────────────────────────────────────────────

function getSuggestionChips(docType: DocumentType): string[] {
    const common = ["Help me fill this form", "What fields are required?"];
    const perType: Record<DocumentType, string[]> = {
        nda: ["NDA for my employee", "Mutual NDA between two companies", "NDA for a contractor"],
        mou: ["MOU for a joint venture", "Research collaboration MOU", "MOU with a government body"],
        "request-letter": ["Permission request letter", "Budget approval request", "Resource request letter"],
        "internship-cert": ["Certificate for a 6-month intern", "Summer internship certificate", "Help fill intern details"],
        "sponsorship-letter": ["Sponsorship request for tech event", "Gold tier sponsorship proposal", "Sponsorship confirmation letter"],
    };
    return [...(perType[docType] || []), ...common];
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function FormAssistant({ docType, currentFormData, onApplyFields }: FormAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [appliedFields, setAppliedFields] = useState<Set<string>>(new Set());

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    // Auto-scroll on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 200);
        }
    }, [isOpen]);

    const handleApplyFields = useCallback((fields: ExtractedFields) => {
        onApplyFields(fields);
        const key = Object.keys(fields).sort().join(",");
        setAppliedFields(prev => new Set([...prev, key]));
    }, [onApplyFields]);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isStreaming) return;

        const userMsg: Message = { id: `user-${Date.now()}`, role: "user", content: text.trim() };
        const assistantId = `assistant-${Date.now()}`;

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsStreaming(true);

        // Start with empty assistant message
        setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }]);

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const allMessages = [...messages, userMsg].map(m => ({
                role: m.role,
                content: m.content,
            }));

            const res = await fetch("/api/chat/form-assist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: allMessages,
                    documentType: docType,
                    currentFormData,
                }),
                signal: controller.signal,
            });

            if (!res.ok) throw new Error("Failed to get response");

            const reader = res.body?.getReader();
            if (!reader) throw new Error("No response body");

            const decoder = new TextDecoder();
            let fullContent = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                fullContent += chunk;

                setMessages(prev =>
                    prev.map(m => m.id === assistantId ? { ...m, content: fullContent } : m)
                );
            }

            // Auto-apply fields from the response
            const extracted = extractJsonFields(fullContent);
            if (extracted && Object.keys(extracted).length > 0) {
                handleApplyFields(extracted);
            }
        } catch (err) {
            if (err instanceof DOMException && err.name === "AbortError") return;
            console.error("Form assist error:", err);
            setMessages(prev =>
                prev.map(m => m.id === assistantId
                    ? { ...m, content: "Sorry, something went wrong. Please try again." }
                    : m
                )
            );
        } finally {
            setIsStreaming(false);
            abortRef.current = null;
        }
    }, [messages, isStreaming, docType, currentFormData, handleApplyFields]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleChipClick = (chip: string) => {
        sendMessage(chip);
    };

    if (!isOpen) {
        return (
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center group"
                title="AI Form Assistant"
            >
                <Bot className="h-6 w-6 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background animate-pulse" />
            </motion.button>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`fixed z-50 flex flex-col bg-card border border-border rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
                    isExpanded
                        ? "bottom-4 right-4 left-4 top-4 sm:left-auto sm:w-[600px] sm:top-4"
                        : "bottom-6 right-6 w-[380px] h-[520px]"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-border/50 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold font-mono">FORM ASSISTANT</h3>
                            <p className="text-[10px] text-muted-foreground font-mono">
                                {isStreaming ? "Thinking..." : "Describe your needs, I'll fill the form"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                            {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setIsOpen(false);
                                abortRef.current?.abort();
                            }}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-4">
                                <MessageSquare className="h-6 w-6 text-primary/60" />
                            </div>
                            <h4 className="text-sm font-bold font-mono mb-1">Hey! I can help fill this form.</h4>
                            <p className="text-xs text-muted-foreground font-mono mb-6 max-w-[280px]">
                                Tell me about your situation and I&apos;ll extract the right field values for you.
                            </p>

                            {/* Suggestion Chips */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                {getSuggestionChips(docType).map((chip) => (
                                    <button
                                        key={chip}
                                        onClick={() => handleChipClick(chip)}
                                        className="px-3 py-1.5 text-[11px] font-mono bg-muted/40 border border-border/50 rounded-full hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "assistant" && (
                                    <div className="h-6 w-6 rounded-md bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0 mt-1">
                                        <Bot className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                )}
                                <div className={`max-w-[85%] space-y-1 ${
                                    msg.role === "user"
                                        ? "bg-primary/10 border border-primary/20 rounded-xl rounded-br-sm px-3 py-2"
                                        : "bg-card/80 border border-border/40 rounded-xl rounded-bl-sm px-3 py-2"
                                }`}>
                                    {msg.role === "assistant" && msg.content ? (
                                        renderMessageContent(msg.content, appliedFields, handleApplyFields)
                                    ) : msg.role === "assistant" && !msg.content && isStreaming ? (
                                        <div className="flex items-center gap-2 py-1">
                                            <Loader2 className="h-3 w-3 animate-spin text-primary" />
                                            <span className="text-xs font-mono text-muted-foreground">Analyzing your input...</span>
                                        </div>
                                    ) : (
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input */}
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2 p-3 border-t border-border/50 bg-card/50 shrink-0"
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your document needs..."
                        disabled={isStreaming}
                        className="flex-1 bg-transparent text-sm font-mono outline-none placeholder:text-muted-foreground/50"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isStreaming}
                        className="h-8 w-8 rounded-lg shrink-0"
                    >
                        {isStreaming ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Send className="h-3.5 w-3.5" />
                        )}
                    </Button>
                </form>
            </motion.div>
        </AnimatePresence>
    );
}
