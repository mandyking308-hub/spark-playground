import { Link, createFileRoute } from "@tanstack/react-router";

import { PublicPage } from "@/components/public/public-page";
import { LegalPage } from "@/components/public/sections";

export const Route = createFileRoute("/cookie-notice")({
  head: () => ({
    meta: [
      { title: "Cookie & Local Storage Notice — Aurelia World" },
      {
        name: "description",
        content:
          "How Aurelia World uses essential session technology, translation preferences and payment-provider technologies.",
      },
      { property: "og:title", content: "Cookie & Local Storage Notice — Aurelia World" },
      { property: "og:url", content: "/cookie-notice" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/cookie-notice" }],
  }),
  component: CookieNotice,
});

function CookieNotice() {
  return (
    <PublicPage>
      <LegalPage
        title="Cookie & Local Storage Notice"
        updated="22 August 2026 — prepared for counsel review"
        intro="Aurelia World is operated by Global Solutions Management LLC. This notice explains the browser storage and similar technologies used to keep the service secure, remember choices and support optional public-page translation."
      >
        <h2>Essential technology</h2>
        <p>
          Aurelia World uses cookies, secure session identifiers and similar browser storage where
          they are necessary to sign users in, keep authenticated sessions secure, prevent abuse,
          remember security state and provide requested service functionality. These technologies
          are not used to build advertising profiles of children.
        </p>

        <h2>Translation technology</h2>
        <p>
          Public marketing and demonstration pages may offer an optional third-party translation
          tool. The translation provider may use browser storage or receive normal connection data
          when its service is activated. Translation is deliberately excluded from sign-in and
          account-creation routes, authenticated dashboards, private alumni areas, contact-enquiry
          forms and safeguarding reports.
        </p>
        <p>
          Translation state is cleared when a visitor enters a protected route. Automated
          translations are offered for convenience; the English legal text remains the source text
          unless applicable law requires an authoritative local-language version.
        </p>

        <h2>Payment technology</h2>
        <p>
          When paid plans are enabled, an authorised payment provider may use cookies or equivalent
          technologies on its hosted checkout or payment pages for fraud prevention, security and
          transaction processing. Payment-provider technologies are governed by that provider's own
          notices as well as any protections required by GSM's contract with it.
        </p>

        <h2>Analytics and advertising</h2>
        <p>
          Aurelia World's child service model does not use behavioural advertising or advertising
          trackers to profile children. If GSM later introduces non-essential analytics or other
          optional tracking, this notice and the consent controls must be updated before that
          tracking is enabled in jurisdictions where consent is required.
        </p>

        <h2>Your choices</h2>
        <p>
          You can control cookies through your browser. Blocking essential session technology may
          prevent sign-in or other requested features from working. Where local law requires
          consent before non-essential technologies are used, Aurelia World will provide an
          appropriate choice before enabling them.
        </p>

        <h2>More information</h2>
        <p>
          For information about personal data, see our{" "}
          <Link to="/privacy-policy" className="font-medium text-foreground underline underline-offset-4">
            Privacy Policy
          </Link>
          . Questions can be sent through our{" "}
          <Link to="/contact" className="font-medium text-foreground underline underline-offset-4">
            contact page
          </Link>
          .
        </p>
      </LegalPage>
    </PublicPage>
  );
}
