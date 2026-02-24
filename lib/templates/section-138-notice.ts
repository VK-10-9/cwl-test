import { DocumentTemplate } from "@/types";

export const section138NoticeTemplate: DocumentTemplate = {
    type: "section-138-notice",
    label: "Section 138 Notice (Cheque Bounce)",
    description: "Statutory notice required before initiating criminal proceedings for cheque dishonour.",
    isTwoParty: true,
    fields: [
        {
            name: "chequeNumber",
            label: "Cheque Number",
            type: "text",
            required: true,
            placeholder: "e.g. 123456"
        },
        {
            name: "chequeDate",
            label: "Cheque Date",
            type: "date",
            required: true
        },
        {
            name: "chequeAmount",
            label: "Cheque Amount (INR)",
            type: "number",
            required: true
        },
        {
            name: "dishonourDate",
            label: "Date of Dishonour (from Bank Memo)",
            type: "date",
            required: true
        },
        {
            name: "dishonourReason",
            label: "Reason for Dishonour",
            type: "select",
            required: true,
            options: [
                { label: "Funds Insufficient", value: "insufficient_funds" },
                { label: "Stop Payment", value: "stop_payment" },
                { label: "Account Closed", value: "account_closed" },
                { label: "Signature Mismatch", value: "signature_mismatch" }
            ]
        }
    ],
    defaultClauses: [
        "Description of Parties",
        "Transaction Background",
        "Issuance of Cheque",
        "Presentation and Dishonour",
        "Statutory Demand for Payment",
        "15-Day Cure Period Notice",
        "Warning of Criminal Proceedings",
        "Jurisdiction and Governing Law"
    ]
};
