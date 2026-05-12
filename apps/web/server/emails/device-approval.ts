import { emailLayout } from './_layout';

export function renderDeviceApprovalEmail(args: {
  email: string;
  userCode: string;
  verificationUri: string;
}) {
  const subject = 'Approve your Grayprint CLI sign-in';
  const html = emailLayout({
    preheader: `Approve device code ${args.userCode}`,
    heading: 'Approve your CLI sign-in',
    body: `
      <p style="margin:0 0 12px 0;">A Grayprint CLI is asking to sign in as you. If this was you, approve it with the code below.</p>
      <div style="margin:18px 0;padding:14px 18px;background:#F5F2E8;border:1px dashed rgba(10,19,48,0.12);border-radius:10px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:24px;letter-spacing:0.18em;font-weight:700;color:#0A1330;text-align:center;">
        ${args.userCode}
      </div>
      <p style="margin:0;font-size:13px;color:rgba(10,19,48,0.6);">
        If you didn’t start this sign-in, ignore this email and the request will expire in 15 minutes.
      </p>
    `,
    cta: { url: args.verificationUri, label: 'Approve in browser →' },
  });
  const text = `Approve Grayprint CLI sign-in.\n\nCode: ${args.userCode}\nOpen: ${args.verificationUri}\n\nExpires in 15 minutes.`;
  return { subject, html, text };
}
