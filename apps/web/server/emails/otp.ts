import { emailLayout } from './_layout';

const intent: Record<string, string> = {
  'sign-in': 'sign in to Grayprint',
  'email-verification': 'verify your email on Grayprint',
  'forget-password': 'reset your Grayprint password',
};

export function renderOtpEmail(args: { email: string; otp: string; type: string }) {
  const what = intent[args.type] ?? 'continue on Grayprint';
  const subject = `${args.otp} — your Grayprint code`;
  const html = emailLayout({
    preheader: `Your code is ${args.otp}`,
    heading: 'Your verification code',
    body: `
      <p style="margin:0 0 12px 0;">Use this code to ${what}. It expires in 10 minutes.</p>
      <div style="margin:18px 0;padding:14px 18px;background:#F5F2E8;border:1px dashed rgba(10,19,48,0.12);border-radius:10px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:28px;letter-spacing:0.18em;font-weight:700;color:#0A1330;text-align:center;">
        ${args.otp}
      </div>
      <p style="margin:0;font-size:13px;color:rgba(10,19,48,0.6);">If you didn’t ask for this code, you can ignore this email.</p>
    `,
  });
  const text = `Your Grayprint code: ${args.otp}\n\nExpires in 10 minutes.`;
  return { subject, html, text };
}
