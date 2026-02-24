import { DocumentTemplate } from "@/types";

export const ethicsCodeTemplate: DocumentTemplate = {
    type: "ethics-code",
    label: "Code of Conduct",
    description: "Corporate ethics and professional code of conduct for employees and management.",
    isTwoParty: false,
    fields: [
        {
            name: "effectiveDate",
            label: "Effective Date",
            type: "date",
            required: true
        },
        {
            name: "complianceOfficer",
            label: "Compliance Officer Designation",
            type: "text",
            required: true,
            placeholder: "e.g. Head of HR"
        }
    ],
    defaultClauses: [
        "Core Values and Principles",
        "Conflict of Interest",
        "Confidentiality and Privacy",
        "Bribery and Anti-Corruption",
        "Equality and Non-Discrimination",
        "Use of Company Assets",
        "Health and Safety",
        "Reporting Violations (Whistleblower)",
        "Disciplinary Actions",
        "Periodic Review and Amendments"
    ]
};
