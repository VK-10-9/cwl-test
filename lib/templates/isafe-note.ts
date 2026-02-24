import { DocumentTemplate } from "@/types";

export const isafeNoteTemplate: DocumentTemplate = {
    type: "isafe-note",
    label: "iSAFE Note (Startup Funding)",
    description: "India Simple Agreement for Future Equity — a high-speed fundraising instrument for startups.",
    isTwoParty: true,
    fields: [
        {
            name: "investmentAmount",
            label: "Investment Amount (INR)",
            type: "number",
            placeholder: "e.g. 1000000",
            required: true,
            description: "The total amount the investor is providing."
        },
        {
            name: "valuationCap",
            label: "Valuation Cap (INR)",
            type: "number",
            placeholder: "e.g. 50000000",
            required: true,
            description: "The maximum valuation at which the note converts to equity."
        },
        {
            name: "discountRate",
            label: "Discount Rate (%)",
            type: "number",
            placeholder: "e.g. 20",
            required: false,
            description: "Percentage discount the investor gets compared to next round investors."
        },
        {
            name: "conversionEvent",
            label: "Conversion Event",
            type: "select",
            required: true,
            options: [
                { label: "Next Equity Financing", value: "equity_financing" },
                { label: "Liquidity Event (Exit)", value: "liquidity" },
                { label: "Dissolution", value: "dissolution" }
            ],
            description: "The primary trigger for the note to convert into shares."
        },
        {
            name: "equityFinancingThreshold",
            label: "Equity Financing Threshold (INR)",
            type: "number",
            placeholder: "e.g. 5000000",
            required: false,
            description: "Minimum amount of next round required to trigger conversion."
        }
    ],
    defaultClauses: [
        "Title and Preamble",
        "The Investment",
        "Conversion at Equity Financing",
        "Liquidity Event Conversion",
        "Dissolution Rights",
        "Valuation Cap and Discount",
        "Pro-Rata Rights",
        "Information Rights",
        "Representations and Warranties",
        "Governing Law and Jurisdiction",
        "Miscellaneous"
    ]
};
