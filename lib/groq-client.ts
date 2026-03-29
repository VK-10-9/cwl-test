import Groq from "groq-sdk";

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "missing" });

interface GroqCallOptions {
    messages: { role: "system" | "user" | "assistant"; content: string }[];
    model?: string;
    maxRetries?: number;
    temperature?: number;
}

export class GroqError extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message);
        this.name = "GroqError";
    }
}

export async function groqCall({
    messages,
    model = "meta-llama/llama-4-scout-17b-16e-instruct",
    maxRetries = 3,
    temperature = 0.3,
}: GroqCallOptions): Promise<string> {
    let lastError: any = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await groq.chat.completions.create({
                model,
                temperature,
                max_tokens: 4096,
                messages,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) throw new Error("Empty response from Groq");

            return content;
        } catch (error: any) {
            lastError = error;

            console.error(`[groq-client] Error on attempt ${attempt}:`, error?.message);

            // Rate limit — wait and retry
            if (error?.status === 429) {
                const waitMs = Math.pow(2, attempt) * 1000; // exponential backoff
                console.warn(`Groq rate limit hit. Retrying in ${waitMs}ms...`);
                await new Promise((res) => setTimeout(res, waitMs));
                continue;
            }

            // Non-retryable errors — fail immediately
            if (error?.status === 400 || error?.status === 401) {
                // Sentry.captureException(error, { tags: { service: "groq", attempt: String(attempt) } });
                throw new GroqError("Invalid request or API key for AI service", error.status);
            }

            // Server error — retry
            if (error?.status >= 500) {
                console.warn(`Groq server error (${error.status}). Attempt ${attempt}/${maxRetries}`);
                await new Promise((res) => setTimeout(res, 1500 * attempt));
                continue;
            }

            // Unknown error
            // Sentry.captureException(error);
            throw error;
        }
    }

    // All retries exhausted
    // Sentry.captureException(lastError, { tags: { service: "groq", retries_exhausted: "true" } });
    throw new GroqError("AI service temporarily unavailable. Please try again in a moment.", 503);
}
