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

const notifyConsentGranted = () => {
  for (const callback of consentGrantedListeners) {
    callback();
  }
};

const hasStoredIubendaConsent = (): boolean => {
  if (typeof document === "undefined") return false;

  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .some(
      (cookie) =>
        cookie.startsWith("_iub_cs-") || cookie.startsWith("_iub_cs-s"),
    );
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

  callbacks.onReady = composeCallback(callbacks.onReady, (consent) => {
    if (consent === true) {
      notifyConsentGranted();
    }
  });
  callbacks.onConsentGiven = composeCallback(callbacks.onConsentGiven, () => {
    notifyConsentGranted();
  });
  callbacks.onConsentRead = composeCallback(callbacks.onConsentRead, () => {
    notifyConsentGranted();
  });
  (callbacks as Record<string, unknown>)[IUBENDA_CALLBACK_BRIDGE_MARKER] = true;
  cookieConfiguration.callback = callbacks;

  return true;
};

export const shouldDeferGAUntilIubendaConsent = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(window._iub?.csConfiguration) && !hasStoredIubendaConsent();
};

export const registerIubendaConsentGrantedCallback = (
  callback: IubendaConsentGrantedCallback,
) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  consentGrantedListeners.add(callback);
  attachIubendaCookieCallbacks();

  if (hasStoredIubendaConsent()) {
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

  attachIubendaCookieCallbacks();
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

