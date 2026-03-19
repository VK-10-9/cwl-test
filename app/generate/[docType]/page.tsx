import GeneratorFlow from "@/components/generator/GeneratorFlow";
import Navbar from "@/components/Navbar";
import { DOCUMENT_TYPE_LABELS, DOCUMENT_TYPE_ICONS, DocumentType } from "@/types";

interface GeneratePageProps {
    params: Promise<{
        docType: string;
    }>;
}

export default async function GeneratePage({ params }: GeneratePageProps) {
    const { docType } = await params;
    const label = DOCUMENT_TYPE_LABELS[docType as DocumentType] || docType;
    const icon = DOCUMENT_TYPE_ICONS[docType as DocumentType] || "📄";

    return (
        <div className="min-h-screen bg-background relative">
            <Navbar />

            <main className="relative z-10 pt-28 md:pt-32 pb-24 max-w-5xl mx-auto px-6 sm:px-8">
                <div className="text-center mb-10 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/60 text-[11px] font-mono text-muted-foreground mb-5">
                        <span>{icon}</span>
                        <span className="uppercase tracking-[0.15em]">{docType.replace("-", " ")}</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
                        Drafting <span className="text-foreground">{label}</span>
                    </h1>
                    <p className="text-muted-foreground text-[13px] max-w-sm mx-auto leading-relaxed">
                        Complete the steps below to generate your document.
                    </p>
                </div>

                <GeneratorFlow docType={docType as DocumentType} />
            </main>
        </div>
    );
}
