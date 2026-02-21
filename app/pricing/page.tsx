import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing",
    description: "ClauseWala is free during public beta. Draft unlimited AI-powered Indian legal documents at no cost — no credit card required.",
};

const features = [
    "22 document templates",
    "AI-powered clause blueprints",
    "Risk assessment per clause",
    "AI chat iteration & refinement",
    "PDF & DOCX export",
    "India-specific legal clauses",
    "Free Google sign-in",
    "Unlimited documents",
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 sm:px-8 pt-28 md:pt-36 pb-24">
                <div className="animate-fade-in">
                    <div className="text-center mb-14">
                        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Pricing</p>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Simple pricing.<br />Free during public beta.
                        </h1>
                        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-lg mx-auto">
                            ClauseWala is in public beta. Everything is free &mdash;
                            just sign in with Google and start drafting. Help us improve by testing.
                        </p>
                    </div>

                    {/* Pricing Card */}
                    <div className="max-w-sm mx-auto">
                        <div className="rounded-2xl border border-border bg-card p-8 relative overflow-hidden">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-semibold mb-6">
                                <Sparkles className="w-3 h-3" />
                                Public Beta
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold tracking-tight">₹0</span>
                                    <span className="text-muted-foreground text-[13px]">/ forever*</span>
                                </div>
                                <p className="text-[12px] text-muted-foreground/60 mt-1">
                                    *During public beta period
                                </p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <Link
                                href="/signin"
                                className="block w-full text-center px-6 py-3 rounded-lg bg-foreground text-background font-medium text-[14px] hover:bg-foreground/85 transition-all duration-200"
                            >
                                Start Drafting — Free
                            </Link>
                        </div>
                    </div>

                    {/* FAQ-like notes */}
                    <div className="mt-16 space-y-6">
                        <h2 className="text-lg font-semibold tracking-tight text-center mb-8">Common Questions</h2>

                        <div className="space-y-4">
                            <FaqItem
                                question="Will ClauseWala always be free?"
                                answer="During the public beta, yes — completely free with no limits. When we introduce paid plans in the future, beta users will be notified 30 days in advance and may receive special pricing."
                            />
                            <FaqItem
                                question="Do I need to create an account?"
                                answer="Just sign in with your Google account — it takes 2 seconds. No credit card, no forms, no email verification. One click and you're in."
                            />
                            <FaqItem
                                question="Are generated documents legally valid?"
                                answer="ClauseWala generates professional drafts based on Indian legal frameworks. However, all documents should be reviewed by a qualified lawyer before execution. We provide drafts, not legal advice."
                            />
                            <FaqItem
                                question="How many documents can I generate?"
                                answer="Unlimited. There are no caps on document generation during the public beta."
                            />
                            <FaqItem
                                question="Is my data stored?"
                                answer="Documents are processed in-memory during your session. We do not permanently store your generated documents. See our Privacy Policy for full details."
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="text-[14px] font-semibold tracking-tight text-foreground mb-2">{question}</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{answer}</p>
        </div>
    );
}
