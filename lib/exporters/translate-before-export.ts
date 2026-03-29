import { translateText } from "@/lib/bhashini";

export async function prepareDocumentForExport(
    documentText: string,
    targetLanguage: string
): Promise<string> {
    if (targetLanguage === "en" || !targetLanguage) {
        return documentText;
    }

    try {
        // Translation works best on blocks rather than splitting heavily manually, 
        // Bhashini pipeline handles reasonable chunk sizes.
        return await translateText(documentText, "en", targetLanguage);
    } catch (error) {
        console.error("Translation during export failed:", error);
        // Fallback — return original English
        return documentText;
    }
}
