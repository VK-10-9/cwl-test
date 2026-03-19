import { DocumentTemplate } from "@/types";

export const whiteLabelTemplate: DocumentTemplate = {
    type: "white-label-agreement",
    label: "White-Label Agreement",
    description: "Terms for reselling and rebranding technology including IP rights and support obligations.",
    isTwoParty: true,
    fields: [
        {
            name: "techDescription",
            label: "Technology Description",
            type: "text",
            required: true
        },
        {
            name: "brandingRights",
            label: "Branding/White-Labeling Rights",
            type: "textarea",
            required: true,
            placeholder: "e.g. Permission to rebrand as Partner's own product."
        }
    ],
    defaultClauses: [
        "License Grant and Rebranding Rights",
        "Ownership of Intellectual Property",
        "Technical Support and Maintenance",
        "Fees, Royalties and Payment",
        "Confidentiality",
        "Term and Termination",
        "Warranty and Liability",
        "Governing Law"
    ]
};
