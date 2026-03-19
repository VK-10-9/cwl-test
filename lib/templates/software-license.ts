import { DocumentTemplate } from "@/types";

export const softwareLicenseTemplate: DocumentTemplate = {
    type: "software-license",
    label: "Software Licensing Agreement",
    description: "Terms for on-premise or perpetual software licensing, including source code access and usage limits.",
    isTwoParty: true,
    fields: [
        {
            name: "softwareName",
            label: "Name of the Software",
            type: "text",
            required: true
        },
        {
            name: "licenseType",
            label: "License Type",
            type: "select",
            required: true,
            options: [
                { label: "Perpetual", value: "perpetual" },
                { label: "Limited Period", value: "limited" },
                { label: "Subscription-based", value: "subscription" }
            ]
        },
        {
            name: "scopeOfLicense",
            label: "Scope (e.g. Internal Use only)",
            type: "textarea",
            required: true
        },
        {
            name: "licenseFee",
            label: "License Fee (INR)",
            type: "number",
            required: true
        }
    ],
    defaultClauses: [
        "Definitions and License Grant",
        "Restrictions on Use",
        "Source Code vs Object Code",
        "Proprietary Rights and IP Ownership",
        "License Fees and Payment",
        "Warranties and Disclaimers",
        "Indemnification",
        "Termination and Consequences",
        "Governing Law and Jurisdiction"
    ]
};
