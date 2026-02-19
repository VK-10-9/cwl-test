export default function Footer() {
    return (
        <footer className="relative z-10 w-full py-12 px-4 sm:px-6 lg:px-8 bg-black border-t border-white/5 backdrop-blur-3xl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">

                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">D</div>
                    <span className="text-xl font-bold text-white tracking-tight">DocuForge AI</span>
                </div>

                {/* Links */}
                <div className="flex gap-8 text-sm text-slate-400 font-medium">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Contact</a>
                </div>

                {/* Copyright */}
                <div className="text-xs text-slate-600 font-mono uppercase tracking-widest">
                    © {new Date().getFullYear()} DocuForge Inc.
                </div>
            </div>
        </footer>
    );
}
