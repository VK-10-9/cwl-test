import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing",
    description: "ClauseWala is free during public beta. Draft unlimited AI-powered Indian legal documents at no cost with no credit card required.",
    alternates: {
        canonical: "/pricing",
    },
    openGraph: {
        title: "ClauseWala Pricing",
        description: "ClauseWala is free during public beta. Draft unlimited AI-powered Indian legal documents.",
        url: "/pricing",
        type: "website",
    },
};

const features = [
    "22 document templates",
    "AI-powered clause blueprints",
    "Risk assessment per clause",
    "AI chat iteration and refinement",
    "PDF and DOCX export",
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
                            ClauseWala is in public beta. Everything is free -
                            just sign in with Google and start drafting.
                        </p>
                    </div>

                    <div className="max-w-sm mx-auto">
                        <div className="rounded-2xl border border-border bg-card p-8 relative overflow-hidden">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary/80 text-[11px] font-semibold mb-6">
                                <Sparkles className="w-3 h-3" />
                                Public Beta
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold tracking-tight">Rs 0</span>
                                    <span className="text-muted-foreground text-[13px]">/ forever*</span>
                                </div>
                                <p className="text-[12px] text-muted-foreground/60 mt-1">
                                    *During public beta period
                                </p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                                        <Check className="w-4 h-4 text-primary shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/signin"
                                className="block w-full text-center px-6 py-3 rounded-lg bg-foreground text-background font-medium text-[14px] hover:bg-foreground/85 transition-all duration-200"
                            >
                                Start Drafting - Free
                            </Link>
                        </div>
                    </div>

                    <div className="mt-16 space-y-6">
                        <h2 className="text-lg font-semibold tracking-tight text-center mb-8">Common Questions</h2>

                        <div className="space-y-4">
                            <FaqItem
                                question="Will ClauseWala always be free?"
                                answer="During the public beta, yes - completely free with no limits. If paid plans are introduced later, users will be notified in advance."
                            />
                            <FaqItem
                                question="Do I need to create an account?"
                                answer="Sign in with your Google account. No credit card is required."
                            />
                            <FaqItem
                                question="Are generated documents legally valid?"
                                answer="ClauseWala generates professional drafts based on Indian legal frameworks. Documents should still be reviewed by a qualified lawyer before execution."
                            />
                            <FaqItem
                                question="How many documents can I generate?"
                                answer="Unlimited during the public beta."
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
