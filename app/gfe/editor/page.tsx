"use client";

import React, { useState, useRef, useEffect } from "react";
import { AVAILABLE_FORMS } from "@/lib/gfe/forms";
import { LegalGuardrails } from "@/components/gfe/LegalGuardrails";
import { DynamicFormRenderer } from "@/components/gfe/DynamicFormRenderer";
import { PdfReplicaGenerator } from "@/components/gfe/PdfGenerator";
import { Printer, ArrowLeft, ShieldCheck, FileText, ChevronDown, Search } from "lucide-react";
import Link from "next/link";

export default function GfeEnginePage() {
    const [selectedFormId, setSelectedFormId] = useState(AVAILABLE_FORMS[0].id);
    const [searchQuery, setSearchQuery] = useState("");
    const [formData, setFormData] = useState<Record<string, any> | null>(null);
    const pdfRef = useRef<HTMLDivElement>(null);

    const checkFormDef = AVAILABLE_FORMS.find(f => f.id === selectedFormId) || AVAILABLE_FORMS[0];

    const filteredForms = AVAILABLE_FORMS.filter(form =>
        form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.formNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Reset form data when the form changes
    useEffect(() => {
        setFormData(null);
    }, [selectedFormId]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative pb-24 selection:bg-primary/30">
            {/* HEADER */}
            <header className="bg-background/80 backdrop-blur-xl border-b border-border/60 px-6 py-4 sticky top-0 z-[60] print:hidden shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="text-slate-400 hover:text-white transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                                Government Forms Engine
                            </h1>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">
                                CLAUSEWALA COMPLIANCE INFRASTRUCTURE
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-foreground/80 bg-foreground/5 px-3 py-1.5 rounded border border-border/50">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-bold tracking-widest uppercase">Immutable Base</span>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                {/* LEFT COLUMN: EDITOR */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 print:hidden h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pr-2 pb-10 flex flex-col">

                    {/* FORM SELECTOR */}
                    <div className="bg-background/80 backdrop-blur-xl p-6 rounded-xl shadow-sm border border-border/60 relative overflow-hidden flex flex-col h-[350px] shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4 relative z-10 shrink-0">
                            Statutory Form Catalog
                        </label>

                        <div className="relative z-10 mb-5 shrink-0">
                            <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground opacity-70" />
                            <input
                                type="text"
                                placeholder="Search Second Schedule..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-background/50 border border-border/80 text-foreground py-2.5 pl-10 pr-4 text-sm rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-muted-foreground"
                            />
                        </div>

                        <div className="relative z-10 flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar -mr-2">
                            {filteredForms.length > 0 ? (
                                <div className="space-y-1 mt-2">
                                    {filteredForms.map((form) => (
                                        <button
                                            key={form.id}
                                            onClick={() => setSelectedFormId(form.id)}
                                            className={`w-full text-left px-3 py-2.5 rounded text-[13px] transition-all focus:outline-none flex flex-col ${selectedFormId === form.id ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'hover:bg-muted/50 border border-transparent text-foreground/80 hover:text-foreground'}`}
                                        >
                                            <span className="font-mono text-[10px] opacity-70 mb-0.5">{form.formNumber}</span>
                                            <span className="font-medium truncate">{form.title}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground text-sm mt-10">
                                    No forms found matching your search.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-background/80 backdrop-blur-xl p-6 md:p-8 rounded-xl shadow-sm border border-emerald-500/20 relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0"></div>
                        <div className="mb-8 pb-6 border-b border-border/50 relative z-10">
                            <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-muted/50 text-foreground border border-border/80 text-[10px] uppercase tracking-widest font-bold rounded mb-4">
                                <FileText className="w-3.5 h-3.5 opacity-70" />
                                <span>{checkFormDef.formNumber}</span>
                            </div>
                            <h2 className="text-2xl font-serif text-foreground leading-snug tracking-tight mb-2">
                                {checkFormDef.title}
                            </h2>
                            <p className="text-muted-foreground text-xs uppercase tracking-widest flex items-center">
                                <span className="opacity-70">{checkFormDef.act}</span>
                                <span className="mx-2 opacity-30">•</span>
                                <span className="text-foreground/70 font-semibold">{checkFormDef.sectionReference}</span>
                            </p>
                        </div>

                        <LegalGuardrails guardrails={checkFormDef.guardrails} />

                        <div className="border-t border-border/40 pt-7 relative z-10">
                            <h3 className="text-[13px] font-bold uppercase tracking-widest mb-6 text-foreground/80 flex items-center">
                                <div className="bg-background border border-border w-7 h-7 rounded flex items-center justify-center mr-3 shadow-sm">
                                    <FileText className="w-3.5 h-3.5 opacity-70" />
                                </div>
                                Context Extraction Parameters
                            </h3>
                            {/* Key prop forces re-mount of React Hook Form DefaultValues when switching forms */}
                            <DynamicFormRenderer
                                key={checkFormDef.id}
                                formDef={checkFormDef}
                                onSubmit={(data) => setFormData(data)}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: PREVIEW/OUTPUT */}
                <div className="lg:col-span-8">
                    <div className="bg-[#0a0a0a]/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-border/20 min-h-[calc(100vh-8rem)] flex flex-col">
                        <div className="flex items-center justify-between mb-4 print:hidden px-1">
                            <h3 className="text-[13px] font-bold uppercase tracking-widest text-foreground/80 flex items-center">
                                <FileTextIcon className="w-4 h-4 mr-2 opacity-70" />
                                Live Replica Preview
                            </h3>

                            {formData && (
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handlePrint}
                                        className="flex items-center px-4 py-2 bg-foreground text-background text-xs uppercase tracking-wider font-bold rounded hover:bg-foreground/90 transition shadow-sm border border-transparent"
                                    >
                                        <Printer className="w-3.5 h-3.5 mr-2" />
                                        Print / Save PDF
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-2xl border border-border/30 overflow-hidden print:border-none print:shadow-none print:bg-transparent flex-1 flex flex-col">
                            <div className="bg-[#111111] border-b border-white/5 px-4 py-2.5 flex items-center print:hidden">
                                <div className="flex space-x-2 mr-4 opacity-50">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                </div>
                                <div className="text-xs text-white/40 font-mono text-center flex-1 pr-10">
                                    {checkFormDef.id}.pdf
                                </div>
                            </div>

                            <div className="p-4 md:p-8 overflow-auto max-h-[800px] print:max-h-none print:p-0 bg-[#0f0f0f] print:bg-transparent flex justify-center">
                                {/* PDF Container - Scaled down for preview */}
                                <div className="transform scale-[0.6] sm:scale-[0.8] md:scale-100 origin-top print:scale-100 transition-transform">
                                    <PdfReplicaGenerator
                                        ref={pdfRef}
                                        formDef={checkFormDef}
                                        data={formData || {}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main >

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-section, .print-section * {
                        visibility: visible;
                    }
                    .print-section {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        box-shadow: none;
                        border: none;
                    }
                    @page {
                        size: A4;
                        margin: 20mm;
                    }
                }
            `}} />
        </div >
    );
}

function FileTextIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
    );
}
