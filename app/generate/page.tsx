import DocumentSelector from "@/components/DocumentSelector";
import Navbar from "@/components/Navbar";

export default function SelectionPage() {
    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/20 overflow-hidden">
            {/* Background gradients */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-20 dark:opacity-40">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />
            </div>

            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20 relative z-10">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent drop-shadow-sm">
                        What would you like to draft?
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                        Select a template below to begin the AI-powered drafting process.
                    </p>
                </div>

                <DocumentSelector />
            </main>
        </div>
    );
}
