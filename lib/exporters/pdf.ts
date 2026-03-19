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

export async function generatePdf(htmlContent: string): Promise<Buffer> {
  // ── Serverless-friendly: return styled, print-optimised HTML ──
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>ClauseWala Export</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@page { size: A4; margin: 20mm; }
body {
  font-family: 'Inter','Segoe UI',sans-serif;
  font-size: 12pt;
  line-height: 1.6;
  color: #1a1a1a;
  margin: 0;
  padding: 40px 60px;
}
h1 { font-size:18pt; font-weight:700; text-align:center; color:#1F3864; margin-bottom:24px; text-transform:uppercase; letter-spacing:1px; }
h2 { font-size:14pt; font-weight:600; color:#1F3864; margin-top:20px; margin-bottom:8px; }
h3 { font-size:12pt; font-weight:600; color:#2d2d2d; margin-top:16px; margin-bottom:6px; }
p  { margin-bottom:10px; text-align:justify; }
.signature-block { margin-top:60px; display:flex; justify-content:space-between; }
.signature-party { width:45%; }
.signature-line  { border-top:1px solid #333; margin-top:60px; padding-top:8px; }
@media print { body { padding:0; } }
</style>
</head>
<body>
${htmlContent}
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
