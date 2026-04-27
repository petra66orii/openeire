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

interface RegisteredFormEntry {
  formElement: HTMLElement;
  submitElement: HTMLElement;
  config: IubendaConsentFormConfig;
}

type IubendaConsentGrantedCallback = () => void;

type IubendaCookieCallback = (...args: unknown[]) => void;

interface IubendaCookieCallbacks {
  onReady?: IubendaCookieCallback;
  onConsentGiven?: IubendaCookieCallback;
  onConsentRead?: IubendaCookieCallback;
}

interface IubendaCookieConfiguration {
  callback?: IubendaCookieCallbacks;
}

declare global {
  interface Window {
    _iub?: {
      cons_instructions?: Array<[string, Record<string, unknown>, Record<string, unknown>?]>;
      csConfiguration?: IubendaCookieConfiguration;
    };
  }
}

const registeredForms = new Map<string, RegisteredFormEntry>();
const consentGrantedListeners = new Set<IubendaConsentGrantedCallback>();
const CONSENT_SCRIPT_SRC = "https://cdn.iubenda.com/cons/iubenda_cons.js";
const DEFAULT_LEGAL_NOTICE_IDENTIFIERS = ["privacy_policy", "cookie_policy"];
const IUBENDA_CALLBACK_BRIDGE_MARKER = "__openeireCallbackBridgeInstalled";
const ANALYTICS_CONSENT_KEYS = new Set([
  "analytics",
  "analytics_storage",
  "measurement",
  "measurements",
  "performance",
  "statistics",
  "statistical",
]);
const CONSENT_CONTAINER_KEYS = [
  "consents",
  "preferences",
  "purposes",
  "purposeConsents",
  "categories",
  "services",
] as const;
let analyticsConsentGranted = false;
let callbackBridgeRetryId: number | null = null;

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

const getLegalNotices = (legalNoticeIdentifiers: string[]) =>
  legalNoticeIdentifiers.map((identifier) => ({ identifier }));

const composeCallback = (
  originalCallback: IubendaCookieCallback | undefined,
  nextCallback: IubendaCookieCallback,
): IubendaCookieCallback => {
  return (...args: unknown[]) => {
    originalCallback?.(...args);
    nextCallback(...args);
  };
};

const markAnalyticsConsentGranted = () => {
  analyticsConsentGranted = true;
};

const notifyConsentGranted = () => {
  markAnalyticsConsentGranted();
  for (const callback of consentGrantedListeners) {
    callback();
  }
};

const getIubendaConsentCookieValues = (): string[] => {
  if (typeof document === "undefined") return [];

  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(
      (cookie) =>
        cookie.startsWith("_iub_cs-") || cookie.startsWith("_iub_cs-s"),
    )
    .map((cookie) => cookie.split("=").slice(1).join("="))
    .filter((value) => value.length > 0);
};

const safeJsonParse = (value: string): unknown | null => {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
};

const decodeConsentCookieValue = (rawValue: string): unknown | null => {
  const candidates = [rawValue];

  try {
    candidates.push(decodeURIComponent(rawValue));
  } catch {
    // Ignore malformed cookie values.
  }

  for (const candidate of candidates) {
    const parsed = safeJsonParse(candidate);
    if (parsed !== null) {
      return parsed;
    }
  }

  return null;
};

const extractAnalyticsConsentFromValue = (value: unknown): boolean | null => {
  if (typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const nested = extractAnalyticsConsentFromValue(item);
      if (nested !== null) {
        return nested;
      }
    }
    return null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  for (const [key, nestedValue] of Object.entries(record)) {
    const normalizedKey = key.trim().toLowerCase();
    if (ANALYTICS_CONSENT_KEYS.has(normalizedKey)) {
      const nested = extractAnalyticsConsentFromValue(nestedValue);
      if (nested !== null) {
        return nested;
      }
    }
  }

  for (const containerKey of CONSENT_CONTAINER_KEYS) {
    if (!(containerKey in record)) continue;
    const nested = extractAnalyticsConsentFromValue(record[containerKey]);
    if (nested !== null) {
      return nested;
    }
  }

  if ("consent" in record) {
    const nested = extractAnalyticsConsentFromValue(record.consent);
    if (nested !== null) {
      return nested;
    }
  }

  return null;
};

const hasStoredIubendaAnalyticsConsent = (): boolean => {
  if (analyticsConsentGranted) {
    return true;
  }

  const cookieValues = getIubendaConsentCookieValues();
  if (cookieValues.length === 0) {
    return false;
  }

  return cookieValues.some((cookieValue) => {
    const parsed = decodeConsentCookieValue(cookieValue);
    return extractAnalyticsConsentFromValue(parsed) === true;
  });
};

const extractConsentGrantedFromCallbackArgs = (args: unknown[]): boolean => {
  for (const arg of args) {
    const nested = extractAnalyticsConsentFromValue(arg);
    if (nested === true) {
      return true;
    }
  }

  return hasStoredIubendaAnalyticsConsent();
};

const attachIubendaCookieCallbacks = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const cookieConfiguration = window._iub?.csConfiguration;
  if (!cookieConfiguration) {
    return false;
  }

  const callbacks = cookieConfiguration.callback ?? {};
  if ((callbacks as Record<string, unknown>)[IUBENDA_CALLBACK_BRIDGE_MARKER]) {
    return true;
  }

  callbacks.onReady = composeCallback(callbacks.onReady, (...args) => {
    if (extractConsentGrantedFromCallbackArgs(args)) {
      notifyConsentGranted();
    }
  });
  callbacks.onConsentGiven = composeCallback(callbacks.onConsentGiven, (...args) => {
    if (extractConsentGrantedFromCallbackArgs(args)) {
      notifyConsentGranted();
    }
  });
  callbacks.onConsentRead = composeCallback(callbacks.onConsentRead, (...args) => {
    if (extractConsentGrantedFromCallbackArgs(args)) {
      notifyConsentGranted();
    }
  });
  (callbacks as Record<string, unknown>)[IUBENDA_CALLBACK_BRIDGE_MARKER] = true;
  cookieConfiguration.callback = callbacks;

  return true;
};

const ensureIubendaCookieCallbacksAttached = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (attachIubendaCookieCallbacks()) {
    if (callbackBridgeRetryId !== null) {
      window.clearInterval(callbackBridgeRetryId);
      callbackBridgeRetryId = null;
    }
    return;
  }

  if (callbackBridgeRetryId !== null) {
    return;
  }

  callbackBridgeRetryId = window.setInterval(() => {
    if (!attachIubendaCookieCallbacks()) {
      return;
    }

    if (callbackBridgeRetryId !== null) {
      window.clearInterval(callbackBridgeRetryId);
      callbackBridgeRetryId = null;
    }
  }, 250);
};

export const shouldDeferGAUntilIubendaConsent = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return IUBENDA_CONSENT_DATABASE_ENABLED && !hasStoredIubendaAnalyticsConsent();
};

export const isAnalyticsConsentGranted = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return !shouldDeferGAUntilIubendaConsent();
};

export const registerIubendaConsentGrantedCallback = (
  callback: IubendaConsentGrantedCallback,
) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  consentGrantedListeners.add(callback);
  ensureIubendaCookieCallbacksAttached();

  if (hasStoredIubendaAnalyticsConsent()) {
    callback();
  }

  return () => {
    consentGrantedListeners.delete(callback);
  };
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

  ensureIubendaCookieCallbacksAttached();
};

export const registerIubendaConsentForm = (config: IubendaConsentFormConfig) => {
  if (!IUBENDA_CONSENT_DATABASE_ENABLED || typeof window === "undefined") {
    return () => undefined;
  }

  bootstrapIubendaConsentDatabase();

  const formElement = document.getElementById(config.formId);
  const submitElement = document.getElementById(config.submitButtonId);

  if (!formElement || !submitElement) {
    return () => undefined;
  }

  const existingEntry = registeredForms.get(config.formId);
  if (
    existingEntry &&
    existingEntry.formElement === formElement &&
    existingEntry.submitElement === submitElement
  ) {
    return () => {
      const latestEntry = registeredForms.get(config.formId);
      if (
        latestEntry &&
        latestEntry.formElement === formElement &&
        latestEntry.submitElement === submitElement
      ) {
        registeredForms.delete(config.formId);
      }
    };
  }

  registeredForms.set(config.formId, {
    formElement,
    submitElement,
    config,
  });

  return () => {
    const latestEntry = registeredForms.get(config.formId);
    if (
      latestEntry &&
      latestEntry.formElement === formElement &&
      latestEntry.submitElement === submitElement
    ) {
      registeredForms.delete(config.formId);
    }
  };
};

export const submitIubendaConsentForm = (formId: string) => {
  if (!IUBENDA_CONSENT_DATABASE_ENABLED || typeof window === "undefined") {
    return;
  }

  bootstrapIubendaConsentDatabase();

  const entry = registeredForms.get(formId);
  if (!entry) {
    return;
  }

  const currentFormElement = document.getElementById(formId) ?? entry.formElement;
  if (!currentFormElement) {
    return;
  }

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
          entry.config.legalNoticeIdentifiers ?? DEFAULT_LEGAL_NOTICE_IDENTIFIERS,
        ),
      },
      writeOnLocalStorage: false,
    },
  ]);
};

