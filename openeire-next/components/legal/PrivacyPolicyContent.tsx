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

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm">
        <iframe
          title="OpenÉire Studios Privacy and Cookie Policy"
          src={IUBENDA_POLICY_EMBED_URL}
          className="block h-[75vh] min-h-[720px] w-full border-0 bg-white"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      <p className="mt-6">
        If the embedded policy does not load in your browser, you can open it
        directly here:{" "}
        <a
          href={IUBENDA_POLICY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Privacy &amp; Cookie Policy
        </a>
        .
      </p>
    </LegalPageShell>
  );
}
