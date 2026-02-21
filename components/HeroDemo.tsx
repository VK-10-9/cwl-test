"use client";

import Link from "next/link";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { ArrowDown, Shield } from "lucide-react";

export default function HeroDemo() {
    return (
        <div className="relative flex w-full min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-background selection:bg-primary/20">
            <WebGLShader />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 flex flex-col items-center justify-center min-h-[100svh]">

                <main className="flex flex-col items-center text-center">
                    {/* Status Badge */}
                    <div className="mb-8 flex items-center justify-center gap-2.5 px-4 py-1.5 rounded-full border border-border/60 bg-background/60 backdrop-blur-sm animate-fade-in cursor-default select-none">
                        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60"></span>
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        </span>
                        <p className="text-[10px] md:text-[11px] text-muted-foreground font-medium tracking-[0.2em] uppercase">Built for Indian Startups</p>
                    </div>

                    {/* Main Headline */}
                    <h1 className="mb-6 text-foreground animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}>
                        <span className="block text-[clamp(2.5rem,7.5vw,5.5rem)] font-extrabold tracking-[-0.04em] leading-[0.9]">
                            Draft Legal Docs
                        </span>
                        <span className="block text-[clamp(2.5rem,7.5vw,5.5rem)] font-extrabold tracking-[-0.04em] leading-[0.9] text-gradient-subtle mt-1">
                            Not Headaches
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-muted-foreground text-base md:text-[17px] max-w-lg mb-8 font-normal leading-relaxed mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}>
                        Contracts, letters, agreements &mdash; compliant with Indian law.<br className="hidden sm:block" />
                        AI-drafted, clause-by-clause reviewed, exported in minutes.
                    </p>

                    {/* Trust Line */}
                    <div className="flex items-center gap-4 mb-10 animate-fade-in-up text-[12px] text-muted-foreground/50" style={{ animationDelay: "0.25s", animationFillMode: "backwards" }}>
                        <span className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5" />
                            India-specific clauses
                        </span>
                        <span className="w-px h-3 bg-border" />
                        <span>22 templates</span>
                        <span className="w-px h-3 bg-border" />
                        <span>100% free</span>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}>
                        <Link href="/signin">
                            <LiquidButton
                                className="text-primary-foreground bg-primary hover:bg-primary/90 px-8 py-5 text-[15px] font-medium"
                                size={'xl'}
                                variant="default"
                            >
                                Start Drafting &mdash; It&apos;s Free
                            </LiquidButton>
                        </Link>
                        <Link href="/#features" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors font-medium px-4 py-2.5">
                            See How It Works
                        </Link>
                    </div>
                </main>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
                    <ArrowDown className="w-4 h-4 text-muted-foreground" />
                </div>
            </div>
        </div>
    )
}
