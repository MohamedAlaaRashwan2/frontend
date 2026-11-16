// What each kind of inquiry asks for. The form renders from this config and the server action validates
// against the same config, so the two can't drift apart.

export const inquiryIntents = ["export", "exporter", "cold-storage", "private-label", "processing", "supplier", "partnership"] as const;

export type InquiryIntent = (typeof inquiryIntents)[number];

export const isInquiryIntent = (value: unknown): value is InquiryIntent => inquiryIntents.includes(value as InquiryIntent);

export type InquiryField =
  | "name"
  | "company"
  | "email"
  | "phone"
  | "country"
  | "product"
  | "productForm"
  | "productCategory"
  | "productTypes"
  | "quantity"
  | "packaging"
  | "storageDuration"
  | "requiredService"
  | "targetMarket"
  | "location"
  | "availability"
  | "message";

type IntentConfig = {
  /** Fields shown, in order. Email, phone and the message are added by `fieldsFor`. */
  fields: InquiryField[];
  required: InquiryField[];
  /** Buyers quoting abroad need an email address; a farm may only have a phone. */
  contact: "email" | "emailOrPhone";
  messageRequired?: boolean;
};

export const inquiryConfig: Record<InquiryIntent, IntentConfig> = {
  export: {
    fields: ["name", "company", "country", "product", "productForm", "quantity", "packaging"],
    required: ["name", "company", "country", "product"],
    contact: "email",
  },
  exporter: {
    fields: ["name", "company", "product", "requiredService", "quantity", "targetMarket"],
    required: ["name", "company", "product"],
    contact: "emailOrPhone",
  },
  "cold-storage": {
    fields: ["name", "company", "productTypes", "quantity", "storageDuration", "requiredService"],
    required: ["name", "company", "productTypes"],
    contact: "emailOrPhone",
  },
  "private-label": {
    fields: ["name", "company", "productCategory", "packaging", "targetMarket", "quantity"],
    required: ["name", "company", "productCategory"],
    contact: "email",
  },
  processing: {
    fields: ["name", "company", "productTypes", "requiredService", "quantity", "packaging"],
    required: ["name", "company", "productTypes"],
    contact: "emailOrPhone",
  },
  supplier: {
    fields: ["name", "company", "productTypes", "location", "availability"],
    required: ["name", "productTypes", "location"],
    contact: "emailOrPhone",
  },
  partnership: {
    fields: ["name", "company", "country"],
    required: ["name"],
    contact: "emailOrPhone",
    messageRequired: true,
  },
};

/** All fields for an intent in display order, with contact details after the identity fields. */
export function fieldsFor(intent: InquiryIntent): InquiryField[] {
  const { fields } = inquiryConfig[intent];
  const identity = fields.filter((f) => f === "name" || f === "company");
  const rest = fields.filter((f) => f !== "name" && f !== "company");
  return [...identity, "email", "phone", ...rest, "message"];
}

export function isRequired(intent: InquiryIntent, field: InquiryField) {
  const config = inquiryConfig[intent];
  if (field === "email") return config.contact === "email";
  if (field === "message") return Boolean(config.messageRequired);
  return config.required.includes(field);
}

export const MAX_FIELD_LENGTH = 2000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type InquiryErrorCode = "required" | "email" | "contact" | "short";

/** Field-level problems for a submission. Pure, so the client can run it too for instant feedback. */
export function validateInquiry(intent: InquiryIntent, values: Partial<Record<InquiryField, string>>) {
  const errors: Partial<Record<InquiryField, InquiryErrorCode>> = {};
  const config = inquiryConfig[intent];
  const get = (f: InquiryField) => (values[f] ?? "").trim();

  for (const field of config.required) if (!get(field)) errors[field] = "required";
  if (get("name") && get("name").length < 2) errors.name = "short";

  if (get("email") && !EMAIL.test(get("email"))) errors.email = "email";
  else if (config.contact === "email" && !get("email")) errors.email = "required";
  else if (config.contact === "emailOrPhone" && !get("email") && !get("phone")) errors.email = "contact";

  if (config.messageRequired && get("message").length < 10) errors.message = get("message") ? "short" : "required";
  return errors;
}
