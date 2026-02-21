import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact — ClauseWala.",
    description: "Get in touch with ClauseWala for support, partnerships, or feedback.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 sm:px-8 pt-28 md:pt-36 pb-24">
                <div className="animate-fade-in">
                    <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Reach out</p>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
                    <p className="text-[15px] text-muted-foreground leading-relaxed max-w-lg mb-14">
                        Have a question, want to report a bug, or just want to say hello? We&apos;d love to hear from you.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* General */}
                        <div className="group p-6 rounded-xl border border-border bg-card hover:border-foreground/12 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                            <div className="w-10 h-10 rounded-lg bg-foreground/[0.04] border border-border flex items-center justify-center mb-4 group-hover:bg-foreground/[0.08] transition-all">
                                <Mail className="w-[18px] h-[18px] text-foreground/70" />
                            </div>
                            <h3 className="text-[15px] font-semibold tracking-tight mb-1">General Enquiries</h3>
                            <p className="text-[13px] text-muted-foreground mb-4">For questions about ClauseWala, partnerships, or press.</p>
                            <a href="mailto:clausewala@vishwadev.tech" className="text-[13px] font-medium text-foreground underline underline-offset-4 hover:no-underline">
                                clausewala@vishwadev.tech
                            </a>
                        </div>

                        {/* Support */}
                        <div className="group p-6 rounded-xl border border-border bg-card hover:border-foreground/12 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                            <div className="w-10 h-10 rounded-lg bg-foreground/[0.04] border border-border flex items-center justify-center mb-4 group-hover:bg-foreground/[0.08] transition-all">
                                <MessageSquare className="w-[18px] h-[18px] text-foreground/70" />
                            </div>
                            <h3 className="text-[15px] font-semibold tracking-tight mb-1">Support & Feedback</h3>
                            <p className="text-[13px] text-muted-foreground mb-4">Found a bug or have a feature request? Let us know.</p>
                            <a href="mailto:clausewala@vishwadev.tech" className="text-[13px] font-medium text-foreground underline underline-offset-4 hover:no-underline">
                                clausewala@vishwadev.tech
                            </a>
                        </div>
                    </div>

                    {/* Response time note */}
                    <div className="mt-10 p-4 rounded-lg bg-muted/50 border border-border/60">
                        <p className="text-[13px] text-muted-foreground">
                            <strong className="text-foreground">Response time:</strong> We typically respond within 24 hours on business days.
                            For urgent matters, please include &quot;URGENT&quot; in the subject line.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
