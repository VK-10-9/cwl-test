import DocumentSelector from "@/components/DocumentSelector";
import Navbar from "@/components/Navbar";

export default function SelectionPage() {
    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/20">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-20 relative z-10">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
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
