"use client";

import { useChat, type Message } from "@ai-sdk/react";
import { MessageSquare, Send, X, Bot, User, Sparkles, Check, Terminal, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { Blueprint } from "@/types";

// --- Extracted Chat Interface Component ---
interface ChatInterfaceProps {
    messages: Message[];
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    setInput: (value: string) => void;
    isLoading: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    embedded?: boolean;
    onClose?: () => void;
}

function ChatInterface({
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    isLoading,
    inputRef,
    embedded,
    onClose
}: ChatInterfaceProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-sm bg-primary/20 flex items-center justify-center border border-primary/20">
                        <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-mono text-xs font-bold text-primary tracking-wider">AI_AGENT_V3</h3>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            ACTIVE
                        </p>
                    </div>
                </div>
                {/* Close for floating only */}
                {!embedded && onClose && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-black/20" ref={scrollRef}>
                <div className="space-y-4">
                    {/* Welcome Message */}
                    {messages.length === 0 && (
                        <div className="bg-muted/10 rounded-sm p-4 text-xs font-mono text-muted-foreground border border-dashed border-border/40">
                            <p className="font-bold text-foreground mb-2">&gt; AGENT_READY</p>
                            <p className="mb-2">I am ready to analyze your blueprint.</p>
                            <p className="mt-2 text-primary/80">Capabilities:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1 opacity-70">
                                <li>Risk Assessment</li>
                                <li>Clause Modernization</li>
                                <li>Plain English Explanation</li>
                                <li>Legal Drafting</li>
                            </ul>
                        </div>
                    )}

                    {messages.map((m: Message) => (
                        <div
                            key={m.id}
                            className={`flex items-start gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"
                                }`}
                        >
                            <div
                                className={`h-6 w-6 rounded-sm flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border border-border/50"
                                    }`}
                            >
                                {m.role === "user" ? <User className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                            </div>
                            <div
                                className={`rounded-sm p-3 text-xs font-mono max-w-[85%] ${m.role === "user"
                                    ? "bg-primary/20 text-primary-foreground border border-primary/20"
                                    : "bg-muted/10 border border-border/30 text-muted-foreground"
                                    }`}
                            >
                                {m.role !== 'user' && typeof m.content === 'string' && m.content.startsWith('{') ? (
                                    <span className="italic opacity-70 flex items-center gap-2">
                                        <Check className="w-3 h-3 text-green-500" />
                                        Blueprint updated.
                                    </span>
                                ) : (
                                    (typeof m.content === 'string' ? m.content : JSON.stringify(m.content)) || "..."
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-3 text-xs font-mono text-red-400">
                            <span className="font-bold">ERR:</span> {error.message || "Something went wrong. Please try again."}
                        </div>
                    )}

                    {/* Agentic Thinking UI */}
                    {isLoading && messages.length > 0 && (
                        <div className="flex flex-col gap-2 pl-8 pr-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                <span className="animate-pulse">Processing request...</span>
                            </div>
                            <div className="bg-black/40 rounded-sm p-2 border-l-2 border-primary/30">
                                <div className="flex items-center gap-2 text-[10px] text-primary/70 font-mono mb-1">
                                    <Terminal className="w-3 h-3" />
                                    <span>AGENT_LOGS</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="h-1.5 w-2/3 bg-muted/20 rounded animate-pulse" />
                                    <div className="h-1.5 w-1/2 bg-muted/20 rounded animate-pulse delay-75" />
                                    <div className="h-1.5 w-3/4 bg-muted/20 rounded animate-pulse delay-150" />
                                </div>
                            </div>
                        </div>
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
                        placeholder="Type command..."
                        className="pl-6 pr-10 bg-background/50 border-white/5 focus:border-primary/50 font-mono text-xs h-9 rounded-sm"
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

// --- Main BlueprintChat Component ---

interface BlueprintChatProps {
    blueprint: Blueprint;
    onUpdateBlueprint: (updatedBlueprint: Blueprint) => void;
    embedded?: boolean;
    suggestedInput?: { text: string; ts: number } | null;
}

export default function BlueprintChat({ blueprint, onUpdateBlueprint, embedded = false, suggestedInput }: BlueprintChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize useChat hook with the new SDK v3 API
    const { messages, sendMessage, status, error } = useChat({
        api: "/api/chat/blueprint",
        body: {
            currentBlueprint: blueprint,
        },
    });

    // Track loading state based on status
    const isLoading = status === 'submitted' || status === 'streaming';

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const messageContent = input;
        setInput(""); // Clear input immediately for better UX

        // Send the message
        const response = await sendMessage(messageContent);

        // Process response for blueprint updates
        try {
            if (response?.content) {
                const content = typeof response.content === 'string'
                    ? response.content
                    : JSON.stringify(response.content);

                // Look for JSON block in the response
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const data = JSON.parse(jsonMatch[0]);
                    if (data.clauses) {
                        onUpdateBlueprint(data as Blueprint);
                    }
                }
            }
        } catch (parseErr) {
            console.error("Failed to parse blueprint update", parseErr);
        }
    };

    // React to suggested input changes from parent
    useEffect(() => {
        if (suggestedInput?.text) {
            setInput(suggestedInput.text);
            // Auto-focus
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
        inputRef,
        embedded,
        onClose: () => setIsOpen(false)
    };

    if (embedded) {
        return <ChatInterface {...chatProps} />;
    }

    return (
        <>
            {/* Floating Chat Button (IDE Style) */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="lg"
                    className={`rounded-full h-14 w-14 shadow-xl transition-all duration-300 ${isOpen ? "bg-destructive hover:bg-destructive/90 rotate-90" : "bg-primary hover:bg-primary/90"
                        }`}
                >
                    {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageSquare className="h-6 w-6 text-white" />}
                </Button>
            </motion.div>

            {/* Chat Interface Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden ring-1 ring-white/10"
                    >
                        <ChatInterface {...chatProps} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
