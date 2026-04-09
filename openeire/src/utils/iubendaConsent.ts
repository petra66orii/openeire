import {
  IUBENDA_CONSENT_DATABASE_ENABLED,
  IUBENDA_CONSENT_PUBLIC_API_KEY,
} from "../config/iubenda";

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

declare global {
  interface Window {
    _iub?: {
      cons_instructions?: Array<[string, Record<string, unknown>]>;
    };
  }
}

const registeredFormIds = new Set<string>();
const CONSENT_SCRIPT_SRC = "https://cdn.iubenda.com/cons/iubenda_cons.js";
const DEFAULT_LEGAL_NOTICE_IDENTIFIERS = ["privacy_policy", "cookie_policy"];

const ensureConsentInstructionQueue = () => {
  window._iub = window._iub || {};
  window._iub.cons_instructions = window._iub.cons_instructions || [];
  return window._iub.cons_instructions;
};

const buildFieldMap = (subject: SubjectFieldMap, preferences?: PreferenceFieldMap) => {
  const map: { subject: SubjectFieldMap; preferences?: PreferenceFieldMap } = { subject };
  if (preferences && Object.keys(preferences).length > 0) {
    map.preferences = preferences;
  }
  return map;
};

export const bootstrapIubendaConsentDatabase = () => {
  if (!IUBENDA_CONSENT_DATABASE_ENABLED || !IUBENDA_CONSENT_PUBLIC_API_KEY || typeof window === "undefined") {
    return;
  }

  const queue = ensureConsentInstructionQueue();
  const hasInitInstruction = queue.some(([instruction]) => instruction === "init");

  if (!hasInitInstruction) {
    queue.push(["init", {
      api_key: IUBENDA_CONSENT_PUBLIC_API_KEY,
      sendFromLocalStorageAtLoad: false,
    }]);
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

export const registerIubendaConsentForm = ({
  formId,
  submitButtonId,
  subject,
  preferences,
  legalNoticeIdentifiers = DEFAULT_LEGAL_NOTICE_IDENTIFIERS,
}: IubendaConsentFormConfig) => {
  if (!IUBENDA_CONSENT_DATABASE_ENABLED || typeof window === "undefined") {
    return;
  }

  bootstrapIubendaConsentDatabase();

  if (registeredFormIds.has(formId)) {
    return;
  }

  const form = document.getElementById(formId);
  const submitElement = document.getElementById(submitButtonId);

  if (!form || !submitElement) {
    return;
  }

  const queue = ensureConsentInstructionQueue();
  queue.push(["load", {
    submitElement,
    form: {
      selector: form,
      map: buildFieldMap(subject, preferences),
    },
    consent: {
      legal_notices: legalNoticeIdentifiers.map((identifier) => ({ identifier })),
    },
  }]);

  registeredFormIds.add(formId);
};
