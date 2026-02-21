"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import {
    MessageSquare, Send, X, Bot, User, Sparkles, Check,
    Terminal, Loader2, Brain, Wrench, Search, ChevronDown,
    ChevronRight, Zap,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import type { Blueprint, AgentMessageSection } from "@/types";
import { parseAgentResponse, parseStreamingState, type StreamingAgentState } from "@/lib/useAgentTasks";

// ─── Helper: extract text from UIMessage parts ──────────────────────────────

function getMessageText(message: UIMessage): string {
    return message.parts
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("");
}

// ─── Tool Icon Mapping ───────────────────────────────────────────────────────

function ToolIcon({ tool }: { tool: string }) {
    switch (tool) {
        case "risk-assessor":
            return <Zap className="h-3 w-3" />;
        case "legal-research":
            return <Search className="h-3 w-3" />;
        case "clause-analyzer":
        case "compliance-checker":
            return <Terminal className="h-3 w-3" />;
        default:
            return <Wrench className="h-3 w-3" />;
    }
}

// ─── Thinking Block ──────────────────────────────────────────────────────────

function ThinkingBlock({ content, isActive }: { content: string; isActive: boolean }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-muted/50 border border-border rounded-sm overflow-hidden"
        >
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-2 p-2 text-[10px] font-mono text-muted-foreground hover:bg-muted transition-colors"
            >
                <Brain className={`h-3 w-3 ${isActive ? "animate-pulse" : ""}`} />
                <span>{isActive ? "THINKING..." : "REASONING"}</span>
                {!isActive && (
                    expanded
                        ? <ChevronDown className="h-3 w-3 ml-auto" />
                        : <ChevronRight className="h-3 w-3 ml-auto" />
                )}
                {isActive && <Loader2 className="h-3 w-3 ml-auto animate-spin" />}
            </button>
            <AnimatePresence>
                {(expanded || isActive) && content && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-3 pb-2 text-[11px] font-mono text-muted-foreground leading-relaxed border-t border-border"
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Tool Call Block ─────────────────────────────────────────────────────────

function ToolCallBlock({ tool, input, isActive }: { tool: string; input: string; isActive: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 pl-2"
        >
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-sm text-[10px] font-mono border ${
                isActive
                    ? "bg-blue-50 text-blue-600 border-blue-200 animate-pulse"
                    : "bg-green-50 text-green-600 border-green-200"
            }`}>
                {isActive ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                <ToolIcon tool={tool} />
                <span className="font-semibold">{tool}</span>
            </div>
            {input && (
                <span className="text-[10px] font-mono text-muted-foreground/60 truncate max-w-[180px]">
                    {input}
                </span>
            )}
        </motion.div>
    );
}

// ─── Analysis Block ──────────────────────────────────────────────────────────

function AnalysisBlock({ content, isActive }: { content: string; isActive: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-muted/50 border border-border rounded-sm p-2"
        >
            <div className="flex items-center gap-2 text-[10px] font-mono text-primary mb-1">
                <Search className={`h-3 w-3 ${isActive ? "animate-pulse" : ""}`} />
                <span>{isActive ? "ANALYZING..." : "ANALYSIS"}</span>
                {isActive && <Loader2 className="h-3 w-3 ml-auto animate-spin" />}
            </div>
            {content && (
                <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                    {content}
                </p>
            )}
        </motion.div>
    );
}

// ─── Streaming Indicator ─────────────────────────────────────────────────────

function StreamingIndicator({ state }: { state: StreamingAgentState }) {
    return (
        <div className="flex flex-col gap-2 pl-8 pr-4">
            {/* Thinking in progress */}
            {state.isThinking && state.thinking && (
                <ThinkingBlock content={state.thinking} isActive={true} />
            )}

            {/* Completed tool calls */}
            {state.toolCalls.map((tc, i) => (
                <ToolCallBlock key={i} tool={tc.tool} input={tc.input} isActive={false} />
            ))}

            {/* Active tool calls */}
            {state.activeTools.map((tool) => (
                <ToolCallBlock key={tool} tool={tool} input="Processing..." isActive={true} />
            ))}

            {/* Analysis in progress */}
            {state.isAnalyzing && state.analysis && (
                <AnalysisBlock content={state.analysis} isActive={true} />
            )}

            {/* Generic loading if nothing structured yet */}
            {!state.isThinking && !state.isAnalyzing && state.toolCalls.length === 0 && state.activeTools.length === 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    <span className="animate-pulse">Initializing agent...</span>
                </div>
            )}
        </div>
    );
}

// ─── Parsed Message Renderer ─────────────────────────────────────────────────
// Renders a completed AI message with its structured sections

function AgentMessage({ sections }: { sections: AgentMessageSection[] }) {
    if (sections.length === 0) return null;

    return (
        <div className="space-y-2">
            {sections.map((section, i) => {
                switch (section.type) {
                    case "thinking":
                        return <ThinkingBlock key={i} content={section.content} isActive={false} />;
                    case "tool_call":
                        return <ToolCallBlock key={i} tool={section.tool} input={section.input} isActive={false} />;
                    case "analysis":
                        return <AnalysisBlock key={i} content={section.content} isActive={false} />;
                    case "blueprint_update":
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2 text-xs font-mono"
                            >
                                <span className="flex items-center gap-1.5 bg-green-50 text-green-600 border border-green-200 px-2 py-1 rounded-sm">
                                    <Check className="w-3 h-3" />
                                    Blueprint updated
                                </span>
                                <span className="text-muted-foreground/60">{section.message}</span>
                            </motion.div>
                        );
                    case "text":
                        return (
                            <p key={i} className="text-xs font-mono text-muted-foreground leading-relaxed">
                                {section.content}
                            </p>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
}

// ─── Chat Interface ──────────────────────────────────────────────────────────

interface ChatInterfaceProps {
    messages: UIMessage[];
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    setInput: (value: string) => void;
    isLoading: boolean;
    error?: Error;
    inputRef: React.Ref<HTMLInputElement>;
    embedded?: boolean;
    onClose?: () => void;
    streamingState: StreamingAgentState;
}

function ChatInterface({
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    isLoading,
    error,
    inputRef,
    embedded,
    onClose,
    streamingState,
}: ChatInterfaceProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading, streamingState]);

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-sm bg-primary/20 flex items-center justify-center border border-primary/20">
                        <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-mono text-xs font-bold text-primary tracking-wider">DOCUFORGE_AGENT</h3>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                            <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? "bg-blue-500 animate-pulse" : "bg-green-500"}`} />
                            {isLoading ? "PROCESSING" : "READY"}
                        </p>
                    </div>
                </div>
                {!embedded && onClose && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                    {/* Welcome Message */}
                    {messages.length === 0 && (
                        <div className="bg-muted/10 rounded-sm p-4 text-xs font-mono text-muted-foreground border border-dashed border-border/40">
                            <p className="font-bold text-foreground mb-2 flex items-center gap-2">
                                <Zap className="h-3 w-3 text-primary" />
                                AGENT READY
                            </p>
                            <p className="mb-3 text-muted-foreground/80">
                                I&apos;m your legal document assistant. I analyze, assess risk, and draft — step by step.
                            </p>
                            <div className="space-y-1.5">
                                <p className="text-primary/80 text-[10px] flex items-center gap-1.5">
                                    <Wrench className="h-2.5 w-2.5" /> AVAILABLE TOOLS:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {["clause-analyzer", "risk-assessor", "legal-research", "compliance-checker", "clause-drafter", "plain-english-translator"].map((tool) => (
                                        <span key={tool} className="bg-primary/10 text-primary/70 px-1.5 py-0.5 rounded text-[9px] font-mono border border-primary/20">
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rendered Messages */}
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`flex items-start gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                        >
                            <div
                                className={`h-6 w-6 rounded-sm flex items-center justify-center flex-shrink-0 ${
                                    m.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground border border-border/50"
                                }`}
                            >
                                {m.role === "user" ? <User className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                            </div>
                            <div
                                className={`rounded-sm p-3 text-xs font-mono max-w-[85%] ${
                                    m.role === "user"
                                        ? "bg-primary/20 text-primary-foreground border border-primary/20"
                                        : "bg-muted/10 border border-border/30 text-muted-foreground"
                                }`}
                            >
                                {(() => {
                                    if (m.role === "user") {
                                        return getMessageText(m) || "...";
                                    }
                                    // Parse assistant message for structured sections
                                    const text = getMessageText(m);
                                    const sections = parseAgentResponse(text);
                                    if (sections.length > 0) {
                                        return <AgentMessage sections={sections} />;
                                    }
                                    return text || "...";
                                })()}
                            </div>
                        </div>
                    ))}

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-sm p-3 text-xs font-mono text-red-600">
                            <span className="font-bold">ERR:</span> {error.message || "Something went wrong. Please try again."}
                        </div>
                    )}

                    {/* Streaming Agentic UI */}
                    {isLoading && messages.length > 0 && (
                        <StreamingIndicator state={streamingState} />
                    )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-2 border-t border-border/40 bg-muted/20 shrink-0">
                <div className="relative flex items-center gap-2">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs pointer-events-none">
                        &gt;
                    </div>
                    <Input
                        ref={inputRef}
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask about clauses, risks, or request changes..."
                        className="pl-6 pr-10 bg-secondary border-border focus:border-primary/50 font-mono text-xs h-9 rounded-sm"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input?.trim()}
                        className="absolute right-1 top-1 h-7 w-7 rounded-sm"
                    >
                        <Send className="h-3 w-3" />
                    </Button>
                </div>
            </form>
        </div>
    );
}

// ─── Main BlueprintChat Component ────────────────────────────────────────────

interface BlueprintChatProps {
    blueprint: Blueprint;
    onUpdateBlueprint: (updatedBlueprint: Blueprint) => void;
    embedded?: boolean;
    suggestedInput?: { text: string; ts: number } | null;
    onStreamingStateChange?: (state: StreamingAgentState) => void;
}

export default function BlueprintChat({
    blueprint,
    onUpdateBlueprint,
    embedded = false,
    suggestedInput,
    onStreamingStateChange,
}: BlueprintChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const accumulatedTextRef = useRef("");

    // Current streaming state for agentic UI
    const [streamingState, setStreamingState] = useState<StreamingAgentState>({
        thinking: null,
        toolCalls: [],
        analysis: null,
        isThinking: false,
        isAnalyzing: false,
        activeTools: [],
    });

    // Use a ref to always have the latest blueprint in callbacks
    const blueprintRef = useRef(blueprint);
    useEffect(() => {
        blueprintRef.current = blueprint;
    }, [blueprint]);

    // Initialize useChat hook with the v3 API
    const { messages, sendMessage, status, error } = useChat({
        transport: new TextStreamChatTransport({
            api: "/api/chat/blueprint",
            body: () => ({
                currentBlueprint: blueprintRef.current,
                documentType: blueprintRef.current.documentType,
            }),
            prepareSendMessagesRequest: ({ messages: chatMessages, body: extraBody }) => ({
                body: {
                    messages: chatMessages.map((m) => ({
                        role: m.role,
                        content: getMessageText(m),
                    })),
                    ...((extraBody ?? {}) as Record<string, unknown>),
                },
            }),
        }),
        onFinish: ({ message }) => {
            // Reset streaming state
            accumulatedTextRef.current = "";
            setStreamingState({
                thinking: null,
                toolCalls: [],
                analysis: null,
                isThinking: false,
                isAnalyzing: false,
                activeTools: [],
            });
            onStreamingStateChange?.({
                thinking: null,
                toolCalls: [],
                analysis: null,
                isThinking: false,
                isAnalyzing: false,
                activeTools: [],
            });

            // Process response for blueprint updates
            try {
                const text = getMessageText(message);
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const data = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
                    if (data.clauses && Array.isArray(data.clauses)) {
                        onUpdateBlueprint({
                            ...blueprintRef.current,
                            clauses: data.clauses as Blueprint["clauses"],
                        });
                    }
                }
            } catch (parseErr) {
                console.error("Failed to parse blueprint update from response", parseErr);
            }
        },
    });

    // Track loading state
    const isLoading = status === "submitted" || status === "streaming";

    // Track streaming text to parse structured sections in real time
    useEffect(() => {
        if (!isLoading) return;

        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
            const currentText = getMessageText(lastMsg);
            if (currentText !== accumulatedTextRef.current) {
                accumulatedTextRef.current = currentText;
                const newState = parseStreamingState(currentText);
                setStreamingState(newState);
                onStreamingStateChange?.(newState);
            }
        }
    }, [messages, isLoading, onStreamingStateChange]);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    // Handle form submission
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const messageContent = input;
        setInput("");
        accumulatedTextRef.current = "";

        await sendMessage({ text: messageContent });
    }, [input, isLoading, sendMessage]);

    // React to suggested input changes
    useEffect(() => {
        if (suggestedInput?.text) {
            setInput(suggestedInput.text);
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    }, [suggestedInput]);

    const chatProps = {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        setInput,
        isLoading,
        error,
        inputRef,
        embedded,
        onClose: () => setIsOpen(false),
        streamingState,
    };

    if (embedded) {
        return <ChatInterface {...chatProps} />;
    }

    return (
        <>
            {/* Floating Chat Button */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="lg"
                    className={`rounded-full h-14 w-14 shadow-xl transition-all duration-300 ${
                        isOpen ? "bg-destructive hover:bg-destructive/90 rotate-90" : "bg-primary hover:bg-primary/90"
                    }`}
                >
                    {isOpen ? <X className="h-6 w-6 text-primary-foreground" /> : <MessageSquare className="h-6 w-6 text-primary-foreground" />}
                </Button>
            </motion.div>

            {/* Floating Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-card border border-border rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden"
                    >
                        <ChatInterface {...chatProps} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
