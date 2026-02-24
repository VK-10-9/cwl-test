import { DocumentTemplate } from "@/types";

export const gpaTemplate: DocumentTemplate = {
    type: "gpa",
    label: "General Power of Attorney",
    description: "Delegate authorized signatory powers legally for banking, government filings, or property matters.",
    isTwoParty: true,
    fields: [
        {
            name: "attorneyName",
            label: "Attorney (Authorized Person) Name",
            type: "text",
            required: true
        },
        {
            name: "scopeOfPowers",
            label: "Scope of Powers",
            type: "textarea",
            required: true,
            placeholder: "e.g. Authorized to sign banking documents and ROC filings."
        }
    ],
    defaultClauses: [
        "Preamble and Identification",
        "Grant of Powers",
        "Specific Acts Authorized (Banking, Legal, Govt)",
        "Right to Appoint Sub-Attorney",
        "Ratification of Acts",
        "Duration and Revocation",
        "Indemnity for Acts Done in Good Faith",
        "Signature and Witnesses"
    ]
};
