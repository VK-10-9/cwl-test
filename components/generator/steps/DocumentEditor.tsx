"use client";

import { useState } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Card } from "@/components/ui/card";
import { Copy, Download, FileText, Check, ArrowLeft } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface DocumentEditorProps {
    fullText: string;
    onExport: (format: "pdf" | "docx") => void;
    isExporting: boolean;
    onBack?: () => void;
}

export default function DocumentEditor({ fullText, onExport, isExporting, onBack }: DocumentEditorProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for non-HTTPS or permission-denied contexts
            console.warn("Clipboard API unavailable");
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in relative z-10">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card/60 backdrop-blur-md p-4 rounded-xl border border-border sticky top-24 z-20 shadow-lg">
                <div className="flex items-center gap-2">
                    {onBack && (
                        <button onClick={onBack} className="p-2 hover:bg-muted rounded-full mr-2 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                        </button>
                    )}
                    <FileText className="text-primary w-5 h-5" />
                    <span className="font-semibold text-foreground">Final Document Preview</span>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted rounded-md"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied" : "Copy"}
                    </button>

                    <LiquidButton
                        onClick={() => onExport("docx")}
                        disabled={isExporting}
                        className="text-white border-white/20 hover:bg-white/10 px-4 py-2 h-9 text-sm"
                        size={'sm'}
                        variant="ghost"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        DOCX
                    </LiquidButton>
                    <LiquidButton
                        onClick={() => onExport("pdf")}
                        disabled={isExporting}
                        className="text-white border-white/20 hover:bg-white/10 px-4 py-2 h-9 text-sm"
                        size={'sm'}
                        variant="ghost"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                    </LiquidButton>
                </div>
            </div>

            {/* Editor Surface */}
            <div className="relative bg-white text-slate-900 shadow-2xl p-12 md:p-16 min-h-[800px] rounded-sm mx-auto overflow-hidden">
                {/* Visual guideline */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />

                <div className="prose prose-slate max-w-none font-serif leading-loose whitespace-pre-wrap">
                    <MarkdownRenderer content={fullText} />
                </div>
            </div>

            <div className="h-20" />
        </div>
    );
}
