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
                <h2 className="text-4xl md:text-6xl font-bold text-center text-foreground mb-8 tracking-tighter">
                    Start <span className="text-primary">Creating</span>
                </h2>
                <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16 text-lg">
                    Select a template below to begin the generation process.
                </p>

                <div className="bg-card rounded-2xl border border-border p-8 md:p-12">
                    <div className="relative z-10">
                        <DocumentSelector />

                        <div className={`mt-16 flex justify-center transition-all duration-500 transform ${selectedType ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                            <LiquidButton
                                onClick={handleContinue}
                                className="text-primary-foreground bg-primary hover:bg-primary/90 px-10 py-6 text-xl"
                                size={'xl'}
                                variant="default"
                            >
                                Generate {selectedType ? selectedType.toUpperCase().replace('-', ' ') : 'Document'}
                            </LiquidButton>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
