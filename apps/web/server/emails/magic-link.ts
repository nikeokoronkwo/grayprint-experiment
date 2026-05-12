import { emailLayout } from './_layout';

export function renderMagicLinkEmail(args: { email: string; url: string; token: string }) {
  const subject = 'Your Grayprint sign-in link';
  const html = emailLayout({
    preheader: 'One click to sign in to Grayprint.',
    heading: 'Sign in to Grayprint',
    body: `
      <p style="margin:0 0 12px 0;">Click the button below to sign in. This link works once and expires in 15 minutes.</p>
      <p style="margin:0;color:rgba(10,19,48,0.6);font-size:13px;">If the button doesn’t work, paste this link into your browser:</p>
      <p style="margin:6px 0 0 0;word-break:break-all;font-size:13px;"><a href="${args.url}" style="color:#3B82F6;text-decoration:underline;">${args.url}</a></p>
    `,
    cta: { url: args.url, label: 'Sign in →' },
  });
  const text = `Sign in to Grayprint\n\n${args.url}\n\nThis link expires in 15 minutes.`;
  return { subject, html, text };
}
