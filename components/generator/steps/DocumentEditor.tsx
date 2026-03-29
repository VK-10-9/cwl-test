"use client";

import { useState, useMemo } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Card } from "@/components/ui/card";
import { Copy, Download, FileText, Check, ArrowLeft, FileDown, Type } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { AnimatePresence, motion } from "framer-motion";
import { LanguageSelector } from "@/components/LanguageSelector";
import LegalDisclaimerModal from "@/components/legal/LegalDisclaimerModal";
import NextStepsGuide from "@/components/generator/NextStepsGuide";
import ESignModal from "@/components/legal/ESignModal";
import { ShieldCheck, Fingerprint } from "lucide-react";

interface DocumentEditorProps {
    fullText: string;
    onExport: (format: "pdf" | "docx", watermark?: boolean, skipDownload?: boolean, targetLanguage?: string, consentGiven?: boolean) => void;
    isExporting: boolean;
    onBack?: () => void;
    documentType: string;
    docSlug: string;
    formData?: Record<string, string | number | boolean>;
    onSign?: (signatureId: string) => void;
}

export default function DocumentEditor({ fullText, onExport, isExporting, onBack, documentType, docSlug, formData, onSign }: DocumentEditorProps) {
    const [copied, setCopied] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [exportFormat, setExportFormat] = useState<"pdf" | "docx" | null>(null);
    const [consentChecked, setConsentChecked] = useState(false);
    const [includeWatermark, setIncludeWatermark] = useState(false);
    const [targetLanguage, setTargetLanguage] = useState("en");
    const [showEsign, setShowEsign] = useState(false);
    const [signatureId, setSignatureId] = useState<string | null>(null);

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

            // Add the disclaimer footer for PDF rendering dynamically
            const footer = document.createElement("div");
            footer.innerHTML = '<p style="margin-top: 30px; font-size: 8pt; color: #999; text-align: center; border-top: 0.5pt solid #ddd; padding-top: 10px; font-style: italic;">Legal Disclaimer: This document is an AI-generated draft provided by ClauseWala and does not constitute final legal advice or a substitute for professional legal review. Users are advised to seek independent review by a qualified Indian advocate before formal execution. ClauseWala assumes no liability for errors or omissions.</p>';
            element.appendChild(footer);

            const watermarkDiv = document.createElement("div");
            if (includeWatermark) {
                watermarkDiv.className = "watermark-print";
                watermarkDiv.innerText = "CONFIDENTIAL";
                element.appendChild(watermarkDiv);
            }

            const opt = {
                margin: 15,
                filename: 'clausewala-document.pdf',
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
            };

            await html2pdf().set(opt).from(element).save();
            
            // Clean up the footer and watermark
            if (element.contains(footer)) {
                element.removeChild(footer);
            }
            if (includeWatermark && element.contains(watermarkDiv)) {
                element.removeChild(watermarkDiv);
            }
        } catch (error) {
            console.error("Failed to generate PDF locally:", error);
            // Fallback to server export
            onExport("pdf", includeWatermark, false);
        }
    };

    const handleExportClick = (format: "pdf" | "docx") => {
        setExportFormat(format);
        setShowDisclaimer(true);
        setConsentChecked(false);
    };

    const confirmExport = () => {
        if (!exportFormat) return;
        
        setShowDisclaimer(false);
        if (exportFormat === "pdf") {
            if (targetLanguage === "en") {
                handlePdfExport();
                onExport("pdf", includeWatermark, true, targetLanguage, true); // Log DB remotely but skip server response download
            } else {
                onExport("pdf", includeWatermark, false, targetLanguage, true); // Allow server fallback for translation
            }
        } else {
            onExport("docx", includeWatermark, false, targetLanguage, true);
        }
    };

    const handleESignSuccess = (sigId: string) => {
        setSignatureId(sigId);
        setShowEsign(false);
        if (onSign) onSign(sigId);
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

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="hidden sm:block">
                            <LanguageSelector value={targetLanguage} onChange={setTargetLanguage} />
                        </div>
                        <div className="h-8 w-px bg-border/50 hidden sm:block" />
                        <label className="flex items-center gap-2 text-xs text-muted-foreground mr-2 group cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={includeWatermark} 
                                onChange={(e) => setIncludeWatermark(e.target.checked)} 
                                className="w-3.5 h-3.5 rounded border-border text-foreground focus:ring-foreground accent-foreground mt-0.5"
                            />
                            <span className="group-hover:text-foreground transition-colors leading-tight min-w-[130px]">Add 'Confidential' Watermark</span>
                        </label>

                        <button
                            onClick={handleCopy}
                            title="Copy text"
                            className="flex items-center justify-center p-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted rounded-md border border-border h-8 w-8"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>

                        <div className="h-5 w-px bg-border/50 hidden sm:block" />

                        <LiquidButton
                            onClick={() => handleExportClick("docx")}
                            disabled={isExporting}
                            size="sm"
                            variant="ghost"
                            className="text-foreground border-border hover:bg-accent px-3 py-1.5 h-8 text-xs"
                        >
                            <FileDown className="w-3.5 h-3.5 mr-1.5" />
                            DOCX
                        </LiquidButton>
                        <LiquidButton
                            onClick={() => handleExportClick("pdf")}
                            disabled={isExporting}
                            size="sm"
                            variant="ghost"
                            className="text-foreground border-border hover:bg-accent px-3 py-1.5 h-8 text-xs"
                        >
                            <FileDown className="w-3.5 h-3.5 mr-1.5" />
                            PDF
                        </LiquidButton>

                        <div className="h-5 w-px bg-border/50" />

                        <LiquidButton
                            onClick={() => setShowEsign(true)}
                            disabled={isExporting || !!signatureId}
                            size="sm"
                            variant="default"
                            className={`h-8 text-xs px-4 gap-2 border-none transition-all duration-500 ${
                                signatureId 
                                    ? "bg-primary/20 text-primary border border-primary/20 cursor-default" 
                                    : "bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(74,222,128,0.2)]"
                            }`}
                        >
                            {signatureId ? <ShieldCheck className="w-3.5 h-3.5" /> : <Fingerprint className="w-3.5 h-3.5" />}
                            {signatureId ? "Document Signed" : "E-Sign"}
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
                    <div className="flex items-center gap-4">
                        {signatureId && (
                            <span className="text-[10px] text-primary/80 font-mono flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/5 border border-primary/10 animate-pulse">
                                <ShieldCheck className="h-3 w-3" />
                                Verified Singature ID: {signatureId}
                            </span>
                        )}
                        <span className="text-[10px] text-muted-foreground/60 font-mono">
                            Generated by ClauseWala.
                        </span>
                    </div>
                </div>
            </Card>

            {/* Specialized Next Steps for Specific Tracks */}
            <NextStepsGuide 
                docType={docSlug} 
                state={formData?.state as string} 
            />

            <div className="h-10" />

            {/* Print Styles for PDF generation */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .print-friendly-container h1, .print-friendly-container h2, .print-friendly-container h3 { color: #1F3864 !important; }
                .print-friendly-container p, .print-friendly-container li { font-size: 14pt !important; line-height: 1.6 !important; }
                .watermark-print { position: absolute; top: 40%; left: 10%; transform: rotate(-45deg); font-size: 80pt; color: rgba(200, 200, 200, 0.2); z-index: 0; pointer-events: none; }
            `}} />

            <LegalDisclaimerModal 
                isOpen={showDisclaimer}
                onClose={() => setShowDisclaimer(false)}
                onConfirm={confirmExport}
                documentType={documentType}
            />

            <ESignModal 
                isOpen={showEsign}
                onClose={() => setShowEsign(false)}
                onSuccess={handleESignSuccess}
                documentTitle={documentType || "Legal Document"}
            />
        </div>
    );
}
