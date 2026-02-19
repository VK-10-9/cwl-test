import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS } from "@/types";
import type { LucideIcon } from "lucide-react";
import { BookText, FileSignature, Landmark, FileCheck, Award } from "lucide-react";
import { DOCUMENT_TYPE_DESCRIPTIONS } from "@/types";

const icons: Record<string, LucideIcon> = {
  "nda": FileSignature,
  "mou": Landmark,
  "request-letter": BookText,
  "internship-cert": Award,
  "sponsorship-letter": FileCheck,
};

// Use centralized descriptions from types/index.ts
const descriptions = DOCUMENT_TYPE_DESCRIPTIONS;

export default function DocumentSelector() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {DOCUMENT_TYPES.map((type) => {
        // Fallback or explicit icon
        const Icon = icons[type] || BookText;

        return (
          <Link key={type} href={`/generate/${type}`} className="group block focus:outline-none focus:ring-2 focus:ring-ring rounded-xl">
            <Card className="glass-card h-full flex flex-col hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={24} />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {DOCUMENT_TYPE_LABELS[type] || type}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-base leading-relaxed">
                  {descriptions[type] || "Draft this document with AI assistance."}
                </CardDescription>
              </CardContent>

              {/* Hover Indicator */}
              <div className="px-6 pb-6 pt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary text-sm font-medium flex items-center gap-2">
                Start Drafting →
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
