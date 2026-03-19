import { DocumentTemplate } from "@/types";

export const genericMarketingTemplate: DocumentTemplate = {
    type: "affiliate-agreement",
    label: "Marketing/Affiliate Agreement",
    description: "Multi-purpose marketing, affiliate, or sponsorship agreement.",
    isTwoParty: true,
    fields: [
        {
            name: "campaignType",
            label: "Campaign / Partnership Type",
            type: "select",
            required: true,
            options: [
                { label: "Affiliate Program", value: "affiliate" },
                { label: "Sponsorship", value: "sponsorship" },
                { label: "Referral Program", value: "referral" }
            ]
        },
        {
            name: "commissionStructure",
            label: "Commission / Fee Structure",
            type: "textarea",
            required: true,
            placeholder: "e.g. 10% of revenue or ₹5k flat fee."
        }
    ],
    defaultClauses: [
        "Engagement and Purpose",
        "Obligations of the Partner",
        "Branding and Trademark Usage",
        "Commission and Payment Terms",
        "Reporting and Tracking",
        "Term and Termination",
        "Confidentiality",
        "Governing Law"
    ]
};
