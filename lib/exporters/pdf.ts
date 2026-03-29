/**
 * PDF generation — serverless-compatible.
 *
 * Full Puppeteer-based PDF generation requires a Chrome binary which is not
 * available on Vercel serverless functions.  This lightweight fallback wraps
 * the document text into a self-contained HTML file that any browser can
 * "Print → Save as PDF".  The API returns this as an HTML attachment so the
 * user can open it locally and print.
 *
 * To restore browser-rendered PDFs for a VPS/Docker deploy, install
 * `puppeteer` (or `puppeteer-core` + `@sparticuz/chromium`) and uncomment
 * the headless Chrome path below.
 */

export async function generatePdf(htmlContent: string, watermark: boolean = false, targetLanguage: string = "en"): Promise<Buffer> {
  // ── Translate labels if not English ──
  const { translateText } = await import("@/lib/bhashini");
  const headerText = targetLanguage === "en" ? "Privileged & Confidential — ClauseWala AI Draft" : await translateText("Privileged & Confidential — ClauseWala AI Draft", "en", targetLanguage);
  const footerText = targetLanguage === "en" 
    ? "Legal Disclaimer: This document is an AI-generated draft provided by ClauseWala and does not constitute final legal advice or a substitute for professional legal review. Users are advised to seek independent review by a qualified Indian advocate before formal execution. ClauseWala assumes no liability for errors or omissions." 
    : await translateText("Legal Disclaimer: This document is an AI-generated draft provided by ClauseWala and does not constitute final legal advice or a substitute for professional legal review. Users are advised to seek independent review by a qualified Indian advocate before formal execution. ClauseWala assumes no liability for errors or omissions.", "en", targetLanguage);

  // ── Serverless-friendly: return styled, print-optimised HTML ──
  const watermarkDiv = watermark ? '<div class="watermark">CONFIDENTIAL</div>' : '';
  const fullHtml = `<!DOCTYPE html>
<html lang="${targetLanguage}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;700&family=Noto+Sans+Bengali:wght@400;700&family=Noto+Sans+Tamil:wght@400;700&family=Noto+Sans+Telugu:wght@400;700&family=Noto+Sans+Kannada:wght@400;700&family=Noto+Sans+Gujarati:wght@400;700&display=swap');
@page { size: A4; margin: 25mm 20mm; @bottom-center { content: element(footer); } }
body {
  font-family: 'Inter', 'Noto Sans Devanagari', 'Noto Sans Bengali', 'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Kannada', 'Noto Sans Gujarati', sans-serif;
  font-size: 11pt;
  line-height: 1.5;
  color: #0c0c0c;
  margin: 0;
  padding: 0;
}
h1 { font-family: 'Playfair Display', serif; font-size:18pt; font-weight:700; text-align:center; color:#0e0e0f; margin-bottom:30px; text-transform:uppercase; letter-spacing:0.5px; }
h2 { font-family: 'Playfair Display', serif; font-size:13pt; font-weight:700; color:#1a1a1a; margin-top:24px; margin-bottom:10px; border-bottom: 0.5pt solid #ddd; padding-bottom: 4px; }
p  { margin-bottom:12px; text-align:justify; }
.disclaimer-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top: 0.5pt solid #e5e7eb;
  padding-top: 10px;
  margin-top: 30px;
  font-size: 8pt;
  color: #6b7280;
  text-align: center;
  line-height: 1.4;
  font-style: italic;
}
.privileged-header {
  font-size: 8pt;
  text-transform: uppercase;
  color: #999;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 40px;
}
.watermark { position: fixed; top: 40%; left: 10%; transform: rotate(-45deg); font-size: 80pt; color: rgba(0, 0, 0, 0.05); z-index: -1; pointer-events: none; white-space: nowrap; user-select: none; }
@media print { .watermark { position: absolute; } }
</style>
</head>
<body>
<div class="privileged-header">${headerText}</div>
${watermarkDiv}
${htmlContent}
<div class="disclaimer-footer">${footerText}</div>
<script>window.onload=function(){window.print()}</script>
</body>
</html>`;

  return Buffer.from(fullHtml, "utf-8");
}

/** Convert plain text document to basic HTML for PDF rendering */
export function textToHtml(text: string): string {
    const lines = text.split("\n");
    let html = "";

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            html += "<br/>";
            continue;
        }

        // Headings
        if (trimmed.match(/^#{1,3}\s/)) {
            const level = trimmed.match(/^(#+)/)?.[1].length || 1;
            const content = trimmed.replace(/^#+\s*/, "");
            html += `<h${level}>${content}</h${level}>`;
        }
        // Numbered items
        else if (trimmed.match(/^\d+\.\s/)) {
            html += `<p style="margin-left: 20px;">${trimmed}</p>`;
        }
        // Regular paragraph
        else {
            html += `<p>${trimmed}</p>`;
        }
    }

    return html;
}
