import { Link, createFileRoute } from "@tanstack/react-router";

import { PublicPage } from "@/components/public/public-page";
import { LegalPage } from "@/components/public/sections";

export const Route = createFileRoute("/terms-of-use")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Aurelia World" },
      {
        name: "description",
        content:
          "Terms governing access, subscriptions, safety, content, institutional use and liability for Aurelia World, operated by Global Solutions Management LLC.",
      },
      { property: "og:title", content: "Terms of Use — Aurelia World" },
      {
        property: "og:description",
        content:
          "Global terms for families, schools, organisations and adult members using Aurelia World.",
      },
      { property: "og:url", content: "/terms-of-use" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/terms-of-use" }],
  }),
  component: TermsOfUse,
});

function TermsOfUse() {
  return (
    <PublicPage>
      <LegalPage
        title="Terms of Use"
        updated="22 August 2026 — prepared for counsel review"
        intro="Aurelia World is a brand and service operated by Global Solutions Management LLC, a Delaware limited liability company. These terms are designed to govern use by families, schools, education groups, organisations and adult members across the jurisdictions in which the service is lawfully offered."
      >
        <h2>1. Contracting entity and scope</h2>
        <p>
          These Terms form an agreement between you and <strong>Global Solutions Management LLC</strong>
          ("GSM", "we", "us" or "our"), the operator of Aurelia World. "Aurelia World" and
          "Aurelia" refer to the platform, products and services operated by GSM and do not identify
          a separate legal entity.
        </p>
        <p>
          If you use Aurelia World for a school, education group, employer, sponsor or other
          organisation, you confirm that you have authority to bind that organisation. A signed
          order form, master services agreement, data processing addendum or other written agreement
          with GSM takes priority over these Terms where it expressly says so.
        </p>

        <h2>2. Children, eligibility and verified access</h2>
        <p>
          Aurelia World does not provide open self-registration for children. Under-16 accounts are
          created only through a verified parent or guardian, school or approved organisation flow.
          Age bands and safeguards may differ by country where local law requires a different
          threshold. We may require additional age, identity, guardian or institutional verification
          where reasonably necessary for safety or legal compliance.
        </p>
        <p>
          Adults must provide accurate information, keep credentials secure and must not allow an
          unauthorised person to use their verified role. A child must never be asked to defeat or
          work around age-separation, guardian-consent, moderation or safety controls.
        </p>

        <h2>3. Guardian and institutional responsibilities</h2>
        <p>
          Guardians are responsible for information and permissions they provide, including
          decisions to request wider sharing of a child's work. Schools and organisations are
          responsible for ensuring that their authorised users have a legitimate role, that they
          have authority to provide information to Aurelia World, and that their use of the service
          complies with the laws and policies that apply to them.
        </p>
        <p>
          Nothing in these Terms transfers GSM's own legal duties to a parent, school or
          organisation. Where law places an obligation directly on GSM as platform operator,
          controller or processor, GSM remains responsible for that obligation.
        </p>

        <h2>4. Safety rules and acceptable use</h2>
        <p>Every user agrees not to:</p>
        <ul>
          <li>exploit, groom, sexualise, threaten, harass, bully or endanger a child or any other person;</li>
          <li>attempt to contact a child outside approved, supervised platform pathways;</li>
          <li>bypass age separation, permissions, moderation, access controls, rate limits or security measures;</li>
          <li>upload unlawful, infringing, malicious, deceptive, hateful, sexually explicit or otherwise prohibited content;</li>
          <li>publish personal contact information, precise location information or other sensitive data about a child without a lawful and approved reason;</li>
          <li>scrape, harvest, reverse engineer, probe, attack, overload or interfere with the service or another user's account;</li>
          <li>use Aurelia World to train an external model, build a child profile for advertising, or commercially exploit children's personal data;</li>
          <li>impersonate another person, school or organisation or misrepresent authority, achievements or identity; or</li>
          <li>use the service in breach of sanctions, export controls or other applicable law.</li>
        </ul>
        <p>
          Our <Link to="/community-standards" className="font-medium text-foreground underline underline-offset-4">Community Standards</Link>{" "}
          and safeguarding rules form part of these Terms. We may use automated signals and human
          review to detect or assess safety, fraud, security and content-policy concerns. Wider
          publication remains subject to the permission and moderation process applicable to the
          relevant content.
        </p>

        <h2>5. Child privacy and private drafts</h2>
        <p>
          A child's private draft is not made visible to a parent, school or other audience merely
          because that adult sponsors or supervises the account. Guardians receive the permission
          information needed to make approval decisions, while access to child content is limited by
          the product's role and sharing rules. We may access content where necessary to provide the
          service, investigate a report, protect a child, maintain security or comply with law.
        </p>

        <h2>6. Content ownership and licence to GSM</h2>
        <p>
          Users retain ownership of content they lawfully create and upload. For a child, ownership
          remains with the child or other lawful rights-holder. No ownership is transferred to GSM
          simply by using Aurelia World.
        </p>
        <p>
          You grant GSM a worldwide, non-exclusive, royalty-free licence to host, copy, process,
          format, scan, moderate, transmit and display content only to the extent reasonably needed
          to operate, secure and improve the contracted service, honour approved sharing settings,
          maintain records required by law, and protect users. This operational licence ends when
          the content is deleted from active systems, subject to lawful retention, security backups,
          safeguarding records and dispute evidence.
        </p>
        <p>
          You must have the rights needed for anything you submit. GSM may remove or restrict
          allegedly infringing material and may terminate repeat infringers where appropriate.
        </p>

        <h2>7. AI-assisted features</h2>
        <p>
          AI-assisted features are tools, not people, teachers, therapists, doctors or emergency
          services. Outputs can be incomplete or wrong and should be checked before relying on them.
          Child-facing AI is intended to remain bounded and age-appropriate. Users must not use AI
          features to obtain harmful instructions, evade safety controls, impersonate a person or
          misrepresent authorship. Where a feature materially assists a work, Aurelia World may
          require an authorship or assistance label.
        </p>

        <h2>8. Subscriptions, institutional fees and taxes</h2>
        <p>
          Paid plans renew for the billing period shown at checkout unless cancelled in accordance
          with the cancellation method made available for that plan. Prices, renewal frequency,
          taxes and any material recurring-payment terms will be shown before purchase. Payment is
          processed by an authorised payment provider; GSM does not need to receive full card
          details in order to provide the service.
        </p>
        <p>
          Consumer cancellation, refund and cooling-off rights vary by jurisdiction. Nothing in
          these Terms removes a mandatory right that cannot lawfully be waived. Institutional fees,
          renewal, termination and refund terms may instead be set out in the applicable order form
          or master agreement.
        </p>

        <h2>9. Schools, education groups and organisations</h2>
        <p>
          Institutional customers must administer accounts only for legitimate educational,
          safeguarding, community or programme purposes agreed with GSM. They must not use access
          to build unrelated commercial profiles of children, contact children outside approved
          channels, or disclose platform data to unauthorised third parties.
        </p>
        <p>
          The parties' data-protection roles depend on the processing activity. For institution-
          directed education records, GSM may act as a processor/service provider on the
          institution's documented instructions. For account security, fraud prevention,
          safeguarding, platform integrity, billing and GSM's own legal compliance, GSM may act as
          an independent controller. Institutional customers should review the applicable Data
          Processing Addendum before transferring regulated student records.
        </p>

        <h2>10. Moderation, reports and appeals</h2>
        <p>
          GSM may restrict visibility, remove content, disable features, preserve evidence or
          suspend accounts where we reasonably believe it is necessary for child safety, security,
          legal compliance or enforcement of these Terms. Where appropriate, we will provide the
          responsible adult or institution with a reason and a route to request human review.
          Safeguarding, law-enforcement or confidential investigations may limit what we can disclose.
        </p>

        <h2>11. Third-party services</h2>
        <p>
          Aurelia World relies on carefully selected infrastructure, security, communications,
          translation and payment providers. Third-party services may have their own terms and
          privacy notices. GSM is responsible for its own selection and use of processors as
          required by applicable law, but is not responsible for a separate third-party service a
          user independently chooses to access outside Aurelia World.
        </p>

        <h2>12. Service availability and changes</h2>
        <p>
          We aim to provide a reliable service but do not promise uninterrupted or error-free
          operation. We may change, suspend or discontinue a feature for safety, legal, technical or
          commercial reasons. Where a paid change materially reduces a consumer's service, we will
          provide any notice, remedy or cancellation right required by applicable law.
        </p>

        <h2>13. No professional or emergency service</h2>
        <p>
          Aurelia World is a creative, educational and community technology platform. It is not a
          school, childcare provider, medical or mental-health service, legal adviser, emergency
          service or statutory safeguarding authority. If someone is in immediate danger, users
          should contact the appropriate local emergency or child-protection service rather than
          rely on the platform.
        </p>

        <h2>14. Warranties and liability</h2>
        <p>
          Nothing in these Terms excludes or limits liability that applicable law does not permit
          us to exclude or limit, including mandatory consumer rights. Subject to that rule, the
          service is provided on an "as available" basis and GSM does not guarantee that every
          user-generated statement, AI output, opportunity, verification or third-party item is
          accurate or suitable for a particular purpose.
        </p>
        <p>
          For business and institutional customers, and to the maximum extent permitted by law,
          GSM will not be liable for indirect, incidental, special, punitive or consequential loss,
          loss of profit, revenue, goodwill or anticipated savings, and GSM's aggregate contractual
          liability arising from the service will not exceed the fees paid or payable by that
          customer to GSM for the affected service during the 12 months preceding the event giving
          rise to the claim. This business liability allocation does not apply where prohibited by
          law or to liability that cannot lawfully be limited.
        </p>

        <h2>15. Business-customer indemnity</h2>
        <p>
          To the extent permitted by law, a school, organisation or other business customer will
          defend and indemnify GSM against third-party claims caused by that customer's unlawful
          instructions, unauthorised disclosure of data, infringement of third-party rights, or
          material breach of these Terms, except to the extent the claim was caused by GSM's own
          breach or wrongdoing. Consumer families and children are not subject to this business
          indemnity clause.
        </p>

        <h2>16. International use</h2>
        <p>
          Aurelia World is designed for global use, but features, age rules, payment availability
          and institutional processing may vary by location. GSM may restrict, defer or adapt a
          feature where necessary to comply with local law. Access from a country does not mean
          that every feature is legally or commercially offered in that country.
        </p>

        <h2>17. Governing law and mandatory local rights</h2>
        <p>
          For business and institutional customers, unless a signed agreement states otherwise,
          these Terms are governed by the laws of the State of Delaware, USA, without regard to
          conflict-of-law principles. For consumers, this choice applies only to the extent
          permitted by law and does not deprive a consumer of mandatory protections or courts that
          cannot lawfully be displaced in the place where they live.
        </p>

        <h2>18. Suspension, termination and survival</h2>
        <p>
          We may suspend or terminate access for material breach, non-payment, fraud, security risk,
          safeguarding risk, legal requirement or repeated infringement. Guardians and customers
          may request account closure subject to retention obligations. Provisions that by their
          nature should survive termination — including ownership, accrued payment obligations,
          lawful retention, liability limitations and dispute provisions — continue to apply.
        </p>

        <h2>19. Assignment and corporate transactions</h2>
        <p>
          GSM may assign or transfer these Terms, together with the service and associated rights
          and obligations, to an affiliate or successor in connection with a reorganisation,
          financing, merger, acquisition or sale of business, subject to applicable privacy and
          consumer law. A business customer may not assign its agreement without GSM's prior
          written consent except where its signed agreement permits it.
        </p>

        <h2>20. Changes and notices</h2>
        <p>
          We may update these Terms to reflect legal, safety, security or product changes. If a
          change materially affects paid rights or how personal data is handled, we will provide
          the notice and choices required by applicable law. If any provision is unenforceable, the
          remainder continues in effect to the fullest extent permitted by law.
        </p>

        <h2>21. Contact</h2>
        <p>
          Contract, legal and account questions may be sent through our{" "}
          <Link to="/contact" className="font-medium text-foreground underline underline-offset-4">
            contact page
          </Link>
          . Safety concerns should use our{" "}
          <Link to="/report-concern" className="font-medium text-foreground underline underline-offset-4">
            report-a-concern route
          </Link>
          .
        </p>
      </LegalPage>
    </PublicPage>
  );
}
