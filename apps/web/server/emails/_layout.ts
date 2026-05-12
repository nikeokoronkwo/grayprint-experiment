/**
 * Plain-HTML email layout. No template renderer — keeps deps minimal and avoids
 * locking into a particular Vue/React email lib. Tokens mirror @grayprint/ui.
 */

const INK = '#0A1330';
const PAPER = '#F5F2E8';
const ACCENT = '#A3E635';
const BLUEPRINT = '#3B82F6';

export function emailLayout(args: {
  preheader: string;
  heading: string;
  body: string; // raw HTML for the body block
  cta?: { url: string; label: string };
  footer?: string;
}) {
  const { preheader, heading, body, cta, footer } = args;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${heading}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};font-family:-apple-system,BlinkMacSystemFont,'Inter',Segoe UI,Roboto,sans-serif;color:${INK};">
<span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${preheader}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="540" cellpadding="0" cellspacing="0" style="max-width:540px;background:#ffffff;border:1px solid rgba(10,19,48,0.08);border-radius:14px;overflow:hidden;">
      <tr>
        <td style="padding:24px 28px 8px 28px;">
          <div style="display:inline-flex;align-items:center;gap:8px;">
            <div style="display:inline-block;width:24px;height:24px;border-radius:6px;background:${INK};color:${PAPER};font-family:'Inter',sans-serif;font-weight:700;text-align:center;line-height:24px;font-size:11px;">g</div>
            <div style="font-weight:700;font-size:14px;letter-spacing:-0.01em;">grayprint</div>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 0 28px;">
          <h1 style="margin:16px 0 8px 0;font-size:24px;line-height:1.2;font-weight:700;letter-spacing:-0.01em;">
            ${heading}
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 24px 28px;font-size:15px;line-height:1.55;color:${INK};">
          ${body}
        </td>
      </tr>
      ${
        cta
          ? `<tr><td style="padding:0 28px 28px 28px;"><a href="${cta.url}" style="display:inline-block;background:${INK};color:${PAPER};text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:600;font-size:14px;">${cta.label}</a></td></tr>`
          : ''
      }
      <tr>
        <td style="background:${PAPER};padding:18px 28px;border-top:1px solid rgba(10,19,48,0.06);font-size:12px;color:rgba(10,19,48,0.6);">
          ${footer ?? 'If you didn’t request this, you can safely ignore it.'}
          <div style="height:6px;width:48px;background:${ACCENT};border-radius:99px;margin-top:12px;"></div>
        </td>
      </tr>
    </table>
    <div style="margin-top:16px;font-size:11px;color:rgba(10,19,48,0.5);">grayprint · the blueprint for templates</div>
  </td></tr>
</table>
</body></html>`;
}

export const tokens = { INK, PAPER, ACCENT, BLUEPRINT };
