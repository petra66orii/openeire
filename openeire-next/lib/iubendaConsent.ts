"use client";

type SubjectFieldMap = Partial<{
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
}>;

type PreferenceFieldMap = Record<string, string>;
type IubendaAnalyticsConsentCallback = (granted: boolean) => void;
type IubendaCookieCallback = (...args: unknown[]) => void;

interface IubendaCookieCallbacks {
  onReady?: IubendaCookieCallback;
  onConsentGiven?: IubendaCookieCallback;
  onConsentRead?: IubendaCookieCallback;
  onConsentRejected?: IubendaCookieCallback;
  onPreferenceExpressed?: IubendaCookieCallback;
  onPreferenceChange?: IubendaCookieCallback;
}

interface IubendaCookieConfiguration {
  siteId?: number | string;
  cookiePolicyId?: number | string;
  callback?: IubendaCookieCallbacks;
}

interface IubendaCookieSolutionApi {
  getPreferences?: () => unknown;
}

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
      csConfiguration?: IubendaCookieConfiguration;
      cs?: { api?: IubendaCookieSolutionApi };
      googleConsentModeV2?: boolean;
    };
  }
}

const CONSENT_SCRIPT_SRC = "https://cdn.iubenda.com/cons/iubenda_cons.js";
const DEFAULT_LEGAL_NOTICE_IDENTIFIERS = ["privacy_policy", "cookie_policy"];
const IUBENDA_CALLBACK_BRIDGE_MARKER = "__openeireCallbackBridgeInstalled";
const IUBENDA_MEASUREMENT_PURPOSE_ID = "4";
const registeredForms = new Map<string, RegisteredFormEntry>();
const analyticsConsentListeners = new Set<IubendaAnalyticsConsentCallback>();
let analyticsConsentGranted: boolean | null = null;
let consentMonitorId: number | null = null;
const CONSENT_MONITOR_INTERVAL_MS = 250;

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

const composeCallback =
  (
    originalCallback: IubendaCookieCallback | undefined,
    nextCallback: IubendaCookieCallback,
  ): IubendaCookieCallback =>
  (...args) => {
    originalCallback?.(...args);
    nextCallback(...args);
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
    .filter(Boolean);
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
    if (parsed !== null) return parsed;
  }
  return null;
};

const extractAnalyticsConsentFromValue = (value: unknown): boolean | null => {
  if (typeof value === "boolean") return value;
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;

  const purposes = record.purposes;
  if (purposes && typeof purposes === "object" && !Array.isArray(purposes)) {
    const measurementConsent = (purposes as Record<string, unknown>)[
      IUBENDA_MEASUREMENT_PURPOSE_ID
    ];
    if (typeof measurementConsent === "boolean") return measurementConsent;
  }

  for (const key of ["analytics_storage", "analytics", "measurement"]) {
    if (typeof record[key] === "boolean") return record[key];
  }

  if (typeof record.consent === "boolean") return record.consent;

  return null;
};

const getStoredIubendaAnalyticsConsent = (): boolean | null => {
  for (const cookieValue of getIubendaConsentCookieValues()) {
    const parsed = decodeConsentCookieValue(cookieValue);
    const consent = extractAnalyticsConsentFromValue(parsed);
    if (consent !== null) return consent;
  }
  return null;
};

const getIubendaApiAnalyticsConsent = (): boolean | null => {
  try {
    return extractAnalyticsConsentFromValue(
      window._iub?.cs?.api?.getPreferences?.(),
    );
  } catch {
    return null;
  }
};

const extractAnalyticsConsentFromCallbackArgs = (
  args: unknown[],
): boolean | null => {
  for (const arg of args) {
    const consent = extractAnalyticsConsentFromValue(arg);
    if (consent !== null) return consent;
  }
  return getIubendaApiAnalyticsConsent() ?? getStoredIubendaAnalyticsConsent();
};

const notifyAnalyticsConsent = (granted: boolean) => {
  if (analyticsConsentGranted === granted) return;
  analyticsConsentGranted = granted;
  for (const callback of analyticsConsentListeners) callback(granted);
};

const synchronizeAnalyticsConsent = (...args: unknown[]) => {
  const consent = extractAnalyticsConsentFromCallbackArgs(args);
  if (consent !== null) notifyAnalyticsConsent(consent);
};

const attachIubendaCookieCallbacks = () => {
  if (typeof window === "undefined") return false;
  const cookieConfiguration = window._iub?.csConfiguration;
  if (!cookieConfiguration) return false;

  const callbacks = cookieConfiguration.callback ?? {};
  if ((callbacks as Record<string, unknown>)[IUBENDA_CALLBACK_BRIDGE_MARKER]) {
    return true;
  }

  const maybeNotify = (...args: unknown[]) => synchronizeAnalyticsConsent(...args);

  callbacks.onReady = composeCallback(callbacks.onReady, maybeNotify);
  callbacks.onConsentRead = composeCallback(
    callbacks.onConsentRead ?? callbacks.onConsentGiven,
    maybeNotify,
  );
  callbacks.onPreferenceExpressed = composeCallback(
    callbacks.onPreferenceExpressed,
    maybeNotify,
  );
  callbacks.onPreferenceChange = composeCallback(
    callbacks.onPreferenceChange,
    maybeNotify,
  );
  callbacks.onConsentRejected = composeCallback(
    callbacks.onConsentRejected,
    () => notifyAnalyticsConsent(false),
  );
  (callbacks as Record<string, unknown>)[IUBENDA_CALLBACK_BRIDGE_MARKER] = true;
  cookieConfiguration.callback = callbacks;
  return true;
};

const ensureIubendaCookieCallbacksAttached = () => {
  if (typeof window === "undefined") return;
  attachIubendaCookieCallbacks();
  synchronizeAnalyticsConsent();
  if (analyticsConsentListeners.size === 0 || consentMonitorId !== null) return;

  consentMonitorId = window.setInterval(() => {
    attachIubendaCookieCallbacks();
    synchronizeAnalyticsConsent();
  }, CONSENT_MONITOR_INTERVAL_MS);
};

export const shouldDeferGAUntilIubendaConsent = (): boolean => {
  if (typeof window === "undefined") return true;
  return !isAnalyticsConsentGranted();
};

export const isAnalyticsConsentGranted = (): boolean => {
  if (typeof window === "undefined") return false;
  if (analyticsConsentGranted !== null) return analyticsConsentGranted;
  const currentConsent =
    getIubendaApiAnalyticsConsent() ?? getStoredIubendaAnalyticsConsent();
  analyticsConsentGranted = currentConsent === true;
  return analyticsConsentGranted;
};

export const isIubendaManagingGoogleConsentMode = (): boolean =>
  typeof window !== "undefined" && window._iub?.googleConsentModeV2 === true;

export const registerIubendaAnalyticsConsentCallback = (
  callback: IubendaAnalyticsConsentCallback,
) => {
  if (typeof window === "undefined") return () => undefined;
  analyticsConsentListeners.add(callback);
  callback(isAnalyticsConsentGranted());
  ensureIubendaCookieCallbacksAttached();
  return () => {
    analyticsConsentListeners.delete(callback);
    if (analyticsConsentListeners.size === 0 && consentMonitorId !== null) {
      window.clearInterval(consentMonitorId);
      consentMonitorId = null;
    }
  };
};

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
  ensureIubendaCookieCallbacksAttached();
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
