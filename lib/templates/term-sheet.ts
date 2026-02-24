import { DocumentTemplate } from "@/types";

export const termSheetTemplate: DocumentTemplate = {
    type: "term-sheet",
    label: "Investment Term Sheet",
    description: "A summary of key terms for a proposed investment, used as a precursor to definitive agreements.",
    isTwoParty: true,
    fields: [
        {
            name: "preMoneyValuation",
            label: "Pre-Money Valuation (INR)",
            type: "number",
            required: true,
            placeholder: "e.g. 100000000"
        },
        {
            name: "investmentAmount",
            label: "Total Investment (INR)",
            type: "number",
            required: true,
            placeholder: "e.g. 20000000"
        },
        {
            name: "exclusivityPeriod",
            label: "Exclusivity Period (Days)",
            type: "number",
            required: true,
            placeholder: "e.g. 45"
        },
        {
            name: "instrumentType",
            label: "Investment Instrument",
            type: "select",
            required: true,
            options: [
                { label: "Equity Shares", value: "equity" },
                { label: "CCPS (Compulsorily Convertible Preference Shares)", value: "ccps" },
                { label: "CCD (Compulsorily Convertible Debentures)", value: "ccd" }
            ]
        }
    ],
    defaultClauses: [
        "Binding vs Non-Binding Nature",
        "Valuation and Capitalization",
        "Board of Directors",
        "Veto Rights (Reserved Matters)",
        "Dividends and Liquidation Preference",
        "Anti-Dilution Protection",
        "Exit Obligations",
        "Exclusivity and Confidentiality",
        "Due Diligence Requirements",
        "Expiry and Termination"
    ]
};
