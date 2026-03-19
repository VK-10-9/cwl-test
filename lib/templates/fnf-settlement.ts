import { DocumentTemplate } from "@/types";

export const fnfSettlementTemplate: DocumentTemplate = {
    type: "fnf-settlement",
    label: "F&F Settlement Deed",
    description: "Final waiver and settlement deed signed by departing employees to confirm receipt of dues and waive future claims.",
    isTwoParty: true,
    fields: [
        {
            name: "totalSettlementAmount",
            label: "Total Settlement Amount (INR)",
            type: "number",
            required: true
        },
        {
            name: "lastWorkingDate",
            label: "Last Working Date",
            type: "date",
            required: true
        },
        {
            name: "resignationDate",
            label: "Resignation/Termination Date",
            type: "date",
            required: true
        }
    ],
    defaultClauses: [
        "Preamble and Employment History",
        "Confirmation of Resignation/Termination",
        "Breakdown of Final Dues",
        "Full and Final Payment Confirmation",
        "Return of Company Property",
        "Confidentiality and IP Obligations Reminder",
        "Waiver of Future Claims and Litigation",
        "Non-Disparagement Covenant",
        "Binding Nature and Governing Law"
    ]
};
