import GeneratorFlow from "@/components/generator/GeneratorFlow";
import Navbar from "@/components/Navbar";
import { DOCUMENT_TYPE_LABELS, DocumentType } from "@/types";

interface GeneratePageProps {
    params: Promise<{
        docType: string;
    }>;
}

export default async function GeneratePage({ params }: GeneratePageProps) {
    const { docType } = await params;
    const label = DOCUMENT_TYPE_LABELS[docType as DocumentType] || docType;

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/40 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-900/30 rounded-full blur-[150px]" />
            </div>

            <Navbar />

            <main className="relative z-10 pt-24 pb-20 container mx-auto px-4">
                <div className="text-center mb-10 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                        Drafting <span className="text-primary">{label}</span>
                    </h1>
                    <p className="text-muted-foreground">Complete the steps below to generate your document.</p>
                </div>

                <GeneratorFlow docType={docType as DocumentType} />
            </main>
        </div>
    );
}
