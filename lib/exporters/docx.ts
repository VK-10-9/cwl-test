import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    Footer,
    Header,
} from "docx";

export async function generateDocx(text: string, watermark: boolean = false): Promise<Buffer> {
    const lines = text.split("\n");
    const children: Paragraph[] = [];

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) {
            children.push(new Paragraph({ text: "" }));
            continue;
        }

        // H1 heading
        if (trimmed.startsWith("# ")) {
            children.push(
                new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: trimmed.replace(/^#\s*/, ""),
                            bold: true,
                            size: 32,
                            color: "1F3864",
                            font: "Inter",
                        }),
                    ],
                })
            );
        }
        // H2 heading
        else if (trimmed.startsWith("## ")) {
            children.push(
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                    children: [
                        new TextRun({
                            text: trimmed.replace(/^##\s*/, ""),
                            bold: true,
                            size: 26,
                            color: "1F3864",
                            font: "Inter",
                        }),
                    ],
                })
            );
        }
        // H3 heading
        else if (trimmed.startsWith("### ")) {
            children.push(
                new Paragraph({
                    heading: HeadingLevel.HEADING_3,
                    spacing: { before: 160, after: 80 },
                    children: [
                        new TextRun({
                            text: trimmed.replace(/^###\s*/, ""),
                            bold: true,
                            size: 24,
                            font: "Inter",
                        }),
                    ],
                })
            );
        }
        // Numbered clause
        else if (trimmed.match(/^\d+\.\s/)) {
            children.push(
                new Paragraph({
                    spacing: { after: 80 },
                    indent: { left: 360 },
                    children: [
                        new TextRun({
                            text: trimmed,
                            size: 22,
                            font: "Inter",
                        }),
                    ],
                })
            );
        }
        // Regular paragraph
        else {
            children.push(
                new Paragraph({
                    spacing: { after: 200, line: 276 },
                    alignment: AlignmentType.JUSTIFIED,
                    children: [
                        new TextRun({
                            text: trimmed,
                            size: 24, // Increased font size slightly to 12pt (24 half-points)
                            font: "Inter",
                        }),
                    ],
                })
            );
        }
    }

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Inter",
                        size: 24,
                    },
                },
            },
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 2880, // 2 inches for Letterhead
                            right: 1440,
                            bottom: 1440,
                            left: 1440,
                        },
                    },
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: "Legal Disclaimer: This document is an AI-generated draft provided by ClauseWala and does not constitute final legal advice or a substitute for professional legal review. Users are advised to seek independent review by a qualified Indian advocate before formal execution. ClauseWala assumes no liability for errors or omissions.",
                                        color: "999999",
                                        size: 16, // 8pt
                                        italics: true,
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
                headers: watermark ? {
                    default: new Header({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: "CONFIDENTIAL",
                                        color: "D3D3D3",
                                        size: 72,
                                        bold: true
                                    })
                                ]
                            })
                        ]
                    })
                } : undefined,
                children,
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    return Buffer.from(buffer);
}
