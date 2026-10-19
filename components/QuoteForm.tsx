"use client";

import { useActionState } from "react";
import { submitQuote, type QuoteState } from "@/app/[lang]/contact/actions";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Icon } from "./Icon";

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-background px-4 py-3.5 text-brand-ink placeholder:text-muted/60 transition focus:border-brand focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/10 aria-[invalid=true]:border-red-500";

function Field({
  label,
  name,
  error,
  required,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-bold text-brand-ink">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

// Email and phone are always typed left-to-right; in Arabic they stay right-aligned like the other fields.
const ltrInputClass = `${inputClass} rtl:text-right`;

export function QuoteForm({
  locale,
  labels,
  products,
  defaultProduct = "",
}: {
  locale: Locale;
  labels: Dictionary["contact"]["form"];
  products: string[];
  defaultProduct?: string;
}) {
  const [state, action, pending] = useActionState<QuoteState, FormData>(submitQuote, { status: "idle" });
  const errors = state.errors ?? {};
  const err = (name: keyof NonNullable<QuoteState["errors"]>) =>
    errors[name] ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` } : {};

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col items-center py-16 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-accent-soft text-brand">
          <Icon name="check" className="size-10" strokeWidth={2} />
        </span>
        <h3 className="mt-8 font-display text-3xl text-brand-ink">{labels.successTitle}</h3>
        <p className="mt-4 max-w-md leading-relaxed text-muted">{labels.successBody}</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="grid gap-6 sm:grid-cols-2">
      <input type="hidden" name="locale" value={locale} />
      <div className="hidden" aria-hidden="true">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field label={labels.name} name="name" required error={errors.name}>
        <input id="name" name="name" autoComplete="name" required className={inputClass} {...err("name")} />
      </Field>
      <Field label={labels.company} name="company">
        <input id="company" name="company" autoComplete="organization" className={inputClass} />
      </Field>
      <Field label={labels.email} name="email" required error={errors.email}>
        <input id="email" name="email" type="email" dir="ltr" autoComplete="email" required className={ltrInputClass} {...err("email")} />
      </Field>
      <Field label={labels.phone} name="phone">
        <input id="phone" name="phone" type="tel" dir="ltr" autoComplete="tel" className={ltrInputClass} />
      </Field>
      <Field label={labels.country} name="country">
        <input id="country" name="country" autoComplete="country-name" placeholder={labels.countryPlaceholder} className={inputClass} />
      </Field>
      <Field label={labels.product} name="product" required error={errors.product}>
        <input
          id="product"
          name="product"
          list="product-options"
          defaultValue={defaultProduct}
          required
          placeholder={labels.productPlaceholder}
          className={inputClass}
          {...err("product")}
        />
        <datalist id="product-options">
          {products.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      </Field>
      <Field label={labels.quantity} name="quantity">
        <input id="quantity" name="quantity" placeholder={labels.quantityPlaceholder} className={inputClass} />
      </Field>
      <Field label={labels.incoterm} name="incoterm">
        <select id="incoterm" name="incoterm" defaultValue="" className={inputClass}>
          <option value="">{labels.incotermUnsure}</option>
          <option value="FOB">FOB</option>
          <option value="CFR">CFR</option>
          <option value="CIF">CIF</option>
          <option value="Other">{labels.incotermOther}</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label={labels.message} name="message" required error={errors.message}>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            placeholder={labels.messagePlaceholder}
            className={inputClass}
            {...err("message")}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted rtl:text-sm">{labels.privacy}</p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full bg-brand px-8 py-4 text-sm font-bold text-white transition hover:bg-brand-deep disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? labels.sending : labels.submit}
          {!pending && <Icon name="arrow" className="size-4" strokeWidth={2} />}
        </button>
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 sm:col-span-2">
          {state.message}
        </p>
      )}
    </form>
  );
}
