import DocumentSelector from "@/components/DocumentSelector";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SelectionPage() {
    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/20">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 sm:px-8 pt-28 md:pt-36 pb-24 relative z-10">
                <div className="text-center mb-14 animate-fade-in">
                    <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">Templates</p>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4 text-foreground">
                        What do you need drafted?
                    </h1>
                    <p className="text-muted-foreground text-[15px] max-w-lg mx-auto leading-relaxed">
                        Pick a template and ClauseWala will generate a clause-by-clause blueprint, then produce a ready-to-sign document.
                    </p>
                </div>

                <DocumentSelector />
            </main>

            <Footer />
        </div>
    );
}
