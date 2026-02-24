import { DocumentTemplate } from "@/types";

export const saasAgreementTemplate: DocumentTemplate = {
    type: "saas-agreement",
    label: "SaaS Subscription Agreement",
    description: "Specific terms for cloud-based software subscriptions, data uptime, and user seats.",
    isTwoParty: true,
    fields: [
        {
            name: "serviceDescription",
            label: "Brief Description of SaaS Platform",
            type: "text",
            required: true,
            placeholder: "e.g. AI-powered document generation platform"
        },
        {
            name: "subscriptionFees",
            label: "Subscription Fees",
            type: "text",
            required: true,
            placeholder: "e.g. ₹5,000 per user per month"
        },
        {
            name: "uptimeSLA",
            label: "Guaranteed Uptime (%)",
            type: "number",
            required: false,
            placeholder: "e.g. 99.9"
        },
        {
            name: "dataBackupFrequency",
            label: "Data Backup Frequency",
            type: "select",
            required: true,
            options: [
                { label: "Daily", value: "daily" },
                { label: "Weekly", value: "weekly" },
                { label: "Real-time", value: "real-time" }
            ]
        },
        {
            name: "includeSupport",
            label: "Include Standard Support?",
            type: "checkbox",
            required: false
        }
    ],
    defaultClauses: [
        "SaaS Services and Support",
        "Restrictions and Responsibilities",
        "Confidentiality and Proprietary Rights",
        "Payment of Fees",
        "Term and Termination",
        "Warranty and Disclaimer",
        "Service Level Agreement (SLA)",
        "Data Privacy and Security (DPDP Act 2023)",
        "Limitation of Liability",
        "Miscellaneous and Governing Law"
    ]
};
