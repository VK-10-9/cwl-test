"use client";

import { useState } from "react";
import type { Blueprint } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Button } from "@/components/ui/button";
import { Check, X, MessageSquareText, Wand2, ArrowLeft, Bot, ListTodo } from "lucide-react";
import Plan from "@/components/ui/agent-plan";
import BlueprintChat from "./BlueprintChat";

interface BlueprintReviewProps {
    blueprint: Blueprint;
    onToggleClause: (id: string) => void;
    onApprove: () => void;
    isLoading: boolean;
    setBlueprint: (blueprint: Blueprint) => void;
    onBack: () => void;
}

export default function BlueprintReview({ blueprint, onToggleClause, onApprove, isLoading, setBlueprint, onBack }: BlueprintReviewProps) {
    const [suggestedInput, setSuggestedInput] = useState<{ text: string; ts: number } | null>(null);
    const [activeTab, setActiveTab] = useState<'chat' | 'plan'>('chat');

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] gap-4 animate-fade-in w-full max-w-7xl mx-auto">
            {/* Top Toolbar / Header */}
            <div className="flex justify-between items-center bg-card/50 backdrop-blur-md p-4 rounded-xl border border-border shadow-sm shrink-0">
                <div className="flex items-center gap-4 text-left">
                    <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="text-primary">⚡</span> Blueprint Review
                        </h2>
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                            {(blueprint.clauses || []).filter(c => c.included).length} CLAUSES ACTIVE | MODE: EDIT
                        </p>
                    </div>
                </div>
                <LiquidButton disabled={isLoading} onClick={onApprove} size="sm" className="h-10 px-6">
                    {isLoading ? "COMPILING..." : "COMPILE FINAL DOC →"}
                </LiquidButton>
            </div>

            {/* Main IDE Workspace */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left Panel: Clause Explorer */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-10 scrollbar-hide">
                    <div className="grid grid-cols-1 gap-4">
                        {(blueprint.clauses || []).map((clause) => (
                            <Card
                                key={clause.id}
                                className={`transition-all duration-300 relative overflow-hidden group ${clause.included
                                    ? 'border-primary/20 bg-primary/5 hover:border-primary/40'
                                    : 'border-border/50 opacity-60 bg-muted/20 hover:opacity-80'
                                    }`}
                            >
                                {/* Background Gradient for Included items */}
                                {clause.included && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                                )}

                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 relative z-10 w-full">
                                    <div className="space-y-1 w-full pr-12">
                                        <CardTitle className="text-base font-mono flex items-center gap-2 flex-wrap">
                                            <span className="text-primary/70">#</span>
                                            <span className="mr-2">{clause.title}</span>

                                            {/* Risk Badges */}
                                            {clause.risk === 'high' && (
                                                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-none border border-red-500/30 bg-red-500/10 text-red-400 font-mono uppercase tracking-wider">
                                                    ERR: HIGH_RISK
                                                </span>
                                            )}
                                            {clause.risk === 'medium' && (
                                                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-none border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 font-mono uppercase tracking-wider">
                                                    WARN: MEDIUM
                                                </span>
                                            )}
                                            {clause.risk === 'low' && (
                                                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-none border border-green-500/30 bg-green-500/10 text-green-400 font-mono uppercase tracking-wider">
                                                    OK: VERIFIED
                                                </span>
                                            )}
                                        </CardTitle>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                            onClick={() => {
                                                setActiveTab('chat');
                                                setSuggestedInput({ text: `Why is the "${clause.title}" clause important here?`, ts: Date.now() });
                                            }}
                                            title="Discuss with AI"
                                        >
                                            <MessageSquareText className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                            onClick={() => {
                                                setActiveTab('chat');
                                                setSuggestedInput({ text: `Suggest a more favorable version of the "${clause.title}" clause.`, ts: Date.now() });
                                            }}
                                            title="Improve Clause"
                                        >
                                            <Wand2 className="h-4 w-4" />
                                        </Button>
                                        <div className="w-px h-4 bg-border/50 mx-1" />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onToggleClause(clause.id)}
                                            className={`h-8 w-8 p-0 rounded-none border ${clause.included
                                                ? 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30'
                                                : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80'
                                                }`}
                                        >
                                            {clause.included ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="relative z-10 pt-2">
                                    <p className="text-sm text-muted-foreground leading-relaxed font-mono opacity-80 pl-4 border-l-2 border-primary/10">
                                        {clause.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Right Panel: AI Agent & Plan */}
                <div className="w-[450px] flex-shrink-0 flex flex-col bg-card/30 rounded-xl border border-border/50 overflow-hidden shadow-xl backdrop-blur-sm">
                    {/* Tab Switcher */}
                    <div className="flex items-center p-1 bg-muted/40 border-b border-border/40 gap-1">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono font-medium rounded transition-all duration-200 ${activeTab === 'chat'
                                ? 'bg-background shadow-sm text-primary'
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                }`}
                        >
                            <Bot className="w-3.5 h-3.5" />
                            AGENT_CHAT
                        </button>
                        <button
                            onClick={() => setActiveTab('plan')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono font-medium rounded transition-all duration-200 ${activeTab === 'plan'
                                ? 'bg-background shadow-sm text-primary'
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                }`}
                        >
                            <ListTodo className="w-3.5 h-3.5" />
                            EXECUTION_PLAN
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        {activeTab === 'chat' ? (
                            <BlueprintChat
                                blueprint={blueprint}
                                onUpdateBlueprint={(newBlueprint: Blueprint) => setBlueprint(newBlueprint)}
                                embedded={true}
                                suggestedInput={suggestedInput}
                            />
                        ) : (
                            <div className="h-full w-full overflow-hidden flex flex-col">
                                <Plan />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
