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
        <section id="documents" className="relative z-10 py-24 md:py-32 px-6 sm:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Choose a Contract</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
                        What do you need drafted?
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto mt-4 text-[15px] leading-relaxed">
                        Pick a document type. ClauseWala auto-selects the right clauses, governing laws, and formatting for Indian jurisdiction.
                    </p>
                </div>

                <DocumentSelector />

                <div className={`mt-10 flex justify-center transition-all duration-500 transform ${selectedType ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <LiquidButton
                        onClick={handleContinue}
                        className="text-primary-foreground bg-primary hover:bg-primary/90 px-8 py-4 text-[15px] font-medium"
                        size={'xl'}
                        variant="default"
                    >
                        Generate {selectedType ? selectedType.toUpperCase().replace('-', ' ') : 'Document'} &rarr;
                    </LiquidButton>
                </div>
            </div>
        </section>
    );
}
