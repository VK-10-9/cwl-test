import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy — ClauseWala.",
    description: "How ClauseWala collects, uses, and protects your data.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 sm:px-8 pt-28 md:pt-36 pb-24">
                <div className="animate-fade-in">
                    <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Legal</p>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
                    <p className="text-[13px] text-muted-foreground mb-12">Last updated: February 21, 2026</p>

                    <div className="prose-cw space-y-10">
                        <Section title="1. Introduction">
                            <p>
                                ClauseWala (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy.
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
                                you use our web-based document generation platform at clausewala.com (the &quot;Service&quot;).
                            </p>
                            <p>
                                By using ClauseWala, you agree to the collection and use of information in accordance with this policy.
                                If you do not agree, please do not use the Service.
                            </p>
                        </Section>

                        <Section title="2. Information We Collect">
                            <p><strong>Information you provide:</strong></p>
                            <ul>
                                <li>Organisation names, addresses, and signatory details entered into document forms</li>
                                <li>Document content and preferences during the generation process</li>
                                <li>Messages sent through the AI iteration chat</li>
                                <li>Contact information if you reach out to us</li>
                            </ul>
                            <p><strong>Information collected automatically:</strong></p>
                            <ul>
                                <li>Browser type, device information, and IP address</li>
                                <li>Pages visited and time spent on the Service</li>
                                <li>Referring URLs and search terms</li>
                            </ul>
                        </Section>

                        <Section title="3. How We Use Your Information">
                            <ul>
                                <li>To generate, process, and deliver your legal documents</li>
                                <li>To provide AI-powered document iteration and refinement</li>
                                <li>To improve and optimize the Service</li>
                                <li>To respond to your enquiries and provide support</li>
                                <li>To detect and prevent misuse or fraud</li>
                            </ul>
                        </Section>

                        <Section title="4. AI Processing">
                            <p>
                                Your form inputs and document content are sent to third-party AI providers (currently Groq/Meta)
                                to generate document blueprints and full-text drafts. We do not use your document content to train
                                AI models. AI-generated documents are provided as drafts and should be reviewed by a qualified
                                legal professional before execution.
                            </p>
                        </Section>

                        <Section title="5. Data Storage & Security">
                            <p>
                                Documents are processed in-memory during your session. We use industry-standard security measures
                                to protect data in transit (TLS encryption). We do not permanently store your generated documents
                                on our servers unless you explicitly choose to save them.
                            </p>
                        </Section>

                        <Section title="6. Data Sharing">
                            <p>We do not sell your personal information. We may share data with:</p>
                            <ul>
                                <li><strong>AI service providers</strong> — to process document generation requests</li>
                                <li><strong>Hosting providers</strong> — to serve the application</li>
                                <li><strong>Law enforcement</strong> — if required by applicable Indian law</li>
                            </ul>
                        </Section>

                        <Section title="7. Your Rights">
                            <p>
                                Under the Digital Personal Data Protection Act, 2023 (DPDP Act) and applicable Indian law,
                                you have the right to:
                            </p>
                            <ul>
                                <li>Access the personal data we hold about you</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Withdraw consent at any time</li>
                            </ul>
                            <p>To exercise these rights, contact us at <strong>clausewala@vishwadev.tech</strong>.</p>
                        </Section>

                        <Section title="8. Cookies">
                            <p>
                                We use essential cookies to maintain your session and preferences. We do not use third-party
                                tracking or advertising cookies.
                            </p>
                        </Section>

                        <Section title="9. Changes to This Policy">
                            <p>
                                We may update this Privacy Policy from time to time. Changes will be posted on this page with
                                an updated &quot;Last updated&quot; date. Continued use of the Service after changes constitutes
                                acceptance of the revised policy.
                            </p>
                        </Section>

                        <Section title="10. Contact Us">
                            <p>For privacy-related queries:</p>
                            <ul>
                                <li>Email: <strong>clausewala@vishwadev.tech</strong></li>
                                <li>Address: India</li>
                            </ul>
                        </Section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="text-lg font-semibold tracking-tight text-foreground mb-3">{title}</h2>
            <div className="text-[14px] text-muted-foreground leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-foreground">
                {children}
            </div>
        </section>
    );
}
