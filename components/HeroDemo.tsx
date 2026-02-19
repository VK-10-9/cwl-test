"use client";

import Link from "next/link";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from '@/components/ui/liquid-glass-button';

export default function HeroDemo() {
    return (
        <div className="relative flex w-full min-h-screen flex-col items-center justify-center overflow-hidden bg-black selection:bg-indigo-500/30">
            <WebGLShader />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen">

                <main className="relative py-20 flex flex-col items-center text-center">
                    {/* Status Badge */}
                    <div className="mb-8 flex items-center justify-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 shadow-2xl animate-fade-in hover:bg-white/10 transition-colors cursor-default select-none">
                        <span className="relative flex h-3 w-3 items-center justify-center">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
                        </span>
                        <p className="text-[10px] md:text-xs text-indigo-200 font-bold tracking-widest uppercase">v1.0 Public Beta</p>
                    </div>

                    {/* Main Headline */}
                    <h1 className="mb-6 text-white text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-tight drop-shadow-2xl">
                        Legal Drafting <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 animate-pulse-slow">
                            Reimagined
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-slate-300/80 text-lg md:text-xl max-w-2xl mb-12 font-light leading-relaxed drop-shadow-md mx-auto">
                        Generate complex legal documents in seconds from a simple conversation.
                        <br className="hidden md:block" />
                        Powered by advanced AI for precision and speed.
                    </p>

                    {/* CTA Button */}
                    <div className="flex justify-center transform hover:scale-105 transition-transform duration-300">
                        <Link href="/generate">
                            <LiquidButton
                                className="text-white border-white/20 bg-white/5 hover:bg-white/10 px-8 py-6 text-lg"
                                size={'xl'}
                                variant="ghost"
                            >
                                Start Drafting Now
                            </LiquidButton>
                        </Link>
                    </div>

                    {/* Footer Tech Stack/Credits */}
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 text-[10px] md:text-xs text-white/20 font-mono uppercase tracking-[0.2em] pointer-events-none">
                        <span>Next.js 14</span>
                        <span>•</span>
                        <span>Three.js</span>
                        <span>•</span>
                        <span>Tailwind v4</span>
                    </div>
                </main>
            </div>
        </div>
    )
}
