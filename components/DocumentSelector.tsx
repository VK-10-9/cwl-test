import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DOCUMENT_CATEGORIES, DOCUMENT_TYPE_LABELS, DOCUMENT_TYPE_DESCRIPTIONS } from "@/types";
import type { DocumentType } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  FileSignature, Landmark, BookText, ArrowUpRight,
  Mail, ClipboardCheck, UserCheck,
  IndianRupee, TrendingUp, BarChart3,
  Scale, AlertTriangle,
  Handshake, Store,
  Flag, Building2,
  Briefcase, FileText, XCircle, Award, GraduationCap,
  Brain, Users, ScrollText, Flame,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  // Contracts
  "nda": FileSignature,
  "mou": Landmark,
  "consultancy-agreement": Briefcase,
  "service-agreement": FileText,
  // Hiring & HR
  "offer-letter": Mail,
  "appointment-letter": ClipboardCheck,
  "relieving-letter": UserCheck,
  "termination-letter": XCircle,
  "experience-letter": Award,
  "internship-letter": GraduationCap,
  // Finance & Banking
  "payment-reminder": IndianRupee,
  "esop-grant": TrendingUp,
  "share-allotment": BarChart3,
  // Legal Protection
  "legal-notice": Scale,
  "breach-notice": AlertTriangle,
  "ip-assignment": Brain,
  // Partnerships
  "loi": Handshake,
  "vendor-onboarding": Store,
  "co-founder-agreement": Users,
  // Compliance
  "startup-india": Flag,
  "gst-bank-letter": Building2,
  "board-resolution": ScrollText,
};

const categoryIcons: Record<string, LucideIcon> = {
  "contracts": FileSignature,
  "hiring-hr": ClipboardCheck,
  "finance-banking": IndianRupee,
  "legal-protection": Scale,
  "partnerships": Handshake,
  "compliance": Flag,
};

// Most-used templates get a "Popular" badge
const POPULAR_TEMPLATES: Set<DocumentType> = new Set([
  "nda",
  "offer-letter",
  "co-founder-agreement",
  "mou",
  "appointment-letter",
  "legal-notice",
]);

export default function DocumentSelector() {
  return (
    <div className="space-y-12 animate-fade-in">
      {DOCUMENT_CATEGORIES.map((category, catIdx) => {
        const CatIcon = categoryIcons[category.key] || BookText;

        return (
          <div key={category.key}>
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-foreground/[0.04] border border-border flex items-center justify-center">
                <CatIcon size={16} className="text-foreground/60" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground">{category.label}</h3>
                <p className="text-xs text-muted-foreground/70">{category.description}</p>
              </div>
            </div>

            {/* Hint for first category */}
            {catIdx === 0 && (
              <p className="text-[11px] text-muted-foreground/50 mb-3 ml-11 italic">
                Most startups start with an NDA or Offer Letter
              </p>
            )}

            {/* Document Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {category.types.map((type: DocumentType) => {
                const Icon = icons[type] || BookText;
                const isPopular = POPULAR_TEMPLATES.has(type);

                return (
                  <Link key={type} href={`/generate/${type}`} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
                    <Card className="h-full flex flex-col bg-card border-border hover:border-foreground/12 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 hover:scale-[1.01]">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 border ${isPopular ? "bg-foreground/[0.07] text-foreground border-foreground/15 group-hover:bg-foreground/[0.12]" : "bg-foreground/[0.04] text-foreground/70 border-border group-hover:bg-foreground/[0.08] group-hover:text-foreground group-hover:border-foreground/15"}`}>
                            <Icon size={18} />
                          </div>
                          <div className="flex items-center gap-2">
                            {isPopular && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 text-[10px] font-semibold">
                                <Flame className="w-2.5 h-2.5" />
                                Popular
                              </span>
                            )}
                            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-all duration-300 -translate-x-1 group-hover:translate-x-0" />
                          </div>
                        </div>
                        <CardTitle className="text-[15px] font-semibold tracking-tight group-hover:text-foreground transition-colors">
                          {DOCUMENT_TYPE_LABELS[type] || type}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow pt-0">
                        <CardDescription className="text-[13px] leading-relaxed text-muted-foreground/80">
                          {DOCUMENT_TYPE_DESCRIPTIONS[type] || "Draft this document with AI assistance."}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
