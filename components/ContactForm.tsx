"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitInquiry, type InquiryState } from "@/app/[lang]/contact/actions";
import type { Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import { fieldsFor, inquiryConfig, inquiryIntents, isRequired, validateInquiry, type InquiryField, type InquiryIntent } from "@/lib/inquiry";
import { site } from "@/lib/site";
import { Icon } from "./Icon";

type Labels = Dictionary["contact"];

const autoComplete: Partial<Record<InquiryField, string>> = { name: "name", company: "organization", email: "email", phone: "tel", country: "country-name" };

const inputClass =
  "mt-1.5 block w-full min-h-12 bg-white px-3.5 py-3 text-ink ring-1 ring-inset ring-ink/45 placeholder:text-ink/60 transition-shadow duration-150 focus:ring-2 focus:ring-forest focus:outline-none aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-error";

type Props = {
  locale: Locale;
  labels: Labels;
  /** Which inquiry the form opens on. Omit to make the visitor choose first. */
  initialIntent?: InquiryIntent;
  initialProduct?: string;
  /** Fixes the inquiry type and hides the question, for forms embedded on solution pages. */
  fixed?: boolean;
  idPrefix?: string;
};

/** Remounting the inner form is what clears it for "send another request". */
export function ContactForm(props: Props) {
  const [run, setRun] = useState(0);
  return <InquiryForm key={run} {...props} onReset={() => setRun((n) => n + 1)} />;
}

function InquiryForm({ locale, labels, initialIntent, initialProduct = "", fixed = false, idPrefix = "inquiry", onReset }: Props & { onReset: () => void }) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, { status: "idle" });
  const [intent, setIntent] = useState<InquiryIntent | undefined>(initialIntent);
  // Controlled, so typed values survive server errors and switching between inquiry types.
  const [values, setValues] = useState<Partial<Record<InquiryField, string>>>(initialProduct ? { product: initialProduct } : {});
  const [clientErrors, setClientErrors] = useState<InquiryState["errors"]>();
  const [dismissedServerErrors, setDismissedServerErrors] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);

  const errors = clientErrors ?? (dismissedServerErrors ? undefined : state.errors);

  // After a failed submit, take the visitor straight to the first problem.
  useEffect(() => {
    if (errors && Object.keys(errors).length) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
  }, [state.status]);

  // A new server response replaces any dismissal made while typing.
  const [lastState, setLastState] = useState(state);
  if (state !== lastState) {
    setLastState(state);
    setDismissedServerErrors(false);
  }

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="form-step bg-forest p-8 text-paper on-dark focus:outline-none md:p-12">
        <Icon name="check" className="size-10 text-amber" strokeWidth={2.25} />
        <h3 className="t-sub mt-5">{labels.successTitle}</h3>
        <p className="mt-3 max-w-text">{labels.successBody}</p>
        <button type="button" onClick={onReset} className="press mt-7 min-h-12 bg-amber px-5 font-bold text-ink hover:bg-paper">
          {labels.another}
        </button>
      </div>
    );
  }

  const choose = (next: InquiryIntent) => {
    setIntent(next);
    setClientErrors(undefined);
    setDismissedServerErrors(true);
    // Keep the choice in the URL, so sharing the link or switching language holds on to it.
    const url = new URL(window.location.href);
    url.searchParams.set("type", next);
    window.history.replaceState(window.history.state, "", url);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!intent) return;
    const found = validateInquiry(intent, values);
    if (Object.keys(found).length) {
      e.preventDefault();
      setClientErrors(found);
    } else {
      setClientErrors(undefined);
    }
  };

  const setValue = (field: InquiryField, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors?.[field]) {
      setClientErrors({ ...errors, [field]: undefined });
    }
  };

  const labelFor = (field: InquiryField) => {
    if (field === "company" && intent === "supplier") return labels.companyFarm;
    if (field === "company" && intent === "private-label") return labels.companyBrand;
    return labels.fields[field].label;
  };

  const hasErrors = errors && Object.values(errors).some(Boolean);
  const bannerKey = clientErrors ? (hasErrors ? "summary" : undefined) : state.status === "error" && !dismissedServerErrors ? state.message : undefined;

  return (
    <form ref={formRef} action={action} onSubmit={onSubmit} noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />
      {intent && <input type="hidden" name="inquiryType" value={intent} />}
      <div className="hidden" aria-hidden="true">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <noscript>
        <p className="bg-paper p-4 font-bold text-error">{labels.noscript}</p>
      </noscript>

      {!fixed && (
        <fieldset>
          <legend className="t-sub">{labels.formHeading}</legend>
          <div className="mt-4 grid gap-1 sm:grid-cols-2 xl:grid-cols-3">
            {inquiryIntents.map((option) => {
              const selected = intent === option;
              return (
                <label
                  key={option}
                  className={`press relative flex min-h-14 cursor-pointer items-center p-3.5 font-bold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cold-bright ${
                    selected ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-sand-deep"
                  }`}
                >
                  <input type="radio" name="intentChoice" value={option} checked={selected} onChange={() => choose(option)} className="sr-only" />
                  {labels.intents[option].label}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {intent && (
        <div key={intent} className={`form-step ${fixed ? "" : "mt-10"}`}>
          <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
            {fieldsFor(intent).map((field) => {
              const id = `${idPrefix}-${field}`;
              const code = errors?.[field];
              const required = isRequired(intent, field);
              const describedBy = [code ? `${id}-error` : "", field === "email" && inquiryConfig[intent].contact === "emailOrPhone" ? `${id}-hint` : ""]
                .filter(Boolean)
                .join(" ");
              const common = {
                id,
                name: field,
                value: values[field] ?? "",
                placeholder: labels.fields[field].placeholder || undefined,
                required,
                "aria-invalid": code ? (true as const) : undefined,
                "aria-describedby": describedBy || undefined,
                autoComplete: autoComplete[field],
              };
              const isLtr = field === "email" || field === "phone";
              return (
                <div key={field} className={field === "message" ? "sm:col-span-2" : ""}>
                  <label htmlFor={id} className="font-bold">
                    {labelFor(field)}
                    {!required && <span className="ms-2 t-small font-normal">({labels.optional})</span>}
                  </label>
                  {field === "message" ? (
                    <textarea {...common} rows={5} onChange={(e) => setValue(field, e.target.value)} className={inputClass} />
                  ) : (
                    <input
                      {...common}
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      dir={isLtr ? "ltr" : undefined}
                      onChange={(e) => setValue(field, e.target.value)}
                      className={`${inputClass} ${isLtr ? "rtl:text-right" : ""}`}
                    />
                  )}
                  {field === "email" && inquiryConfig[intent].contact === "emailOrPhone" && (
                    <p id={`${id}-hint`} className="t-small mt-1.5">
                      {labels.emailOrPhone}
                    </p>
                  )}
                  {code && (
                    <p id={`${id}-error`} className="t-small mt-1.5 font-bold text-error">
                      {labels.errors[code]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {bannerKey && (
            <p role="alert" className="mt-6 bg-white p-4 font-bold text-error">
              {fill(labels.errors[bannerKey], { email: site.contact.email })}
            </p>
          )}

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={pending}
              className="press arrow-nudge inline-flex min-h-13 shrink-0 items-center justify-center gap-3 bg-forest px-6 py-3 font-bold text-paper hover:bg-ink disabled:cursor-wait disabled:opacity-75"
            >
              {pending ? labels.sending : labels.intents[intent].submit}
              {!pending && <Icon name="arrow" className="size-5" strokeWidth={2} />}
            </button>
            <p className="t-small">{labels.privacy}</p>
          </div>
        </div>
      )}
    </form>
  );
}
