import Image from "next/image";
import Link from "next/link";
import { Shield, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative z-10 w-full border-t border-border">
            {/* Main Footer */}
            <div className="py-10 px-6 sm:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Top row: Brand + Links + Copyright */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                        {/* Brand */}
                        <Link href="/" className="flex items-center gap-2.5 transition-all duration-300 cursor-pointer group group-hover:opacity-90">
                            <div className="relative flex items-center justify-center bg-white rounded border border-white/20 w-7 h-7 shrink-0 overflow-hidden">
                                <span className="font-extrabold text-[#050505] text-[13px] tracking-tight translate-x-[-1px] translate-y-[-1px]">CW</span>
                                <div className="absolute bottom-[3px] right-[3px] w-1 h-1 rounded-full bg-primary" />
                            </div>
                            <span className="font-serif font-semibold text-[18px] tracking-tight text-white flex items-baseline">
                                clausewala<span className="text-primary font-black ml-[1px]">.</span>
                            </span>
                        </Link>

                        {/* Links */}
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[13px] text-muted-foreground/60">
                            <Link href="/about" className="hover:text-foreground transition-colors duration-200">About</Link>
                            <Link href="/pricing" className="hover:text-foreground transition-colors duration-200">Pricing</Link>
                            <Link href="/generate" className="hover:text-foreground transition-colors duration-200">Templates</Link>
                            <Link href="/contact" className="hover:text-foreground transition-colors duration-200">Contact</Link>
                            <Link href="/privacy" className="hover:text-foreground transition-colors duration-200">Privacy</Link>
                            <Link href="/terms" className="hover:text-foreground transition-colors duration-200">Terms</Link>
                        </div>

                        {/* Copyright */}
                        <p className="text-[11px] text-muted-foreground/30 font-mono tracking-wider">
                            &copy; {new Date().getFullYear()} ClauseWala
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

                    {/* Bottom row: Trust signals + Email */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground/40">
                            <span className="flex items-center gap-1.5">
                                <Shield className="w-3 h-3" />
                                India-specific legal clauses
                            </span>
                            <span>22 templates &middot; 6 categories</span>
                            <span>AI-powered &middot; Free during public beta</span>
                        </div>
                        <a
                            href="mailto:clausewala@vishwadev.tech"
                            className="flex items-center gap-1.5 text-[11px] text-muted-foreground/40 hover:text-foreground transition-colors duration-200"
                        >
                            <Mail className="w-3 h-3" />
                            clausewala@vishwadev.tech
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
