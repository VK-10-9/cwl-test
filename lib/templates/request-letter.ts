import type { DocumentTemplate } from "@/types";

export const requestLetterTemplate: DocumentTemplate = {
    type: "request-letter",
    label: "Official Request Letter",
    description:
        "Draft a professional request letter for official purposes with proper formatting.",
    isTwoParty: false,
    fields: [
        // 1. Sender Information
        {
            name: "senderName",
            label: "Sender Full Name",
            type: "text",
            placeholder: "e.g., Dr. Rajesh Kumar",
            required: true,
        },
        {
            name: "senderDesignation",
            label: "Sender Designation / Title",
            type: "text",
            placeholder: "e.g., Head of Department, Professor, Director",
            required: true,
            description: "Your official title or position.",
        },
        {
            name: "senderDepartment",
            label: "Sender Department / Organization",
            type: "text",
            placeholder: "e.g., Department of Computer Science, XYZ University",
            required: true,
        },
        {
            name: "senderContact",
            label: "Sender Contact Information",
            type: "textarea",
            placeholder: "Email, phone number, address...",
            required: true,
        },

        // 2. Recipient Information
        {
            name: "recipientName",
            label: "Recipient Full Name / Designation",
            type: "text",
            placeholder: "e.g., The Director, HR Department, The Dean",
            required: true,
        },
        {
            name: "recipientOrganisation",
            label: "Recipient Organization",
            type: "text",
            placeholder: "e.g., ABC Corporation Pvt. Ltd., Government of India",
            required: true,
        },
        {
            name: "recipientAddress",
            label: "Recipient Address",
            type: "textarea",
            placeholder: "Full postal address of the recipient organization...",
            required: false,
        },

        // 3. Letter Details
        {
            name: "letterDate",
            label: "Letter Date",
            type: "date",
            required: true,
        },
        {
            name: "subject",
            label: "Subject Line",
            type: "text",
            placeholder: "e.g., Request for venue allocation for annual tech fest",
            required: true,
            description: "Clear, concise subject describing the request.",
        },
        {
            name: "referenceNumber",
            label: "Reference Number (if any)",
            type: "text",
            placeholder: "e.g., Ref: ABC/2026/123",
            required: false,
        },

        // 4. Request Type
        {
            name: "requestType",
            label: "Type of Request",
            type: "select",
            required: true,
            options: [
                { label: "Resource Allocation", value: "resource" },
                { label: "Permission / Approval", value: "permission" },
                { label: "Information / Documents", value: "information" },
                { label: "Funding / Sponsorship", value: "funding" },
                { label: "Extension / Deadline", value: "extension" },
                { label: "Meeting / Appointment", value: "meeting" },
                { label: "Collaboration / Partnership", value: "collaboration" },
                { label: "Other", value: "other" },
            ],
            description: "Category of the request for appropriate tone and structure.",
        },

        // 5. Request Content
        {
            name: "salutation",
            label: "Salutation",
            type: "select",
            required: true,
            options: [
                { label: "Dear Sir/Madam", value: "dear-sir-madam" },
                { label: "To Whom It May Concern", value: "to-whom" },
                { label: "Respected Sir/Madam", value: "respected" },
                { label: "Dear [Name]", value: "dear-name" },
            ],
        },
        {
            name: "openingParagraph",
            label: "Opening Paragraph",
            type: "textarea",
            placeholder: "Introduce yourself and state the purpose of writing...",
            required: true,
            description: "Brief introduction and direct statement of the request.",
        },
        {
            name: "requestDetails",
            label: "Detailed Request",
            type: "textarea",
            placeholder:
                "Describe what you are requesting in detail. Include quantities, specifications, dates, requirements...",
            required: true,
            description: "Comprehensive details of what is being requested.",
        },
        {
            name: "justification",
            label: "Justification / Reason",
            type: "textarea",
            placeholder: "Why is this request being made? What is the context and importance?",
            required: true,
            description: "Explain why the request is necessary and important.",
        },
        {
            name: "supportingInformation",
            label: "Supporting Information",
            type: "textarea",
            placeholder: "Any background information, previous communications, or relevant details...",
            required: false,
            description: "Additional context that supports the request.",
        },
        {
            name: "benefits",
            label: "Expected Benefits / Outcomes",
            type: "textarea",
            placeholder: "What are the expected outcomes or benefits of granting this request?",
            required: false,
            description: "Benefits to the recipient or mutual benefits.",
        },

        // 6. Timeline
        {
            name: "requiredDate",
            label: "Required By Date",
            type: "date",
            required: false,
            description: "When do you need this request to be fulfilled?",
        },
        {
            name: "proposedDates",
            label: "Proposed Dates / Timeline",
            type: "textarea",
            placeholder: "e.g., Preferably in March 2026, or specific dates/times...",
            required: false,
        },
        {
            name: "duration",
            label: "Duration (if applicable)",
            type: "text",
            placeholder: "e.g., 3 months, One week, Full day event...",
            required: false,
        },

        // 7. Urgency and Priority
        {
            name: "urgency",
            label: "Urgency Level",
            type: "select",
            required: true,
            options: [
                { label: "Standard", value: "standard" },
                { label: "Important", value: "important" },
                { label: "Urgent", value: "urgent" },
                { label: "Time-sensitive", value: "time-sensitive" },
                { label: "Critical", value: "critical" },
            ],
            description: "Affects the tone and emphasis of the request.",
        },
        {
            name: "responseDeadline",
            label: "Response Deadline",
            type: "date",
            required: false,
            description: "By when do you need a response?",
        },

        // 8. Attachments
        {
            name: "hasAttachments",
            label: "Including Attachments?",
            type: "checkbox",
            required: false,
            description: "Check if you are including supporting documents.",
        },
        {
            name: "attachmentList",
            label: "List of Attachments",
            type: "textarea",
            placeholder: "e.g., Proposal document, Budget estimate, Previous correspondence...",
            required: false,
        },

        // 9. Follow-up
        {
            name: "offerToDiscuss",
            label: "Offer to Discuss Further?",
            type: "checkbox",
            required: false,
            description: "Include willingness to meet or discuss the request.",
        },
        {
            name: "proposedMeetingDate",
            label: "Proposed Meeting Date (if applicable)",
            type: "date",
            required: false,
        },

        // 10. Closing
        {
            name: "closing",
            label: "Closing Statement",
            type: "select",
            required: true,
            options: [
                { label: "Thank you for your consideration", value: "thank-consideration" },
                { label: "Thank you in advance", value: "thank-advance" },
                { label: "Looking forward to your positive response", value: "positive-response" },
                { label: "Awaiting your favorable response", value: "awaiting-favorable" },
            ],
        },
        {
            name: "signOff",
            label: "Sign-off",
            type: "select",
            required: true,
            options: [
                { label: "Yours sincerely", value: "sincerely" },
                { label: "Yours faithfully", value: "faithfully" },
                { label: "Regards", value: "regards" },
                { label: "Best regards", value: "best-regards" },
                { label: "Respectfully", value: "respectfully" },
            ],
        },
        {
            name: "ccList",
            label: "CC (Carbon Copy) Recipients",
            type: "textarea",
            placeholder: "List any additional recipients who should receive a copy...",
            required: false,
        },
    ],
    defaultClauses: [
        "Letterhead and Date",
        "Reference Number",
        "Recipient Address",
        "Subject Line",
        "Salutation",
        "Opening Paragraph",
        "Request Details",
        "Justification",
        "Timeline",
        "Supporting Information",
        "Call to Action",
        "Closing",
        "Signatory Block",
        "Enclosures / Attachments",
        "CC Section",
    ],
};
