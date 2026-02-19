import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 pointer-events-none">
            <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 backdrop-blur-md bg-white/5 rounded-full px-4 py-2 border border-white/10 shadow-lg shadow-black/20 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">DocuForge</div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                </Link>

                {/* Menu */}
                <div className="hidden md:flex gap-8 text-sm font-medium text-white/70 backdrop-blur-md bg-black/20 rounded-full px-8 py-3 border border-white/5 shadow-2xl">
                    <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="/#documents" className="hover:text-white transition-colors">Templates</Link>
                    <span className="opacity-50 cursor-not-allowed select-none">Pricing</span>
                </div>

                {/* CTA */}
                <Link href="/#documents" className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10">
                    Get Started
                </Link>
            </div>
        </nav>
    );
}
