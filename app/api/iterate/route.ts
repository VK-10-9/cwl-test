import { NextRequest, NextResponse } from "next/server";
import { iterateRequestSchema } from "@/types";
import { iterateBlueprint } from "@/lib/ai";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = iterateRequestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid request data", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { blueprint, message } = parsed.data;

        // Call AI to iterate (stateless)
        const result = await iterateBlueprint(blueprint, message);

        return NextResponse.json({
            blueprint: result.blueprint,
            aiMessage: result.aiMessage,
        });
    } catch (error) {
        console.error("Iterate API error:", error);
        const message =
            error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
