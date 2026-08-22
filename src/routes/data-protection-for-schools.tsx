import { Link, createFileRoute } from "@tanstack/react-router";

import { PublicPage } from "@/components/public/public-page";
import { LegalPage } from "@/components/public/sections";

export const Route = createFileRoute("/data-protection-for-schools")({
  head: () => ({
    meta: [
      { title: "Data Protection for Schools & Organisations — Aurelia World" },
      {
        name: "description",
        content:
          "How Global Solutions Management LLC structures data roles, student privacy, subprocessors and institutional data protection for Aurelia World.",
      },
      { property: "og:title", content: "Data Protection for Schools & Organisations — Aurelia World" },
      { property: "og:url", content: "/data-protection-for-schools" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/data-protection-for-schools" }],
  }),
  component: DataProtectionForSchools,
});

function DataProtectionForSchools() {
  return (
    <PublicPage>
      <LegalPage
        title="Data Protection for Schools & Organisations"
        updated="22 August 2026 — prepared for counsel review"
        intro="Aurelia World is operated by Global Solutions Management LLC. Institutional customers receive a data-protection framework that separates school-directed education processing from GSM's own platform-safety and security responsibilities."
      >
        <h2>Clear data roles</h2>
        <p>
          A school or organisation may be the controller/business for education records it directs
          GSM to process for the contracted service, with GSM acting as processor/service provider.
          GSM may separately act as controller for account security, fraud prevention, child
          safeguarding, platform integrity, billing and its own legal obligations. The exact split
          is documented in the applicable institutional agreement and Data Processing Addendum.
        </p>

        <h2>Student and child data is not advertising inventory</h2>
        <p>
          Institution-provided child data is not sold, used for behavioural advertising or used to
          build unrelated commercial profiles. School-authorised data is limited to the agreed
          educational/service purpose and the safety/security processing necessary to operate the
          platform lawfully.
        </p>

        <h2>Private drafts remain private</h2>
        <p>
          Sponsoring a child account does not give an institution a general right to browse the
          child's private drafts. Teachers and administrators receive only the access the product
          role and relevant sharing/verification workflow permits.
        </p>

        <h2>US school deployments</h2>
        <p>
          Where applicable, institutional agreements can include FERPA and COPPA provisions. GSM
          does not place its own COPPA obligations onto a school. Where a school is legally able to
          authorise education-only processing on a parent's behalf, that authorisation is limited
          to the school context and does not permit unrelated commercial reuse of student data.
        </p>

        <h2>UK and EEA deployments</h2>
        <p>
          Institutional arrangements can include processor terms and cross-border transfer
          provisions required by UK GDPR or EU GDPR. Country-specific age, consent, representative
          and transfer requirements are assessed separately rather than assuming a single global
          threshold applies everywhere.
        </p>

        <h2>Security architecture</h2>
        <ul>
          <li>verified role-based access and invitation-gated child onboarding;</li>
          <li>database-level row security and server-side privileged operations;</li>
          <li>private-by-default child projects;</li>
          <li>guardian permission and moderation workflows;</li>
          <li>audit records for sensitive actions;</li>
          <li>no open child directory or unrestricted adult-to-child messaging; and</li>
          <li>media uploads disabled until a protected scanning/quarantine pathway is operational.</li>
        </ul>

        <h2>Subprocessors and international transfers</h2>
        <p>
          GSM uses service providers only for defined operational purposes and expects appropriate
          confidentiality, security and data-protection obligations. Before broad institutional
          contracting, the production Subprocessor list, locations, transfer mechanisms and
          notification procedure will form part of the approved institutional data-protection pack.
        </p>

        <h2>Data rights, deletion and incidents</h2>
        <p>
          GSM's institutional DPA provides for reasonable assistance with verified data-subject
          requests, deletion/return at the end of service subject to lawful retention, and security-
          incident notification without undue delay where GSM acts as processor and an incident
          affects customer personal data.
        </p>

        <h2>Request the institutional pack</h2>
        <p>
          Schools, education groups and approved organisations can request the current security,
          privacy and DPA materials through our{" "}
          <Link to="/contact" className="font-medium text-foreground underline underline-offset-4">
            contact page
          </Link>
          . The signed customer agreement controls over this public summary.
        </p>
      </LegalPage>
    </PublicPage>
  );
}
