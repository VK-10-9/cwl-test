import { NextRequest, NextResponse } from "next/server";
import { generateRequestSchema } from "@/types";
import { generateBlueprint } from "@/lib/ai";
import { createGeneratedReport, isSupabaseConfigured } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = generateRequestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid request data", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { documentType, orgA, orgB, formData, userEmail } = parsed.data;

        // Generate blueprint (Stateless - no DB storage)
        const blueprint = await generateBlueprint(
            documentType,
            orgA,
            orgB,
            formData
        );

        const highRiskCount = blueprint.clauses.filter((c) => c.included && c.risk === "high").length;
        const mediumRiskCount = blueprint.clauses.filter((c) => c.included && c.risk === "medium").length;
        const lowRiskCount = blueprint.clauses.filter((c) => c.included && c.risk === "low").length;

        let reportId: string | null = null;
        if (isSupabaseConfigured()) {
            try {
                reportId = await createGeneratedReport({
                    userEmail,
                    documentType,
                    reportTitle: blueprint.title,
                    status: "blueprint_generated",
                    clauseCount: blueprint.clauses.length,
                    highRiskCount,
                    mediumRiskCount,
                    lowRiskCount,
                    formData,
                    blueprint,
                });
            } catch (storeError) {
                console.error("Failed to store generated report:", storeError);
            }
        }

        return NextResponse.json({
            documentId: "stateless-temp-id",
            reportId,
            blueprint,
        });
    } catch (error) {
        console.error("Generate API error:", error);
        const message =
            error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
