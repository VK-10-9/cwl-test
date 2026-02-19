import type { DocumentTemplate, DocumentType } from "@/types";
import { ndaTemplate } from "./nda";
import { mouTemplate } from "./mou";
import { requestLetterTemplate } from "./request-letter";
import { internshipCertTemplate } from "./internship-cert";
import { sponsorshipLetterTemplate } from "./sponsorship-letter";

export const templates: Record<DocumentType, DocumentTemplate> = {
    nda: ndaTemplate,
    mou: mouTemplate,
    "request-letter": requestLetterTemplate,
    "internship-cert": internshipCertTemplate,
    "sponsorship-letter": sponsorshipLetterTemplate,
};

export function getTemplate(type: DocumentType): DocumentTemplate {
    return templates[type];
}

export { ndaTemplate, mouTemplate, requestLetterTemplate, internshipCertTemplate, sponsorshipLetterTemplate };
