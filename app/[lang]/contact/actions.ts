"use server";

import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { fieldsFor, isInquiryIntent, MAX_FIELD_LENGTH, validateInquiry, type InquiryErrorCode, type InquiryField } from "@/lib/inquiry";

export type InquiryState = {
  status: "idle" | "success" | "error";
  /** Key into dictionary contact.errors; the form shows it in the visitor's language. */
  message?: "summary" | "tooFast" | "unavailable" | "failed";
  errors?: Partial<Record<InquiryField, InquiryErrorCode>>;
};

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim().slice(0, MAX_FIELD_LENGTH);

/** People take longer than this to read and fill in a form; scripts usually don't. */
const MIN_FILL_MS = 2000;

export async function submitInquiry(_prev: InquiryState, form: FormData): Promise<InquiryState> {
  // Honeypot: real visitors never see or fill this field, so this only ever answers a bot.
  if (text(form, "website")) return { status: "success" };

  const requested = text(form, "locale");
  const locale = isLocale(requested) ? requested : defaultLocale;
  const rawIntent = text(form, "inquiryType");
  const intent = isInquiryIntent(rawIntent) ? rawIntent : "partnership";

  // A person could trip this, so tell them plainly and let them resend instead of pretending it worked.
  const startedAt = Number(text(form, "startedAt"));
  if (startedAt && Date.now() - startedAt < MIN_FILL_MS) return { status: "error", message: "tooFast" };

  const values = Object.fromEntries(fieldsFor(intent).map((f) => [f, text(form, f)])) as Record<InquiryField, string>;
  const errors = validateInquiry(intent, values);
  if (Object.keys(errors).length) return { status: "error", errors, message: "summary" };

  // Delivered to any webhook (CRM, Zapier/Make, Slack, form service…) configured through the environment.
  // Without one there is nowhere to send the request, so the visitor is told and given the email address.
  const webhook = process.env.QUOTE_WEBHOOK_URL;
  if (!webhook) {
    console.error("QUOTE_WEBHOOK_URL is not set: an inquiry could not be delivered.");
    return { status: "error", message: "unavailable" };
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inquiryType: intent, ...values, locale, submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return { status: "success" };
  } catch (err) {
    console.error("Failed to deliver an inquiry:", err instanceof Error ? err.message : "unknown error");
    return { status: "error", message: "failed" };
  }
}
