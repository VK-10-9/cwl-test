"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Info, ArrowRight, ExternalLink, MapPin, Stamp } from "lucide-react";

interface NextStepsGuideProps {
    docType: string;
    state?: string;
}

export default function NextStepsGuide({ docType, state }: NextStepsGuideProps) {
    if (docType !== "rent-agreement") return null;

    const steps = [
        {
            title: "Purchase Stamp Paper",
            description: state === "Maharashtra" 
                ? "Physical stamp paper is now rare. Use the e-SBTR or e-Stamp portal for Maharashtra (~Rs. 500 for rent agreements)."
                : "Buy non-judicial stamp paper from a registered vendor. Recommended value is Rs. 100-500 depending on your state's laws.",
            icon: Stamp
        },
        {
            title: "Print & Witness",
            description: "Print the document on stamp paper or plain paper (if using e-stamp certificate). Sign in front of two witnesses.",
            icon: CheckCircle2
        },
        {
            title: "Notarization / Registration",
            description: "Agreements over 11 months require mandatory registration at the local Sub-Registrar's office. Shorter ones can just be notarized.",
            icon: MapPin
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 mb-10 bg-primary/5 border border-primary/20 rounded-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Info size={120} className="text-primary" />
            </div>

            <div className="relative z-10">
                <h3 className="text-lg font-serif font-semibold text-white mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Execution Guide & Next Steps
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                    Generating the agreement is the first step. Here is how to make it legally binding in {state || "India"}.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {steps.map((step, idx) => (
                        <div key={idx} className="bg-background/40 backdrop-blur-sm border border-white/5 p-4 rounded-xl flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                <step.icon className="w-5 h-5 text-primary" />
                            </div>
                            <h4 className="text-sm font-semibold text-white/90">{step.title}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-4">
                    <a 
                        href="https://www.shcilestamp.com/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-medium text-primary hover:underline flex items-center gap-1.5"
                    >
                        Buy e-Stamp Paper Online <ExternalLink size={12} />
                    </a>
                    <a 
                        href="#" 
                        className="text-xs font-medium text-muted-foreground hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                        Locate Nearest Sub-Registrar <MapPin size={12} />
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
