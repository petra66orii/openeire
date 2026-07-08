import { LegalPageShell } from "@/components/legal/LegalPageShell";
import {
  IUBENDA_POLICY_EMBED_URL,
  IUBENDA_POLICY_URL,
} from "@/lib/legal/iubenda";

export function PrivacyPolicyContent() {
  return (
    <LegalPageShell>
      <h1>Privacy &amp; Cookie Policy</h1>
      <p>This policy is hosted by iubenda, our compliance provider.</p>

      {IUBENDA_POLICY_EMBED_URL ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm">
          <iframe
            title={"Open\u00C9ire Studios Privacy and Cookie Policy"}
            src={IUBENDA_POLICY_EMBED_URL}
            className="block h-[75vh] min-h-[720px] w-full border-0 bg-white"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-amber-300/40 bg-amber-300/10 p-6 text-amber-100">
          The privacy policy URL has not been configured yet.
        </div>
      )}

      <p className="mt-6">
        If the embedded policy does not load in your browser,{" "}
        {IUBENDA_POLICY_URL ? (
          <>
            you can open it directly here:{" "}
            <a
              href={IUBENDA_POLICY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Privacy &amp; Cookie Policy
            </a>
            .
          </>
        ) : (
          "please try again later."
        )}
      </p>
    </LegalPageShell>
  );
}
