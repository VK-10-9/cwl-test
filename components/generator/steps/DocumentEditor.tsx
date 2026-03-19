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

    const handlePdfExport = async () => {
        try {
            // Dynamically import to avoid SSR issues with window/document
            const html2pdf = (await import('html2pdf.js')).default;
            const element = document.getElementById("clausewala-document-content");
            if (!element) return;

            const opt = {
                margin: 15,
                filename: 'clausewala-document.pdf',
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            };

            html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("Failed to generate PDF locally:", error);
            // Fallback to server export
            onExport("pdf");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4 animate-fade-in relative z-10">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 bg-background/80 backdrop-blur-xl p-3.5 rounded-xl border border-border/60 sticky top-20 z-20 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2.5">
                        {onBack && (
                            <button onClick={onBack} className="p-1.5 hover:bg-muted rounded-full mr-0.5 transition-colors">
                                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                            </button>
                        )}
                        <div className="h-7 w-7 rounded-md bg-foreground/[0.04] border border-border flex items-center justify-center">
                            <FileText className="text-foreground/70 w-3.5 h-3.5" />
                        </div>
                        <div>
                            <span className="font-medium text-foreground text-[13px] tracking-tight">Final Document</span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-muted-foreground/60 font-mono">{stats.words.toLocaleString()} words</span>
                                <span className="text-[10px] text-muted-foreground/20">|</span>
                                <span className="text-[10px] text-muted-foreground/60 font-mono">~{stats.pages} page{stats.pages > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted rounded-md border border-border"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied" : "Copy"}
                        </button>

                        <div className="h-5 w-px bg-border/50 hidden sm:block" />

                        <LiquidButton
                            onClick={() => onExport("docx")}
                            disabled={isExporting}
                            size="sm"
                            variant="ghost"
                            className="text-foreground border-border hover:bg-accent px-3 py-1.5 h-8 text-xs"
                        >
                            <FileDown className="w-3.5 h-3.5 mr-1.5" />
                            DOCX
                        </LiquidButton>
                        <LiquidButton
                            onClick={handlePdfExport}
                            disabled={isExporting}
                            size="sm"
                            variant="ghost"
                            className="text-foreground border-border hover:bg-accent px-3 py-1.5 h-8 text-xs"
                        >
                            <FileDown className="w-3.5 h-3.5 mr-1.5" />
                            PDF
                        </LiquidButton>
                    </div>
                </div>
            </div>

            {/* Document Surface */}
            <Card className="relative bg-white text-foreground shadow-sm overflow-hidden border border-border">
                {/* Top accent line */}
                <div className="h-px bg-border" />

                <div id="clausewala-document-content" className="p-8 md:p-14 min-h-[800px] bg-white text-black print-friendly-container">
                    <MarkdownRenderer content={fullText} />
                </div>

                {/* Bottom page indicator */}
                <div className="border-t border-border px-6 py-2.5 flex justify-between items-center bg-muted/30">
                    <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5">
                        <Type className="h-3 w-3" />
                        {stats.chars.toLocaleString()} characters
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 font-mono">
                        Generated by ClauseWala.
                    </span>
                </div>
            </Card>

            <div className="h-10" />

            {/* Print Styles for PDF generation */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .print-friendly-container h1, .print-friendly-container h2, .print-friendly-container h3 { color: #1F3864 !important; }
                .print-friendly-container p, .print-friendly-container li { font-size: 14pt !important; line-height: 1.6 !important; }
            `}} />
        </div>
    );
}
