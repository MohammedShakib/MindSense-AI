function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(value) {
  if (!value) return new Date().toLocaleString();
  return new Date(value).toLocaleString();
}

function modalitiesPayload(assessment) {
  const payload = assessment?.modalities_used;
  if (Array.isArray(payload)) return { used: payload };
  return payload || {};
}

export function assessmentToReportData({ assessment, mentalResult, faceResult, finalResult }) {
  const payload = modalitiesPayload(assessment);
  const mental = mentalResult || payload.mental;
  const facial = faceResult || payload.facial;

  return {
    id: assessment?.id || 'Unsaved assessment',
    date: formatDate(assessment?.created_at),
    score: finalResult?.score ?? assessment?.final_score ?? 0,
    level: finalResult?.level ?? assessment?.risk_level ?? 'Pending',
    confidence: finalResult?.confidence ?? assessment?.overall_confidence ?? 0,
    recommendation: finalResult?.recommendation ?? payload.recommendation ?? 'No recommendation available.',
    mentalLabel: mental?.label || 'Not available',
    mentalConfidence: mental?.confidence ?? assessment?.behavioural_confidence ?? 0,
    facialLabel: facial?.label || 'Not available',
    facialConfidence: facial?.confidence ?? assessment?.facial_confidence ?? 0,
  };
}

export function openAssessmentReport(data) {
  const report = assessmentToReportData(data);
  const popup = window.open('', '_blank', 'noopener,noreferrer,width=900,height=1100');

  if (!popup) {
    throw new Error('Report window was blocked by the browser.');
  }

  popup.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>MindSense AI Wellness Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #0f172a; }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 18px; margin-bottom: 24px; }
          .brand { font-size: 26px; font-weight: 800; margin: 0; }
          .sub { color: #64748b; margin: 6px 0 0; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
          .card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; }
          .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: .08em; }
          .value { font-size: 24px; font-weight: 800; margin-top: 8px; }
          .section { margin-top: 22px; }
          .section h2 { font-size: 16px; margin: 0 0 10px; }
          table { width: 100%; border-collapse: collapse; }
          td, th { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
          th { background: #f8fafc; font-size: 12px; text-transform: uppercase; color: #475569; }
          .notice { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; padding: 12px; color: #9a3412; font-size: 13px; line-height: 1.5; }
          @media print { button { display: none; } body { margin: 24px; } }
        </style>
      </head>
      <body>
        <button onclick="window.print()" style="float:right;padding:10px 14px;border:0;border-radius:8px;background:#111827;color:white;font-weight:700;cursor:pointer;">Print / Save PDF</button>
        <div class="header">
          <h1 class="brand">MindSense AI Wellness Report</h1>
          <p class="sub">Generated ${escapeHtml(new Date().toLocaleString())}</p>
        </div>

        <div class="notice">
          This report is for personal wellness awareness only. It is not a medical diagnosis, treatment plan, or clinical risk assessment.
        </div>

        <div class="grid">
          <div class="card"><div class="label">Final Score</div><div class="value">${escapeHtml(report.score)}/100</div></div>
          <div class="card"><div class="label">Status</div><div class="value">${escapeHtml(report.level)}</div></div>
          <div class="card"><div class="label">Confidence</div><div class="value">${escapeHtml(report.confidence)}%</div></div>
        </div>

        <div class="section">
          <h2>Assessment Details</h2>
          <table>
            <tbody>
              <tr><th>Assessment ID</th><td>${escapeHtml(report.id)}</td></tr>
              <tr><th>Date</th><td>${escapeHtml(report.date)}</td></tr>
              <tr><th>Recommendation</th><td>${escapeHtml(report.recommendation)}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Signal Breakdown</h2>
          <table>
            <thead><tr><th>Signal</th><th>Result</th><th>Confidence</th></tr></thead>
            <tbody>
              <tr><td>Behavioural</td><td>${escapeHtml(report.mentalLabel)}</td><td>${escapeHtml(report.mentalConfidence)}%</td></tr>
              <tr><td>Facial</td><td>${escapeHtml(report.facialLabel)}</td><td>${escapeHtml(report.facialConfidence)}%</td></tr>
              <tr><td>Text</td><td>Not added in this phase</td><td>-</td></tr>
              <tr><td>Voice</td><td>Not added in this phase</td><td>-</td></tr>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `);
  popup.document.close();
  popup.focus();
}
