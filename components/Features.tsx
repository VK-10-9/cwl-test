import { Zap, MessageSquare, Download } from "lucide-react";

export default function Features() {
    const features = [
        {
            title: "Fill a Simple Form",
            description: "Tell us the parties, terms, and conditions. ClauseWala's AI picks the right clauses from an India-specific clause library.",
            icon: Zap,
            step: "01",
        },
        {
            title: "Review & Refine",
            description: "Get a clause-by-clause blueprint with risk flags. Chat with the AI to toggle, reword, or add clauses before the final draft.",
            icon: MessageSquare,
            step: "02",
        },
        {
            title: "Export & Sign",
            description: "Download a print-ready PDF or editable DOCX — formatted, paginated, and ready for signatures. No manual formatting.",
            icon: Download,
            step: "03",
        },
    ];

    return (
        <section className="relative z-10 py-24 md:py-32 px-6 sm:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">How ClauseWala works</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
                        Three steps from blank page<br />to signed contract
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={idx}
                                className="group p-8 bg-card hover:bg-accent/50 transition-colors duration-300 relative"
                            >
                                {/* Step number */}
                                <span className="text-[11px] font-mono text-muted-foreground/30 tracking-widest absolute top-6 right-6">
                                    {feature.step}
                                </span>

                                <div className="w-10 h-10 rounded-lg bg-foreground/[0.04] border border-border flex items-center justify-center mb-5 group-hover:bg-foreground/[0.08] group-hover:border-foreground/15 transition-all duration-300">
                                    <Icon className="w-[18px] h-[18px] text-foreground/70 group-hover:text-foreground transition-colors" />
                                </div>
                                <h3 className="text-[15px] font-semibold text-foreground mb-2 tracking-tight">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-[13px]">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
