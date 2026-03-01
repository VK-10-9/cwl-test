import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AVAILABLE_FORMS } from "@/lib/gfe/forms";
import Link from "next/link";
import { CopyPlus, ArrowRight, BookOpen, ShieldCheck } from "lucide-react";

export const metadata = {
    title: "Document Templates - ClauseWala",
    description: "Browse our expansive library of smart legal templates and official statutory forms.",
};

export default function TemplatesPage() {
    // We will show the first 12 as featured templates, and the rest down below or accessible via search.
    const featuredForms = AVAILABLE_FORMS.slice(0, 8);
    const standardForms = AVAILABLE_FORMS.slice(8, 24);

    return (
        <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                        <BookOpen className="w-4 h-4" />
                        <span>Central Form Repository</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading leading-tight tracking-tight mb-6">
                        Statutory Document <span className="text-emerald-500">Templates</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Select a form from our meticulously digitized library. ClauseWala's Government Forms Engine ensures strict compliance with official Gazette structures.
                    </p>
                </div>

                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
                        <h2 className="text-2xl font-serif text-foreground flexing items-center">
                            Featured Statutory Models
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredForms.map((form) => (
                            <Link
                                href="/gfe/editor"
                                key={form.id}
                                className="group relative bg-background/50 backdrop-blur-sm border border-border/60 hover:border-emerald-500/50 p-6 rounded-xl shadow-sm transition-all hover:shadow-emerald-500/5 overflow-hidden flex flex-col h-full"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <CopyPlus className="w-16 h-16 text-emerald-500 -mr-4 -mt-4" />
                                </div>
                                <div className="relative z-10 flex-1">
                                    <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>{form.formNumber}</span>
                                    </div>
                                    <h3 className="text-lg font-heading text-foreground mb-2 leading-snug group-hover:text-emerald-400 transition-colors">
                                        {form.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        Official template under {form.act}, {form.sectionReference}.
                                    </p>
                                </div>
                                <div className="relative z-10 mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-emerald-500">
                                    <span>Open in Editor</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
                        <h2 className="text-xl font-serif text-foreground/80 flexing items-center">
                            Standard Schedule Catalog
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {standardForms.map((form) => (
                            <Link
                                href="/gfe/editor"
                                key={form.id}
                                className="bg-background/30 border border-border/40 hover:bg-muted/30 p-4 rounded-lg transition-all group flex items-center justify-between"
                            >
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{form.formNumber}</span>
                                    <span className="text-sm font-medium text-foreground/80 truncate group-hover:text-foreground">{form.title}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <Link href="/gfe/editor" className="inline-flex items-center px-6 py-3 bg-muted hover:bg-muted/80 text-foreground text-sm font-semibold rounded-lg transition-colors border border-border">
                            Access Full Index (56 Forms) <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
