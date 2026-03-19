"use client";

import Link from "next/link";

export default function HeroDemo() {
    return (
        <div className="relative flex w-full min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#0a0a0b] selection:bg-primary/20">
            {/* Unique Brand Glow: Soft mint green sweeping aura instead of pure white */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary/[0.04] blur-[140px] rounded-[100%] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-white/[0.02] blur-[100px] rounded-[100%] pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 flex flex-col items-center justify-center min-h-[100svh] pt-24 pb-16">

                <main className="flex flex-col items-center text-center w-full mt-4 md:mt-10">
                    {/* ClauseWala Custom Badge */}
                    <div className="mb-10 flex items-center justify-center gap-2.5 px-3.5 py-1.5 rounded-md border border-primary/20 bg-primary/5 backdrop-blur-sm animate-fade-in transition-all cursor-default select-none shadow-[0_0_15px_rgba(74,222,128,0.05)]">
                        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
                            <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-primary opacity-80"></span>
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
                        </span>
                        <span className="text-[11px] font-semibold text-primary/90 tracking-widest uppercase">Public Beta Engine</span>
                    </div>

                    {/* Main Headline (Editorial Serif layout) */}
                    <h1 className="mb-8 text-foreground animate-fade-in-up flex flex-col items-center w-full" style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}>
                        <span className="block text-[clamp(2.5rem,5.5vw,5.5rem)] font-serif font-black tracking-normal leading-[1.1] text-white">
                            Define. Draft. Sign.
                        </span>
                        <span className="flex flex-wrap md:flex-nowrap whitespace-normal md:whitespace-nowrap items-baseline justify-center gap-x-2 md:gap-x-4 mt-2 text-[clamp(1.5rem,3.5vw,3.5rem)] font-serif font-black tracking-normal leading-[1.1] text-[#e4e4e7]">
                            Contracts <span className="font-serif font-light italic text-[clamp(1.5rem,4vw,3.8rem)] text-white/50 tracking-[-0.05em] -translate-y-1 md:-translate-y-1.5">made</span> production-ready<span className="text-primary font-black ml-[-2px] md:ml-[2px]">.</span>
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-[#a1a1aa] text-[15px] md:text-[19px] font-sans tracking-wide max-w-3xl mx-auto mb-10 md:mb-12 font-light animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}>
                        Intelligently parsed Indian jurisprudence. MOUs, NDAs, and<br className="hidden sm:block" />
                        Offer Letters — out of the box with AI precision.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up w-full justify-center mb-16 md:mb-20" style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}>
                        <Link href="/signin">
                            <button className="text-[#050505] bg-white hover:bg-primary hover:text-[#050505] px-8 py-3.5 text-[15px] md:text-[16px] font-bold rounded shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(74,222,128,0.3)] transition-all duration-300 flex items-center gap-2 font-sans group">
                                Get Started Free
                            </button>
                        </Link>
                        <Link href="/templates">
                            <button className="text-[#a1a1aa] bg-[#111] hover:bg-[#1a1a1a] border border-white/10 hover:border-white/20 hover:text-white px-8 py-3.5 text-[15px] md:text-[16px] font-medium rounded transition-all duration-300 flex items-center gap-2 font-sans">
                                Explore Templates
                            </button>
                        </Link>
                    </div>
                    
                    {/* Visual Interface: AI Clause Parsing Engine Mockup */}
                    <div className="w-full max-w-4xl mx-auto relative animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}>
                        {/* Huge glow behind the mock interface */}
                        <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full" />
                        
                        <div className="relative rounded-xl border border-white/10 bg-[#080808]/80 backdrop-blur-xl overflow-hidden shadow-2xl text-left font-sans">
                            {/* Window Header */}
                            <div className="flex items-center px-4 py-3 border-b border-white/5 bg-white/[0.04]">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                                </div>
                                <div className="mx-auto font-mono text-[10px] md:text-[11px] text-white/50 tracking-[0.2em] uppercase flex items-center gap-2">
                                    clause_analysis_engine.ts
                                </div>
                            </div>
                            
                            {/* Document Content */}
                            <div className="p-5 md:p-8 font-serif text-[14px] md:text-[16px] leading-relaxed text-[#a1a1aa] space-y-4 md:space-y-5 relative">
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#080808] to-transparent z-10 pointer-events-none" />
                                
                                <p>This Non-Disclosure Agreement (the <span className="text-white/80 font-medium tracking-tight">"Agreement"</span>) is entered into between the parties to protect proprietary assets under the <span className="border-b border-dashed border-white/30 text-[#d4d4d8]">Indian Contract Act, 1872</span>.</p>
                                
                                {/* AI Highlight Block */}
                                <div className="my-4 md:my-5 p-4 rounded-md border border-primary/20 bg-primary/[0.03] relative group shadow-[0_0_20px_rgba(74,222,128,0.02)] z-0">
                                    <div className="absolute -left-[1px] top-0 bottom-0 w-[3px] bg-primary rounded-l-md shadow-[0_0_10px_var(--primary)]" />
                                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        <span className="font-sans text-[9px] md:text-[10px] font-bold text-primary tracking-[0.15em] uppercase">AI Correction Applied</span>
                                    </div>
                                    <p className="font-sans text-[12.5px] md:text-[13.5px] leading-[1.6] flex flex-col gap-1.5 md:gap-2">
                                        <span className="line-through decoration-red-500/50 text-white/30 px-1">
                                            The Receiving Party shall not be liable for incidental damages...
                                        </span>
                                        <span className="text-primary/90 font-medium flex items-start bg-primary/10 px-3 py-2 rounded-sm border border-primary/20 shadow-sm relative">
                                            <span className="absolute -left-[5px] top-[14px] w-0 h-0 border-[5px] border-transparent border-r-primary/20" />
                                            The Receiving Party shall fully indemnify the Disclosing Party against any breach...
                                        </span>
                                    </p>
                                </div>

                                <p className="opacity-60">This Agreement shall remain in full force and effect for an aggregate period of <span className="bg-white/10 px-1 rounded text-white/90 font-sans text-[12px] md:text-[13px] mx-1">five (5) years</span>...</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
