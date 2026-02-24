import { DocumentTemplate } from "@/types";

export const dataBreachNoticeTemplate: DocumentTemplate = {
    type: "data-breach-notice",
    label: "Data Breach Notification",
    description: "Statutory notification to be sent to users or regulators in case of a data breach, compliant with DPDP Act 2023.",
    isTwoParty: false,
    fields: [
        {
            name: "breachDate",
            label: "Estimated Date of Breach",
            type: "date",
            required: true
        },
        {
            name: "natureOfData",
            label: "Nature of Data Compromised",
            type: "textarea",
            required: true,
            placeholder: "e.g. Email addresses, phone numbers, transaction history."
        },
        {
            name: "remedialAction",
            label: "Remedial Actions Taken",
            type: "textarea",
            required: true,
            placeholder: "e.g. Resetting passwords, patching servers."
        }
    ],
    defaultClauses: [
        "Notification Purpose",
        "Details of the Incident",
        "Types of Information Involved",
        "Risk Assessment and Potential Impact",
        "Actions Taken by the Company",
        "Recommended Actions for Users",
        "Contact Information for Inquiries",
        "Commitment to Privacy and Security"
    ]
};
