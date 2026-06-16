"use client";

type SubjectFieldMap = Partial<{
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
}>;

type PreferenceFieldMap = Record<string, string>;

export interface IubendaConsentFormConfig {
  formId: string;
  submitButtonId: string;
  subject: SubjectFieldMap;
  preferences?: PreferenceFieldMap;
  legalNoticeIdentifiers?: string[];
}

interface RegisteredFormEntry {
  formElement: HTMLElement;
  config: IubendaConsentFormConfig;
}

declare global {
  interface Window {
    _iub?: {
      cons_instructions?: Array<
        [string, Record<string, unknown>, Record<string, unknown>?]
      >;
    };
  }
}

const CONSENT_SCRIPT_SRC = "https://cdn.iubenda.com/cons/iubenda_cons.js";
const DEFAULT_LEGAL_NOTICE_IDENTIFIERS = ["privacy_policy", "cookie_policy"];
const registeredForms = new Map<string, RegisteredFormEntry>();

const getSafeEnvValue = (value: string | undefined): string | null => {
  const trimmedValue = value?.trim();
  if (!trimmedValue || trimmedValue === "undefined" || trimmedValue === "null") {
    return null;
  }
  return trimmedValue;
};

const publicApiKey = getSafeEnvValue(
  process.env.NEXT_PUBLIC_IUBENDA_CONSENT_PUBLIC_API_KEY,
);

const isConsentDatabaseEnabled = Boolean(publicApiKey);

const ensureConsentInstructionQueue = () => {
  window._iub = window._iub || {};
  window._iub.cons_instructions = window._iub.cons_instructions || [];
  return window._iub.cons_instructions;
};

const buildFieldMap = (
  subject: SubjectFieldMap,
  preferences?: PreferenceFieldMap,
) => {
  const map: { subject: SubjectFieldMap; preferences?: PreferenceFieldMap } = {
    subject,
  };
  if (preferences && Object.keys(preferences).length > 0) {
    map.preferences = preferences;
  }
  return map;
};

const getLegalNotices = (legalNoticeIdentifiers: string[]) =>
  legalNoticeIdentifiers.map((identifier) => ({ identifier }));

export const bootstrapIubendaConsentDatabase = () => {
  if (!isConsentDatabaseEnabled || !publicApiKey || typeof window === "undefined") {
    return;
  }

  const queue = ensureConsentInstructionQueue();
  const hasInitInstruction = queue.some(([instruction]) => instruction === "init");

  if (!hasInitInstruction) {
    queue.push([
      "init",
      {
        api_key: publicApiKey,
        sendFromLocalStorageAtLoad: false,
      },
    ]);
  }

  if (document.querySelector(`script[src="${CONSENT_SCRIPT_SRC}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.src = CONSENT_SCRIPT_SRC;
  script.async = true;
  script.type = "text/javascript";
  document.head.appendChild(script);
};

export const registerIubendaConsentForm = (
  config: IubendaConsentFormConfig,
) => {
  if (!isConsentDatabaseEnabled || typeof window === "undefined") {
    return () => undefined;
  }

  bootstrapIubendaConsentDatabase();

  const formElement = document.getElementById(config.formId);
  const submitElement = document.getElementById(config.submitButtonId);

  if (!formElement || !submitElement) {
    return () => undefined;
  }

  registeredForms.set(config.formId, { formElement, config });

  return () => {
    const latestEntry = registeredForms.get(config.formId);
    if (latestEntry?.formElement === formElement) {
      registeredForms.delete(config.formId);
    }
  };
};

export const submitIubendaConsentForm = (formId: string) => {
  if (!isConsentDatabaseEnabled || typeof window === "undefined") {
    return;
  }

  bootstrapIubendaConsentDatabase();

  const entry = registeredForms.get(formId);
  if (!entry) return;

  const currentFormElement = document.getElementById(formId) ?? entry.formElement;
  const queue = ensureConsentInstructionQueue();

  queue.push([
    "submit",
    {
      form: {
        selector: currentFormElement,
        map: buildFieldMap(entry.config.subject, entry.config.preferences),
      },
      consent: {
        legal_notices: getLegalNotices(
          entry.config.legalNoticeIdentifiers ??
            DEFAULT_LEGAL_NOTICE_IDENTIFIERS,
        ),
      },
      writeOnLocalStorage: false,
    },
  ]);
};
