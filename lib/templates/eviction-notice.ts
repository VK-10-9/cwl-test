import { DocumentTemplate } from "@/types";

export const evictionNoticeTemplate: DocumentTemplate = {
    type: "eviction-notice",
    label: "Eviction Notice",
    description: "Formal legal notice to vacate premises due to breach of agreement.",
    isTwoParty: true,
    fields: [
        {
            name: "reasonForEviction",
            label: "Reason for Eviction",
            type: "textarea",
            required: true,
            placeholder: "e.g. Non-payment of rent for 3 months."
        },
        {
            name: "vacateDeadline",
            label: "Deadline to Vacate (Days)",
            type: "number",
            required: true,
            placeholder: "e.g. 15"
        }
    ],
    defaultClauses: [
        "Reference to Rent/Lease Agreement",
        "Nature of Default/Breach",
        "Previous Reminders and Notices",
        "Termination of Agreement",
        "Demand to Vacate and Handover Possession",
        "Final Dues and Adjustments",
        "Warning of Legal Action/Eviction Suit",
        "Jurisdiction"
    ]
};
