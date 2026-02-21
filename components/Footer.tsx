export default function Footer() {
    return (
        <footer className="relative z-10 w-full py-10 px-4 sm:px-6 lg:px-8 border-t border-border">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Brand */}
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">D</div>
                    <span className="text-base font-semibold text-foreground tracking-tight">DocuForge AI</span>
                </div>

                {/* Links */}
                <div className="flex gap-8 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                    <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                    <a href="#" className="hover:text-foreground transition-colors">Contact</a>
                </div>

                {/* Copyright */}
                <div className="text-xs text-muted-foreground/50 font-mono uppercase tracking-widest">
                    © {new Date().getFullYear()} DocuForge Inc.
                </div>
            </div>
        </footer>
    );
}
