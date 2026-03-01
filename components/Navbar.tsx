import Link from "next/link";
import Image from "next/image";
import UserMenu from "@/components/UserMenu";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-[60] px-4 sm:px-6 lg:px-8 py-4 pointer-events-none">
            <div className="max-w-5xl mx-auto flex justify-between items-center pointer-events-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 bg-background/80 backdrop-blur-xl rounded-full pl-1.5 pr-4 py-1 border border-border/60 hover:border-foreground/15 transition-all duration-300 cursor-pointer group shadow-sm">
                    <Image
                        src="/brand/logo-mark.png"
                        alt="CW"
                        width={32}
                        height={32}
                        unoptimized
                        className="shrink-0"
                    />
                    <div className="font-semibold text-[15px] tracking-tight text-foreground">ClauseWala<span className="text-emerald-500">.</span></div>
                </Link>

                {/* Menu */}
                <div className="hidden md:flex gap-6 text-[13px] font-medium text-muted-foreground bg-background/80 backdrop-blur-xl rounded-full px-6 py-2 border border-border/60 shadow-sm">
                    <Link href="/#features" className="hover:text-foreground transition-colors duration-200">How It Works</Link>
                    <Link href="/gfe" className="hover:text-emerald-500 font-bold text-emerald-600 transition-colors duration-200">Forms Engine <span className="text-[10px] uppercase bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-sm ml-1">Beta</span></Link>
                    <Link href="/templates" className="hover:text-foreground transition-colors duration-200">Templates</Link>
                    <Link href="/pricing" className="hover:text-foreground transition-colors duration-200">Pricing</Link>
                    <Link href="/about" className="hover:text-foreground transition-colors duration-200">About</Link>
                </div>

                {/* Auth */}
                <UserMenu />
            </div>
        </nav>
    );
}
