import { Groq } from "groq-sdk";
import { z } from "zod";
import { DOCUMENT_TYPES, type DocumentType, DOCUMENT_TYPE_LABELS } from "@/types";
import { getTemplate } from "@/lib/templates";

if (!process.env.GROQ_API_KEY) {
    console.warn("[chat/form-assist] GROQ_API_KEY is not set.");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

const requestSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
    })).min(1),
    documentType: z.enum(DOCUMENT_TYPES),
    currentFormData: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

function buildFormAssistSystemPrompt(docType: DocumentType, currentFormData?: Record<string, string | number | boolean>): string {
    const template = getTemplate(docType);
    const typeLabel = DOCUMENT_TYPE_LABELS[docType];

    const fieldDescriptions = template.fields.map((f, i) => {
        let desc = `${i + 1}. "${f.name}" (${f.label}) — type: ${f.type}`;
        if (f.required) desc += " [REQUIRED]";
        if (f.options) desc += ` — options: ${f.options.map(o => `"${o.value}" = ${o.label}`).join(", ")}`;
        if (f.description) desc += ` — hint: ${f.description}`;
        return desc;
    }).join("\n");

    const partyFields = template.isTwoParty
        ? `**Party Fields (always present for two-party docs):**
- "partyA_name" — Full name/organisation of Party A [REQUIRED]
- "partyA_signatory" — Name of person signing for Party A [REQUIRED]
- "partyA_address" — Full legal address of Party A
- "partyB_name" — Full name/organisation of Party B [REQUIRED]
- "partyB_signatory" — Name of person signing for Party B
- "partyB_address" — Full legal address of Party B`
        : `**Party Fields:**
- "partyA_name" — Full name/organisation [REQUIRED]
- "partyA_signatory" — Name of signatory [REQUIRED]
- "partyA_address" — Full legal address`;

    const currentDataSection = currentFormData && Object.keys(currentFormData).length > 0
        ? `\n**Currently Filled Fields:**\n${Object.entries(currentFormData)
            .filter(([, v]) => v !== "" && v !== false && v !== 0)
            .map(([k, v]) => `- ${k}: ${v}`)
            .join("\n") || "(none filled yet)"}`
        : "\n**Currently Filled Fields:** (none filled yet)";

    return `You are a helpful form-filling assistant for ClauseWala., an AI-powered legal document generation platform.

**Your Role:** Help the user fill out a ${typeLabel} form by understanding their situation and suggesting appropriate field values. You are conversational, smart, and efficient.

**Document Type:** ${typeLabel}
**Description:** ${template.description}

${partyFields}

**Common Fields:**
- "effectiveDate" — When the agreement starts (YYYY-MM-DD format) [REQUIRED]

**Document-Specific Fields:**
${fieldDescriptions}
${currentDataSection}

**RULES:**
1. When the user describes their situation, extract field values and return them as a JSON block.
2. ALWAYS respond with a mix of:
   - A brief, friendly explanation of what you understood and what you're filling
   - A JSON block with the field values wrapped in \`\`\`json ... \`\`\` fences
3. The JSON block format MUST be: { "fields": { "fieldName": "value", ... } }
4. Only include fields you are confident about. Don't guess wildly.
5. For select fields, use the exact option VALUE (not the label).
6. For checkbox fields, use true/false.
7. For date fields, use YYYY-MM-DD format.
8. If the user's input is ambiguous, ask a focused clarifying question (max 1-2 questions at a time).
9. If the user asks "what fields are left?" or "what do I need?", list the unfilled required fields.
10. Keep responses concise — under 150 words for the explanation part.
11. If the user says something like "fill everything" or "help me fill this", ask about the core situation first:
    - Who are the parties?
    - What's the purpose/context?
    - Any specific requirements?

**EXAMPLES:**

User: "I need an NDA for my employee John who works as a developer"
Response: Got it — an employment NDA. Here's what I've extracted:

\`\`\`json
{ "fields": { "partyB_name": "John", "relationshipType": "employee", "disclosureType": "unilateral" } }
\`\`\`

I'll still need: Party A details (your company name, address), jurisdiction, and agreement duration. Could you share those?

User: "My company is Acme Corp, based in Bangalore"
Response: Perfect!

\`\`\`json
{ "fields": { "partyA_name": "Acme Corp", "partyA_address": "Bangalore", "jurisdiction": "India" } }
\`\`\`

Still need: signatory name and agreement terms (duration, confidentiality period, dispute resolution).`;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = requestSchema.safeParse(body);

        if (!parsed.success) {
            return new Response(
                JSON.stringify({ error: "Invalid request", details: parsed.error.flatten() }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { messages, documentType, currentFormData } = parsed.data;
        const systemPrompt = buildFormAssistSystemPrompt(documentType, currentFormData);

        const stream = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...messages.map(m => ({ role: m.role as "user" | "assistant" | "system", content: m.content })),
            ],
            model: MODEL,
            temperature: 0.3,
            stream: true,
        });

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
                } catch (streamError: any) {
                    console.error("[chat/form-assist] Stream error:", streamError);
                    const isRateLimit = streamError?.status === 429 || streamError?.message?.includes("rate limit");
                    controller.enqueue(
                        encoder.encode(
                            isRateLimit 
                                ? "\n\n[Error: API rate limit exceeded. Please wait a moment and try again.]" 
                                : "\n\n[Error: AI stream interrupted.]"
                        )
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
    } catch (error: any) {
        console.error("[chat/form-assist] POST error:", error);
        const isRateLimit = error?.status === 429 || error?.message?.includes("rate limit");
        const message = isRateLimit 
            ? "API rate limit exceeded. Please wait a moment and try again." 
            : (error instanceof Error ? error.message : "An unexpected error occurred");
        
        return new Response(
            JSON.stringify({ error: message }),
            { status: isRateLimit ? 429 : 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
