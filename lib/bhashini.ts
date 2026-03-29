export const BHASHINI_PIPELINE_URL = "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline";

// Step 1: Get pipeline config for en → targetLang translation
export async function getBhashiniPipeline(sourceLang: string, targetLang: string) {
    if (process.env.NEXT_PUBLIC_MOCK_MODE === "true") {
        return { mock: true };
    }
    if (!process.env.BHASHINI_USER_ID || !process.env.BHASHINI_API_KEY) {
        throw new Error("Missing Bhashini credentials in environment variables.");
    }

    const response = await fetch(BHASHINI_PIPELINE_URL, {
        method: "POST",
        headers: {
            userID: process.env.BHASHINI_USER_ID,
            ulcaApiKey: process.env.BHASHINI_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            pipelineTasks: [{ taskType: "translation", config: { language: { sourceLanguage: sourceLang, targetLanguage: targetLang } } }],
            pipelineRequestConfig: { pipelineId: "64392f96daac500b55c543cd" },
        }),
    });

    if (!response.ok) throw new Error("Bhashini pipeline fetch failed. Check credentials.");
    return response.json();
}

// Step 2: Translate text using the pipeline — with chunking for large legal docs
export async function translateText(text: string, sourceLang: string = "en", targetLang: string = "hi"): Promise<string> {
    if (!text || targetLang === sourceLang) return text;

    try {
        const pipeline = await getBhashiniPipeline(sourceLang, targetLang);
        const serviceId = pipeline?.pipelineResponseConfig?.[0]?.config?.[0]?.serviceId;
        const callbackUrl = pipeline?.pipelineInferenceAPIEndPoint?.callbackUrl;
        const authKey = pipeline?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value;
        const authName = pipeline?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.name;

        if (!serviceId || !callbackUrl || !authKey) {
            console.error("Missing critical Bhashini pipeline parameters");
            return text;
        }

        // Bhashini handles small chunks better (~2000 chars max recommended per call)
        // Split by paragraph first
        const paragraphs = text.split(/\n\n+/);
        const chunks: string[] = [];
        let currentChunk = "";

        for (const p of paragraphs) {
            if ((currentChunk.length + p.length) > 1800) {
                if (currentChunk) chunks.push(currentChunk);
                currentChunk = p;
            } else {
                currentChunk = currentChunk ? `${currentChunk}\n\n${p}` : p;
            }
        }
        if (currentChunk) chunks.push(currentChunk);

        const translatedChunks = await Promise.all(
            chunks.map(async (chunk) => {
                const computeResponse = await fetch(callbackUrl, {
                    method: "POST",
                    headers: {
                        [authName]: authKey,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        pipelineTasks: [
                            {
                                taskType: "translation",
                                config: {
                                    language: { sourceLanguage: sourceLang, targetLanguage: targetLang },
                                    serviceId,
                                },
                            },
                        ],
                        inputData: {
                            input: [{ source: chunk }],
                        },
                    }),
                });

                if (!computeResponse.ok) throw new Error("Bhashini translation compute failed");
                const result = await computeResponse.json();
                return result?.pipelineResponse?.[0]?.output?.[0]?.target ?? chunk;
            })
        );

        return translatedChunks.join("\n\n");
    } catch (e) {
        console.error("Bhashini translation error:", e);
        return text; // Fail softly
    }
}

export async function translateToHindi(text: string): Promise<string> {
    return translateText(text, "en", "hi");
}
