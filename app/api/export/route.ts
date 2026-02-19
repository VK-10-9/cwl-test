import { NextRequest, NextResponse } from "next/server";
import { exportRequestSchema, OrganisationData } from "@/types";
import { expandDocument } from "@/lib/ai";
import { generatePdf, textToHtml } from "@/lib/exporters/pdf";
import { generateDocx } from "@/lib/exporters/docx";

export const maxDuration = 60; // Extend timeout for generation

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = exportRequestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid request data", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { blueprint, formData: rawFormData, format, fullText: providedText } = parsed.data;
        const formData = rawFormData as Record<string, string | number | boolean>;

        let fullText = providedText;

        if (!fullText) {
            // Reconstruct Org Data (Stateless)
            const orgAReconstructed: OrganisationData = {
                name: String(formData["Party A Name"] || formData["Company Name"] || "Party A"),
                address: String(formData["Party A Address"] || formData["Address"] || ""),
                signatoryName: String(formData["Party A Signatory"] || formData["Signatory Name"] || "")
            };

            const orgBReconstructed: OrganisationData | undefined = formData["Party B Name"]
                ? {
                    name: String(formData["Party B Name"]),
                    address: String(formData["Party B Address"] || ""),
                    signatoryName: String(formData["Party B Signatory"] || "")
                }
                : undefined;

            fullText = await expandDocument(
                blueprint.documentType,
                orgAReconstructed,
                orgBReconstructed,
                formData,
                blueprint.clauses
            );
        }

        // Generate the export file
        let fileBuffer: Buffer;
        let contentType: string;
        let fileName: string;

        if (format === "pdf") {
            const html = textToHtml(fullText);
            fileBuffer = await generatePdf(html);
            contentType = "application/pdf";
            fileName = `${blueprint.documentType}-export.pdf`;
        } else {
            fileBuffer = await generateDocx(fullText);
            contentType =
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            fileName = `${blueprint.documentType}-export.docx`;
        }

        return new NextResponse(new Uint8Array(fileBuffer), {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="${fileName}"`,
            },
        });
    } catch (error) {
        console.error("Export API error:", error);
        const message =
            error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
