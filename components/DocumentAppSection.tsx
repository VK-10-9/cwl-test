"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DocumentSelector from "@/components/DocumentSelector";
import type { DocumentType } from "@/types";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function DocumentAppSection() {
    const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
    const router = useRouter();

    const handleSelect = (type: DocumentType) => {
        setSelectedType(type);
    };

    const handleContinue = () => {
        if (selectedType) {
            router.push(`/generate/${selectedType}`);
        }
    };

    return (
        <section id="documents" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-bold text-center text-white mb-8 tracking-tighter drop-shadow-xl">
                    Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Creating</span>
                </h2>
                <p className="text-slate-300 text-center max-w-2xl mx-auto mb-16 text-lg">
                    Select a template below to begin the generation process.
                </p>

                <div className="glass-card p-1 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
                    <div className="bg-black/40 rounded-[2.2rem] p-8 md:p-12 relative overflow-hidden">
                        {/* Subtle glow effect behind selector */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="relative z-10">
                            <DocumentSelector />

                            <div className={`mt-16 flex justify-center transition-all duration-500 transform ${selectedType ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                                <LiquidButton
                                    onClick={handleContinue}
                                    className="text-white border-white/20 hover:bg-white/10 px-10 py-6 text-xl shadow-xl shadow-indigo-500/20"
                                    size={'xl'}
                                    variant="ghost"
                                >
                                    Generate {selectedType ? selectedType.toUpperCase().replace('-', ' ') : 'Document'}
                                </LiquidButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
