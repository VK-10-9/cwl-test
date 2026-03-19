import Link from "next/link";
import Image from "next/image";
import UserMenu from "@/components/UserMenu";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-[60] px-4 sm:px-8 py-5 pointer-events-none transition-all duration-300 backdrop-blur-md bg-transparent border-b border-white/5">
            <div className="max-w-6xl mx-auto flex justify-between items-center pointer-events-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 transition-all duration-300 cursor-pointer group group-hover:opacity-90">
                    <div className="relative flex items-center justify-center bg-white rounded border border-white/20 w-8 h-8 shrink-0 overflow-hidden">
                        <span className="font-extrabold text-[#050505] text-[15px] tracking-tight translate-x-[-1px] translate-y-[-1px]">CW</span>
                        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <div className="font-serif font-semibold text-[19px] tracking-tight text-white flex items-baseline">
                        clausewala<span className="text-primary font-black ml-[1px]">.</span>
                    </div>
                </Link>

                {/* Menu */}
                <div className="hidden md:flex gap-8 text-[13px] font-medium text-white/60">
                    <Link href="/#features" className="hover:text-white transition-colors duration-200">Platform</Link>
                    <Link href="/templates" className="hover:text-white transition-colors duration-200">Library</Link>
                    <Link href="/pricing" className="hover:text-white transition-colors duration-200">Pricing</Link>
                    <Link href="/about" className="hover:text-white transition-colors duration-200">Company</Link>
                </div>

                {/* Auth */}
                <UserMenu />
            </div>
        </nav>
    );
}
