import { NextRequest, NextResponse } from "next/server";
import { generateRequestSchema } from "@/types";
import { generateBlueprint } from "@/lib/ai";

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

        const { documentType, orgA, orgB, formData } = parsed.data;

        // Generate blueprint (Stateless - no DB storage)
        const blueprint = await generateBlueprint(
            documentType,
            orgA,
            orgB,
            formData
        );

        return NextResponse.json({
            documentId: "stateless-temp-id",
            blueprint,
        });
    } catch (error) {
        console.error("Generate API error:", error);
        const message =
            error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
