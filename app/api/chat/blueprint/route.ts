import { Groq } from "groq-sdk";
import { buildIterationPrompt } from "@/lib/prompts";
import { DocumentType, DOCUMENT_TYPES } from "@/types";
import { z } from "zod";

// Validate env at startup — fail loudly, not silently
if (!process.env.GROQ_API_KEY) {
    console.warn("[chat/blueprint] GROQ_API_KEY is not set. AI calls will fail.");
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

// Input validation schema — inline blueprint shape to avoid import-ordering issues
const chatRequestSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
    })).min(1, "At least one message is required"),
    currentBlueprint: z.object({
        title: z.string().optional(),
        documentType: z.enum(DOCUMENT_TYPES),
        clauses: z.array(z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            content: z.string().optional(),
            included: z.boolean(),
            risk: z.enum(["low", "medium", "high"]),
        })),
        summary: z.string(),
    }),
    documentType: z.enum(DOCUMENT_TYPES).optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = chatRequestSchema.safeParse(body);

        if (!parsed.success) {
            return new Response(
                JSON.stringify({ error: "Invalid request", details: parsed.error.flatten() }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { messages, currentBlueprint, documentType } = parsed.data;
        const lastMessage = messages[messages.length - 1];
        const docType = (documentType || currentBlueprint.documentType || "nda") as DocumentType;

        const systemPrompt = buildIterationPrompt(
            docType,
            currentBlueprint.clauses,
            lastMessage.content
        );

        const stream = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: lastMessage.content },
            ],
            model: MODEL,
            temperature: 0.2,
            stream: true,
        });

        // Return as SSE-compatible text stream for @ai-sdk/react useChat
        const readableStream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();

                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                } catch (streamError) {
                    console.error("[chat/blueprint] Stream error:", streamError);
                    controller.enqueue(
                        encoder.encode("\n\n[Error: AI stream interrupted. Please try again.]")
                    );
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
            },
        });
    } catch (error) {
        console.error("[chat/blueprint] POST error:", error);
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(
            JSON.stringify({ error: message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
