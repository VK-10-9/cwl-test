import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative z-10 w-full py-10 px-6 sm:px-8 border-t border-border">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Brand */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/brand/logo-mark.png"
                        alt="CW"
                        width={28}
                        height={28}
                        unoptimized
                        className="shrink-0"
                    />
                    <span className="text-[15px] font-semibold text-foreground tracking-tight">
                        ClauseWala<span className="text-emerald-500">.</span>
                    </span>
                </Link>

                {/* Links */}
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[13px] text-muted-foreground/60">
                    <Link href="/about" className="hover:text-foreground transition-colors duration-200">About</Link>
                    <Link href="/pricing" className="hover:text-foreground transition-colors duration-200">Pricing</Link>
                    <Link href="/contact" className="hover:text-foreground transition-colors duration-200">Contact</Link>
                    <Link href="/privacy" className="hover:text-foreground transition-colors duration-200">Privacy</Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors duration-200">Terms</Link>
                </div>

                {/* Copyright */}
                <p className="text-[11px] text-muted-foreground/30 font-mono tracking-wider">
                    &copy; {new Date().getFullYear()} ClauseWala
                </p>
            </div>
        </footer>
    );
}
