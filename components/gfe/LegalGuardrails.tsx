import React from "react";
import { AlertCircle, ShieldAlert, Info } from "lucide-react";
import { LegalGuardrailSchema } from "@/lib/gfe/schema";
import { z } from "zod";

type Guardrail = z.infer<typeof LegalGuardrailSchema>;

interface LegalGuardrailsProps {
    guardrails: Guardrail[];
}

export function LegalGuardrails({ guardrails }: LegalGuardrailsProps) {
    if (!guardrails || guardrails.length === 0) return null;

    return (
        <div className="space-y-4 mb-8">
            {guardrails.map((guardrail) => (
                <div
                    key={guardrail.id}
                    className={`flex items-start p-4 rounded-xl border relative overflow-hidden backdrop-blur-md ${guardrail.severity === "critical"
                        ? "bg-red-500/10 border-red-500/30 text-red-400"
                        : guardrail.severity === "warning"
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            : "bg-primary/10 border-primary/30 text-primary/90"
                        }`}
                >
                    <div className="absolute top-0 left-0 w-1 h-full opacity-50 bg-current"></div>
                    <div className="mr-3 mt-0.5 relative z-10">
                        {guardrail.severity === "critical" ? (
                            <ShieldAlert className="w-5 h-5 text-red-400" />
                        ) : guardrail.severity === "warning" ? (
                            <AlertCircle className="w-5 h-5 text-amber-400" />
                        ) : (
                            <Info className="w-5 h-5 text-primary/90" />
                        )}
                    </div>
                    <div className="relative z-10">
                        <h4 className="font-serif tracking-tight text-[11px] mb-1.5 uppercase tracking-widest opacity-80 flex items-center">
                            {guardrail.severity} GUARD
                        </h4>
                        <p className="text-[13px] font-medium leading-relaxed opacity-90">{guardrail.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
