import { Link, createFileRoute } from "@tanstack/react-router";

import { PublicPage } from "@/components/public/public-page";
import { LegalPage } from "@/components/public/sections";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Aurelia World" },
      {
        name: "description",
        content:
          "How Global Solutions Management LLC handles personal data in Aurelia World, including children's data, school data, international transfers and data rights.",
      },
      { property: "og:title", content: "Privacy Policy — Aurelia World" },
      {
        property: "og:description",
        content:
          "Global privacy information for Aurelia World, including additional protections for children and education data.",
      },
      { property: "og:url", content: "/privacy-policy" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <PublicPage>
      <LegalPage
        title="Privacy Policy"
        updated="22 August 2026 — prepared for counsel review"
        intro="Aurelia World is operated by Global Solutions Management LLC, a Delaware limited liability company. This notice explains how GSM handles personal data and the additional safeguards used because Aurelia World serves children, families, schools and education organisations."
      >
        <h2>1. Who is responsible for your data</h2>
        <p>
          <strong>Global Solutions Management LLC</strong> ("GSM", "we", "us" or "our") operates
          Aurelia World. Depending on the processing activity, GSM may act as a data controller,
          business, service provider or processor under applicable privacy law.
        </p>
        <p>
          Where GSM decides why and how information is used for account security, child safety,
          fraud prevention, moderation, platform integrity, billing, service administration and
          legal compliance, GSM generally acts as a controller. Where a school or organisation
          instructs GSM to process education records solely for that institution's purposes, the
          institution may be the controller and GSM may act as its processor or service provider.
          The applicable institutional agreement and Data Processing Addendum describe that split
          in more detail.
        </p>

        <h2>2. The data we may collect</h2>
        <ul>
          <li><strong>Account and identity data:</strong> name, email, age band, country, verified role, school or organisation relationship and account identifiers.</li>
          <li><strong>Guardian and permission data:</strong> guardian relationships, invitations, consent and sharing decisions, and records showing when permissions were requested or changed.</li>
          <li><strong>Creative and learning data:</strong> project titles, drafts, descriptions, submissions, feedback, achievements and verification records. Media files are not accepted while the protected scanning/quarantine upload pathway is disabled.</li>
          <li><strong>Institutional data:</strong> school, education-group and organisation membership, role and administration records, and information an institution lawfully directs us to process.</li>
          <li><strong>Safety data:</strong> reports, moderation decisions, incident records and information reasonably necessary to investigate or respond to a safeguarding or security concern.</li>
          <li><strong>Billing data:</strong> plan, billing status, transaction and subscription identifiers. Payment providers process card or bank details under their own secure systems.</li>
          <li><strong>Technical data:</strong> IP address, device/browser information, security logs, authentication events and diagnostic information needed to secure and operate the service.</li>
          <li><strong>Contact data:</strong> information submitted through enquiry, support or institutional sales forms.</li>
        </ul>

        <h2>3. Why we use personal data</h2>
        <p>We use personal data only for defined purposes, including to:</p>
        <ul>
          <li>create, verify and protect accounts and role-based access;</li>
          <li>provide creative, learning, achievement and community features;</li>
          <li>operate guardian approval, school verification and moderation workflows;</li>
          <li>protect children, investigate reports, prevent abuse, fraud and security incidents;</li>
          <li>process subscriptions, institutional contracts and customer support;</li>
          <li>maintain audit records, enforce our Terms and comply with legal obligations; and</li>
          <li>improve reliability and safety using appropriately limited operational information.</li>
        </ul>
        <p>
          We do not sell children's personal data. We do not use children's personal data for
          behavioural advertising, and we do not build advertising profiles of children.
        </p>

        <h2>4. Lawful bases</h2>
        <p>
          The lawful basis depends on the activity and jurisdiction. It may include performance of
          a contract, compliance with legal obligations, legitimate interests in operating and
          securing the platform, protection of vital interests in an urgent safety context, and
          consent where consent is legally required. We do not treat a single guardian consent as
          a blanket legal basis for every use of a child's data.
        </p>

        <h2>5. Children and parental authorisation</h2>
        <p>
          Children receive higher privacy settings by default. Under-16 accounts are not open
          self-registration accounts. Guardian or institution-sponsored onboarding, age bands and
          permission controls are used so that the level of protection can be matched to the user
          and the jurisdiction.
        </p>
        <p>
          Where a law requires verifiable parental consent or authorisation, we take reasonable
          steps appropriate to the risk to verify the adult or institutional authority giving it.
          In school deployments, a school may be able to authorise specified education-only
          processing where local law permits, but that does not allow GSM to reuse student data for
          unrelated commercial purposes.
        </p>

        <h2>6. Private child work and guardian visibility</h2>
        <p>
          A child's draft is private by default and is not automatically exposed to a guardian,
          teacher, school or organisation. Guardians receive the information needed to review a
          sharing request, but sponsorship of an account does not by itself create unrestricted
          access to the child's private workspace. Wider visibility requires the relevant product
          permission, safety and moderation steps.
        </p>

        <h2>7. Special-category and highly sensitive information</h2>
        <p>
          Aurelia World is not designed as a health-record, counselling or special-category-data
          repository. Users should not add sensitive information unless the feature requires it and
          they are authorised to do so. A safeguarding report may necessarily contain sensitive
          information; in that case we restrict access and use it only for legitimate safety,
          legal and case-management purposes.
        </p>

        <h2>8. AI and automated processing</h2>
        <p>
          AI-assisted features may help with ideas, structure, spelling, accessibility, safety
          signals or similar bounded tasks. Aurelia World does not use children's data to target
          advertising. We do not intend to make decisions producing legal or similarly significant
          effects on a child solely by automated means. Safety signals can trigger human review
          rather than automatically publishing a child's work.
        </p>

        <h2>9. Who we share data with</h2>
        <p>
          We disclose personal data only where there is a legitimate and lawful reason. Recipients
          may include vetted hosting, database, security, communications, payment and moderation
          providers; a school or organisation with an authorised oversight role; professional
          advisers; an acquiring or financing party under appropriate confidentiality; and public
          authorities where disclosure is legally required or reasonably necessary to protect a
          person from serious harm.
        </p>
        <p>
          Service providers are expected to process information only for authorised purposes and
          under contractual, confidentiality and security obligations appropriate to their role.
        </p>

        <h2>10. Public-page translation</h2>
        <p>
          Aurelia World may offer an optional third-party translation tool on public marketing and
          demonstration pages. The translation service is deliberately excluded from authenticated
          dashboards, sign-in and account creation, private alumni areas, contact enquiries and
          safeguarding reports. Sensitive form fields and protected brand terms are marked not to
          be translated. Automated translations are provided for convenience and are not a
          substitute for an authoritative local-language legal notice where one is required by law.
        </p>

        <h2>11. International transfers</h2>
        <p>
          GSM is a United States company and Aurelia World is intended for international use.
          Infrastructure and service providers may process data in more than one country. Where a
          cross-border transfer requires a specific legal safeguard, GSM will use an applicable
          mechanism such as an adequacy framework, contractual safeguards, or another transfer
          mechanism recognised by the relevant law, together with additional security measures
          where appropriate.
        </p>

        <h2>12. Retention and deletion</h2>
        <p>
          We retain personal data only for as long as reasonably necessary for the purpose for
          which it was collected, including to provide the account, satisfy contractual and legal
          obligations, resolve disputes, prevent fraud and preserve legitimate safeguarding or
          security evidence. Different categories have different retention periods. We do not
          intentionally retain children's personal data indefinitely merely because storage is
          available.
        </p>
        <p>
          When an account or project is deleted, removal from active systems may be followed by a
          limited backup or legal-retention period. Safeguarding, fraud, financial or legal records
          may be retained for longer where justified and access-restricted.
        </p>

        <h2>13. Security</h2>
        <p>
          Aurelia World uses role-based access, database-level row security, server-side secrets,
          verified account roles, audit trails and other technical and organisational controls.
          No system can guarantee absolute security. We review security risks and may suspend or
          restrict an account where necessary to protect users or the service.
        </p>

        <h2>14. Your privacy rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct, delete, restrict,
          object to or obtain a copy of personal data, withdraw consent, or complain to a privacy
          regulator. Some jurisdictions also give rights relating to sale, sharing, targeted
          advertising or automated decision-making. Because Aurelia World does not sell children's
          data or use it for behavioural advertising, those practices are not part of the child
          service model.
        </p>
        <p>
          A guardian may exercise appropriate rights for a child, subject to the child's own rights
          as they develop and to applicable law. Schools may also submit requests for data they
          control under an institutional agreement. Requests can be made through our{" "}
          <Link to="/contact" className="font-medium text-foreground underline underline-offset-4">
            contact page
          </Link>
          . We may need to verify identity and authority before acting on a request.
        </p>

        <h2>15. Regional representatives and regulatory contacts</h2>
        <p>
          Where a law requires GSM to appoint a local privacy or digital-services representative,
          GSM will appoint that representative before relying on the relevant regulated offering
          and will publish the required contact details. The identity and scope of any such
          representative must be confirmed for each launch territory rather than assumed from the
          existence of another GSM-affiliated or partner organisation.
        </p>

        <h2>16. Changes to this policy</h2>
        <p>
          We may update this notice as the service, providers or law change. If a change materially
          affects how we use children's or paid-account data, we will provide the notice and choices
          required by applicable law before the change takes effect where required.
        </p>

        <h2>17. Contact and complaints</h2>
        <p>
          Privacy requests and questions can be submitted through our{" "}
          <Link to="/contact" className="font-medium text-foreground underline underline-offset-4">
            contact page
          </Link>
          . Safety concerns should use the{" "}
          <Link to="/report-concern" className="font-medium text-foreground underline underline-offset-4">
            report-a-concern route
          </Link>
          . You may also have the right to complain to the data-protection authority that applies
          where you live.
        </p>
      </LegalPage>
    </PublicPage>
  );
}
