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
                    <h2 className="text-[clamp(2rem,5vw,3rem)] font-black text-foreground tracking-tight leading-tight">
                        Three steps from blank page<br />
                        <span className="font-light italic text-muted-foreground tracking-[-0.05em] mr-2">to</span>signed contract<span className="text-primary leading-none ml-[2px]">.</span>
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
                                <span className="text-[12px] font-mono text-muted-foreground/50 tracking-[0.2em] absolute top-8 right-8 font-medium">
                                    {feature.step}
                                </span>

                                <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                                    <Icon className="w-[20px] h-[20px] text-white/80 group-hover:text-primary transition-colors duration-300" />
                                </div>
                                <h3 className="text-[17px] font-semibold text-white/90 mb-3 tracking-tight">{feature.title}</h3>
                                <p className="text-muted-foreground/70 leading-relaxed text-[14px] font-light">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
