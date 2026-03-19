import { DocumentTemplate } from "@/types";

export const influencerAgreementTemplate: DocumentTemplate = {
    type: "influencer-agreement",
    label: "Influencer Marketing Agreement",
    description: "Terms for social media collaborations, usage rights, and performance metrics.",
    isTwoParty: true,
    fields: [
        {
            name: "campaignName",
            label: "Campaign Name",
            type: "text",
            required: true,
            placeholder: "e.g. Summer Launch 2024"
        },
        {
            name: "deliverables",
            label: "Deliverables Description",
            type: "textarea",
            required: true,
            placeholder: "e.g. 2 Reels, 1 Story with link, 1 Static post"
        },
        {
            name: "influencerFee",
            label: "Total Fee (INR)",
            type: "number",
            required: true,
            placeholder: "e.g. 50000"
        },
        {
            name: "usageRightsDuration",
            label: "Usage Rights Duration (Months)",
            type: "number",
            required: true,
            placeholder: "e.g. 12"
        },
        {
            name: "exclusivity",
            label: "Exclusivity Period (Days)",
            type: "number",
            required: false,
            placeholder: "e.g. 30"
        }
    ],
    defaultClauses: [
        "Engagement and Services",
        "Deliverables and Approval Process",
        "Fees and Payment Schedule",
        "Intellectual Property and Usage Rights",
        "Content Standards and Guidelines",
        "Exclusivity and Non-Compete",
        "Confidentiality",
        "Term and Termination",
        "Representations and Warranties",
        "Indemnification and Liability",
        "Governing Law and Jurisdiction"
    ]
};
