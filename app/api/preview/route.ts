import { NextRequest, NextResponse } from "next/server";
import { previewSchema, OrganisationData } from "@/types";
import { expandDocument } from "@/lib/ai";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = previewSchema.safeParse(body);

        if (!parsed.success) {
            console.error("Preview validation errors:", JSON.stringify(parsed.error.issues, null, 2));
            return NextResponse.json({ error: "Invalid request", details: parsed.error.issues }, { status: 400 });
        }

        const { blueprint, formData: rawFormData } = parsed.data;
        const formData = rawFormData as Record<string, string | number | boolean>;

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

        const fullText = await expandDocument(
            blueprint.documentType,
            orgAReconstructed,
            orgBReconstructed,
            formData,
            blueprint.clauses
        );

        return NextResponse.json({ fullText });

    } catch (error) {
        console.error("Preview error:", error);
        return NextResponse.json({ error: "Failed to generate preview" }, { status: 500 });
    }
}
