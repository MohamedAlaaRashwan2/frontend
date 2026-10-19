"use server";

import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { dictionaryFor, fill } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";

export type QuoteState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "product" | "message", string>>;
};

const field = (form: FormData, key: string) => String(form.get(key) ?? "").trim().slice(0, 2000);

export async function submitQuote(_prev: QuoteState, form: FormData): Promise<QuoteState> {
  // Honeypot: real visitors never see or fill this field.
  if (field(form, "website")) return { status: "success" };

  const requested = field(form, "locale");
  const locale = isLocale(requested) ? requested : defaultLocale;
  const t = dictionaryFor(locale).contact.errors;

  const data = {
    name: field(form, "name"),
    company: field(form, "company"),
    email: field(form, "email"),
    phone: field(form, "phone"),
    country: field(form, "country"),
    product: field(form, "product"),
    quantity: field(form, "quantity"),
    incoterm: field(form, "incoterm"),
    message: field(form, "message"),
  };

  const errors: QuoteState["errors"] = {};
  if (data.name.length < 2) errors.name = t.name;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = t.email;
  if (!data.product) errors.product = t.product;
  if (data.message.length < 10) errors.message = t.message;
  if (Object.keys(errors).length) return { status: "error", errors, message: t.summary };

  // Deliver to any webhook (CRM, Zapier/Make, Slack, form service…) configured via env.
  const webhook = process.env.QUOTE_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      console.error("QUOTE_WEBHOOK_URL is not set — quote request was not delivered.", data);
      return {
        status: "error",
        message: fill(t.unavailable, { email: site.contact.email }),
      };
    }
    console.info("[quote request — dev only, not delivered]", data);
    return { status: "success" };
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, locale, submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return { status: "success" };
  } catch (err) {
    console.error("Failed to deliver quote request", err);
    return {
      status: "error",
      message: fill(t.failed, { email: site.contact.email }),
    };
  }
}
