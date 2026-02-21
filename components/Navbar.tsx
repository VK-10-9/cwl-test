import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-none">
            <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 bg-card rounded-full px-5 py-2.5 border border-border hover:border-primary/40 transition-colors cursor-pointer group">
                    <div className="font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">DocuForge</div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                </Link>

                {/* Menu */}
                <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground bg-card rounded-full px-8 py-2.5 border border-border">
                    <Link href="/#features" className="hover:text-foreground transition-colors">Features</Link>
                    <Link href="/#documents" className="hover:text-foreground transition-colors">Templates</Link>
                    <span className="opacity-40 cursor-not-allowed select-none">Pricing</span>
                </div>

                {/* CTA */}
                <Link href="/#documents" className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
                    Get Started
                </Link>
            </div>
        </nav>
    );
}
