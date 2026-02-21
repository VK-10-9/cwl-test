"use client";

import { useState, useMemo } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Card } from "@/components/ui/card";
import { Copy, Download, FileText, Check, ArrowLeft, FileDown, Type } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface DocumentEditorProps {
    fullText: string;
    onExport: (format: "pdf" | "docx") => void;
    isExporting: boolean;
    onBack?: () => void;
}

export default function DocumentEditor({ fullText, onExport, isExporting, onBack }: DocumentEditorProps) {
    const [copied, setCopied] = useState(false);

    const stats = useMemo(() => {
        const words = fullText.trim().split(/\s+/).filter(Boolean).length;
        const chars = fullText.length;
        // Rough page estimate: ~300 words per page for legal docs
        const pages = Math.max(1, Math.ceil(words / 300));
        return { words, chars, pages };
    }, [fullText]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            console.warn("Clipboard API unavailable");
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-4 animate-fade-in relative z-10">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 bg-card/60 backdrop-blur-md p-4 rounded-xl border border-border sticky top-24 z-20 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                        {onBack && (
                            <button onClick={onBack} className="p-2 hover:bg-muted rounded-full mr-1 transition-colors">
                                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                            </button>
                        )}
                        <div className="h-8 w-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                            <FileText className="text-primary w-4 h-4" />
                        </div>
                        <div>
                            <span className="font-semibold text-foreground text-sm">Final Document</span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-muted-foreground font-mono">{stats.words.toLocaleString()} words</span>
                                <span className="text-[10px] text-muted-foreground/40">|</span>
                                <span className="text-[10px] text-muted-foreground font-mono">~{stats.pages} page{stats.pages > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted rounded-md border border-border/50"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied" : "Copy"}
                        </button>

                        <div className="h-5 w-px bg-border/50 hidden sm:block" />

                        <LiquidButton
                            onClick={() => onExport("docx")}
                            disabled={isExporting}
                            size="sm"
                            variant="ghost"
                            className="text-white border-white/20 hover:bg-white/10 px-3 py-1.5 h-8 text-xs"
                        >
                            <FileDown className="w-3.5 h-3.5 mr-1.5" />
                            DOCX
                        </LiquidButton>
                        <LiquidButton
                            onClick={() => onExport("pdf")}
                            disabled={isExporting}
                            size="sm"
                            variant="ghost"
                            className="text-white border-white/20 hover:bg-white/10 px-3 py-1.5 h-8 text-xs"
                        >
                            <FileDown className="w-3.5 h-3.5 mr-1.5" />
                            PDF
                        </LiquidButton>
                    </div>
                </div>
            </div>

            {/* Document Surface */}
            <Card className="relative bg-white text-slate-900 shadow-2xl overflow-hidden border-0">
                {/* Top accent line */}
                <div className="h-1 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />

                <div className="p-10 md:p-16 min-h-[800px]">
                    <MarkdownRenderer content={fullText} />
                </div>

                {/* Bottom page indicator */}
                <div className="border-t border-slate-200 px-8 py-3 flex justify-between items-center bg-slate-50/80">
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                        <Type className="h-3 w-3" />
                        {stats.chars.toLocaleString()} characters
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                        Generated by DocuForge AI
                    </span>
                </div>
            </Card>

            <div className="h-12" />
        </div>
    );
}
