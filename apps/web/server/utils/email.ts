import nodemailer, { type Transporter } from 'nodemailer';
import { renderDeviceApprovalEmail } from '../emails/device-approval';
import { renderMagicLinkEmail } from '../emails/magic-link';
import { renderOtpEmail } from '../emails/otp';

let _transport: Transporter | null = null;

function useTransport() {
  if (_transport) return _transport;
  const config = useRuntimeConfig();
  if (!config.smtpHost) {
    // Dev fallback — log to console. Avoid silent failures.
    _transport = nodemailer.createTransport({ jsonTransport: true });
    return _transport;
  }
  _transport = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort) || 465,
    secure: Number(config.smtpPort) === 465,
    auth:
      config.smtpUser && config.smtpPass
        ? { user: config.smtpUser, pass: config.smtpPass }
        : undefined,
  });
  return _transport;
}

async function send(to: string, subject: string, html: string, text: string) {
  const config = useRuntimeConfig();
  const transport = useTransport();
  const info = await transport.sendMail({
    to,
    from: config.smtpFrom,
    subject,
    html,
    text,
  });
  // Dev (jsonTransport) — info.message is a JSON string of the email; print so dev sees it.
  if (!config.smtpHost && process.env.NODE_ENV !== 'production') {
    console.info('[email:dev]', subject, '→', to);
    console.info(info.message);
  }
  return info;
}

export async function sendMagicLinkEmail(args: { email: string; url: string; token: string }) {
  const { subject, html, text } = renderMagicLinkEmail(args);
  return send(args.email, subject, html, text);
}

export async function sendOtpEmail(args: {
  email: string;
  otp: string;
  type: 'sign-in' | 'email-verification' | 'forget-password' | string;
}) {
  const { subject, html, text } = renderOtpEmail(args);
  return send(args.email, subject, html, text);
}

export async function sendDeviceApprovalEmail(args: {
  email: string;
  userCode: string;
  verificationUri: string;
}) {
  const { subject, html, text } = renderDeviceApprovalEmail(args);
  return send(args.email, subject, html, text);
}
