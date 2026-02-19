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
                <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16 tracking-tight drop-shadow-lg">
                    Why Choose <span className="text-indigo-400">DocuForge?</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20"
                        >
                            <div className="text-4xl mb-6 bg-indigo-500/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-300 leading-relaxed text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
