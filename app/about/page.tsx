import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { FileText, Shield, Zap, Scale } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About",
    description: "ClauseWala is an AI-powered legal document platform built for Indian startups. 22 templates, India-specific clauses, free during public beta.",
};

const stats = [
    { value: "22", label: "Document Templates" },
    { value: "6", label: "Categories" },
    { value: "35+", label: "NDA Clauses" },
    { value: "100%", label: "India-Specific" },
];

const values = [
    {
        icon: Zap,
        title: "Speed Over Bureaucracy",
        description: "Founders shouldn't spend weeks on paperwork. A contract that once took 3 days and ₹15,000 should take 3 minutes and ₹0.",
    },
    {
        icon: Shield,
        title: "Legal Accuracy First",
        description: "Every template is built with Indian law in mind — the Indian Contract Act, Companies Act, IT Act, DPDP Act, and relevant labour codes.",
    },
    {
        icon: Scale,
        title: "Transparent & Explainable",
        description: "Our two-stage blueprint system shows you every clause before the final document. No black-box magic — you control what goes in.",
    },
    {
        icon: FileText,
        title: "Built for Startups",
        description: "From founder agreements to ESOP grants, every template is designed for the realities of building a company in India.",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 sm:px-8 pt-28 md:pt-36 pb-24">
                <div className="animate-fade-in">
                    {/* Header */}
                    <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">About</p>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        Legal docs shouldn&apos;t be the<br />hardest part of building a startup.
                    </h1>
                    <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xl mb-16">
                        ClauseWala is an AI-powered legal document platform that turns plain English into
                        professionally drafted Indian contracts — in minutes, not days.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border mb-16">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-card p-5 text-center">
                                <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
                                <p className="text-[11px] text-muted-foreground/60 mt-1 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Story */}
                    <section className="mb-16">
                        <h2 className="text-lg font-semibold tracking-tight mb-4">The Problem</h2>
                        <div className="text-[14px] text-muted-foreground leading-relaxed space-y-4">
                            <p>
                                Indian startups face a paradox: you need legal documents from Day 1 — NDAs before your first meeting,
                                co-founder agreements before writing a line of code, offer letters before your first hire. But hiring
                                a lawyer for each document is expensive, slow, and overkill for early-stage companies.
                            </p>
                            <p>
                                Most founders end up downloading random templates from the internet, half-filling them, and hoping
                                for the best. Those templates are usually written for US/UK jurisdictions, miss critical Indian legal
                                provisions, and leave startups exposed to real risk.
                            </p>
                        </div>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-lg font-semibold tracking-tight mb-4">Our Solution</h2>
                        <div className="text-[14px] text-muted-foreground leading-relaxed space-y-4">
                            <p>
                                ClauseWala uses a two-stage AI process: first, we generate a <strong className="text-foreground">clause-by-clause
                                blueprint</strong> with risk flags so you can see exactly what&apos;s going into your document. Then, once
                                you approve, we expand it into a fully formatted, legally-phrased document ready for export as PDF or DOCX.
                            </p>
                            <p>
                                Every template is built from the ground up for Indian jurisdiction — citing the Indian Contract Act 1872,
                                Companies Act 2013, Information Technology Act 2000, Digital Personal Data Protection Act 2023, and
                                relevant labour codes. No generic US templates here.
                            </p>
                        </div>
                    </section>

                    {/* Values */}
                    <section className="mb-16">
                        <h2 className="text-lg font-semibold tracking-tight mb-6">What We Believe</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {values.map((value) => {
                                const Icon = value.icon;
                                return (
                                    <div key={value.title} className="p-5 rounded-xl border border-border bg-card">
                                        <div className="w-9 h-9 rounded-lg bg-foreground/[0.04] border border-border flex items-center justify-center mb-3">
                                            <Icon className="w-4 h-4 text-foreground/70" />
                                        </div>
                                        <h3 className="text-[14px] font-semibold tracking-tight mb-1.5">{value.title}</h3>
                                        <p className="text-[13px] text-muted-foreground leading-relaxed">{value.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="text-center p-8 rounded-xl border border-border bg-card">
                        <h2 className="text-lg font-semibold tracking-tight mb-2">Ready to draft your first document?</h2>
                        <p className="text-[13px] text-muted-foreground mb-5">Pick a template, fill a form, and get a professional legal draft in minutes.</p>
                        <Link
                            href="/signin"
                            className="inline-flex px-6 py-2.5 rounded-full bg-foreground text-background font-medium text-[13px] hover:bg-foreground/85 transition-all duration-200 shadow-sm"
                        >
                            Start Drafting — It&apos;s Free →
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
