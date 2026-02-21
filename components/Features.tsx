export default function Features() {
    const features = [
        {
            title: "AI-Powered Drafting",
            description: "Leverage Groq & Llama-3 to generate legally sound clauses tailored to your needs instantly.",
            icon: "⚡",
        },
        {
            title: "Real-time Iteration",
            description: "Chat with the AI to refine terms, add clauses, and polish the language in real-time.",
            icon: "💬",
        },
        {
            title: "Instant Export",
            description: "Download perfectly formatted PDF and DOCX files ready for signature immediately.",
            icon: "📄",
        },
    ];

    return (
        <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-center text-foreground mb-16 tracking-tight">
                    Why Choose <span className="text-primary">DocuForge?</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200 hover:-translate-y-1"
                        >
                            <div className="text-3xl mb-5 bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform duration-200">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
