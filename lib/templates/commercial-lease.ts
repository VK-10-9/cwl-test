import { DocumentTemplate } from "@/types";

export const commercialLeaseTemplate: DocumentTemplate = {
    type: "commercial-lease",
    label: "Commercial Lease Deed",
    description: "Lease deed for office or commercial spaces, including lock-in periods and escalations.",
    isTwoParty: true,
    fields: [
        {
            name: "officeSpaceDetails",
            label: "Office Space / Building Details",
            type: "textarea",
            required: true,
            placeholder: "e.g. Unit 501, Prestige Tech Park, Outer Ring Road, Bangalore"
        },
        {
            name: "leaseTerm",
            label: "Lease Term (Years)",
            type: "number",
            required: true,
            placeholder: "e.g. 5"
        },
        {
            name: "monthlyRent",
            label: "Monthly Rent (INR)",
            type: "number",
            required: true
        },
        {
            name: "lockInPeriod",
            label: "Lock-in Period (Months)",
            type: "number",
            required: true,
            placeholder: "e.g. 12"
        },
        {
            name: "fitOutPeriod",
            label: "Fit-out Period (Days)",
            type: "number",
            required: false,
            placeholder: "e.g. 30"
        }
    ],
    defaultClauses: [
        "Demised Premises and Term",
        "Rent, Security Deposit and Taxes",
        "Lock-in Period and Early Termination",
        "Fit-out and Construction Rights",
        "Use of Premises",
        "Common Area Maintenance (CAM)",
        "Statutory Compliance and Insurance",
        "Sub-leasing Restrictions",
        "Indemnification",
        "Dispute Resolution and Arbitration"
    ]
};
