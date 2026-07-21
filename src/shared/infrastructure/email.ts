import { Resend } from "resend";

/**
 * Transactional email via Resend (server-only). No-ops unless RESEND_API_KEY
 * is set. Supabase already sends auth emails; this is for product
 * notifications (e.g. "your blueprint is ready").
 */

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
};

export async function sendEmail(
  input: SendEmailInput,
): Promise<{ sent: boolean; id?: string; error?: string }> {
  if (!resend) {
    return { sent: false, error: "RESEND_API_KEY not set" };
  }
  const { data, error } = await resend.emails.send({
    from: input.from ?? "Rancang Ide <onboarding@resend.dev>",
    to: input.to,
    subject: input.subject,
    html: input.html,
  });
  if (error) return { sent: false, error: error.message };
  return { sent: true, id: data?.id };
}
