const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const docsDir = path.join(__dirname, '../../docs');
const mdPath = path.join(docsDir, 'PROJECT_REPORT.md');
const htmlPath = path.join(docsDir, 'PROJECT_REPORT.html');
const pdfPath = path.join(docsDir, 'PROJECT_REPORT.pdf');

const md = fs.readFileSync(mdPath, 'utf8');

// Basic formatting for printable document
const lines = md.split('\n');
let bodyHtml = '';
let inCodeBlock = false;

for (let line of lines) {
  if (line.startsWith('```')) {
    if (inCodeBlock) {
      bodyHtml += '</pre>\n';
      inCodeBlock = false;
    } else {
      bodyHtml += '<pre><code>\n';
      inCodeBlock = true;
    }
    continue;
  }
  if (inCodeBlock) {
    bodyHtml += line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '\n';
    continue;
  }

  if (line.startsWith('# ')) {
    bodyHtml += `<h1>${line.slice(2)}</h1>\n`;
  } else if (line.startsWith('## ')) {
    bodyHtml += `<h2>${line.slice(3)}</h2>\n`;
  } else if (line.startsWith('### ')) {
    bodyHtml += `<h3>${line.slice(4)}</h3>\n`;
  } else if (line.trim().startsWith('|')) {
    bodyHtml += `<p class="table-line">${line}</p>\n`;
  } else if (line.trim().startsWith('- ')) {
    bodyHtml += `<li>${line.slice(2)}</li>\n`;
  } else if (line.trim().length > 0) {
    bodyHtml += `<p>${line}</p>\n`;
  }
}

// Format strong
bodyHtml = bodyHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Task and Deadline Management System - Project Report</title>
  <style>
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      max-width: 850px;
      margin: 40px auto;
      padding: 0 20px;
    }
    h1 {
      color: #1e1b4b;
      border-bottom: 3px solid #4338ca;
      padding-bottom: 8px;
      margin-top: 36px;
      font-size: 26px;
    }
    h2 {
      color: #312e81;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 6px;
      margin-top: 28px;
      font-size: 20px;
    }
    h3 {
      color: #4338ca;
      margin-top: 20px;
      font-size: 16px;
    }
    p {
      margin: 8px 0;
      font-size: 14px;
    }
    li {
      margin-left: 20px;
      font-size: 14px;
    }
    pre {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      font-family: Consolas, monospace;
      font-size: 12px;
      overflow-x: auto;
    }
    strong {
      color: #0f172a;
    }
    .table-line {
      font-family: Consolas, monospace;
      font-size: 12px;
      background: #f1f5f9;
      padding: 2px 6px;
      margin: 2px 0;
    }
    @media print {
      body { max-width: 100%; margin: 20mm; font-size: 11pt; }
      h1, h2, h3 { page-break-after: avoid; }
    }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;

fs.writeFileSync(htmlPath, fullHtml);
console.log('Generated:', htmlPath);

// Convert to PDF using Chrome headless
try {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  if (fs.existsSync(chromePath)) {
    execSync(`"${chromePath}" --headless --disable-gpu --print-to-pdf="${pdfPath}" "${htmlPath}"`);
    console.log('Generated PDF:', pdfPath);
  }
} catch (e) {
  console.warn('PDF conversion note:', e.message);
}
