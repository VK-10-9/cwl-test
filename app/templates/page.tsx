import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FileText, ArrowRight, Building, Users, Briefcase, FileSignature } from "lucide-react";

export const metadata = {
    title: "Document Templates - ClauseWala",
    description: "Create AI-powered legal documents for startups and businesses.",
};

const TEMPLATE_CATEGORIES = [
    {
        name: "Corporate & Startup",
        icon: <Building className="w-5 h-5 text-emerald-500" />,
        templates: [
            { id: "nda", name: "Non-Disclosure Agreement (NDA)", description: "Protect your confidential information before sharing it with third parties." },
            { id: "founder-agreement", name: "Founders' Agreement", description: "Define roles, equity split, and vesting schedules among co-founders." },
            { id: "shareholder-agreement", name: "Shareholders' Agreement (SHA)", description: "Establish the rights and obligations of shareholders in a company." }
        ]
    },
    {
        name: "HR & Employment",
        icon: <Users className="w-5 h-5 text-emerald-500" />,
        templates: [
            { id: "employment-contract", name: "Employment Contract", description: "Standardized agreement outlining the terms of employment for new hires." },
            { id: "consulting-agreement", name: "Consulting Agreement", description: "Contract for engaging independent consultants or freelancers." },
            { id: "esop-policy", name: "ESOP Policy Document", description: "Draft the framework for your Employee Stock Option Plan." }
        ]
    },
    {
        name: "Commercial Contracts",
        icon: <Briefcase className="w-5 h-5 text-emerald-500" />,
        templates: [
            { id: "vendor-agreement", name: "Vendor Agreement", description: "Establish terms for the procurement of goods or services." },
            { id: "service-agreement", name: "Master Service Agreement (MSA)", description: "Broad agreement covering the overarching relationship with a service provider." },
            { id: "rent-agreement", name: "Commercial Lease Agreement", description: "Formalize the terms for renting commercial real estate properties." }
        ]
    }
];

export default function GenericTemplatesPage() {
    return (
        <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-foreground/5 text-foreground/80 border border-border/50 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                        <FileSignature className="w-4 h-4 text-emerald-500" />
                        <span>AI Contract Generator</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading leading-tight tracking-tight mb-6">
                        Business & Startup <span className="text-emerald-500">Templates</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Draft air-tight Indian legal documents in minutes. Provide your context, and our AI drafts custom provisions based on standard legal precedents.
                    </p>
                </div>

                <div className="space-y-16 mb-20">
                    {TEMPLATE_CATEGORIES.map((category, idx) => (
                        <div key={idx}>
                            <div className="flex items-center mb-8 pb-4 border-b border-border/40">
                                <div className="bg-background border border-border/80 w-10 h-10 rounded-lg flex items-center justify-center mr-4 shadow-sm">
                                    {category.icon}
                                </div>
                                <h2 className="text-2xl font-serif text-foreground">
                                    {category.name}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.templates.map((template) => (
                                    <Link
                                        href={`/generate/${template.id}`}
                                        key={template.id}
                                        className="group relative bg-background/50 backdrop-blur-sm border border-border/60 hover:border-emerald-500/50 p-6 rounded-xl shadow-sm transition-all hover:shadow-emerald-500/5 flex flex-col h-full"
                                    >
                                        <div className="relative z-10 flex-1">
                                            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                                <FileText className="w-3.5 h-3.5 opacity-70" />
                                                <span>Contract Generation</span>
                                            </div>
                                            <h3 className="text-xl font-heading text-foreground mb-3 leading-snug group-hover:text-emerald-400 transition-colors">
                                                {template.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {template.description}
                                            </p>
                                        </div>
                                        <div className="relative z-10 mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-sm font-semibold text-emerald-500">
                                            <span>Draft with AI</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
