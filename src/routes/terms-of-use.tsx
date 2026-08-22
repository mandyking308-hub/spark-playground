import { Link, createFileRoute } from "@tanstack/react-router";

import { PublicPage } from "@/components/public/public-page";
import { LegalPage } from "@/components/public/sections";

export const Route = createFileRoute("/terms-of-use")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Aurelia" },
      {
        name: "description",
        content:
          "The terms governing eligibility, access, acceptable use and content ownership on Aurelia's invitation-only platform.",
      },
      { property: "og:title", content: "Terms of Use — Aurelia" },
      {
        property: "og:description",
        content:
          "Eligibility, guardian responsibility, acceptable use, content ownership and account terms for Aurelia.",
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
        updated="August 2026"
        intro="These terms govern the use of Aurelia by children, guardians, teachers, schools, organisations and alumni members."
      >
        <h2>Eligibility and invitation-only access</h2>
        <p>
          Aurelia does not offer open self-registration for children. A child's account can only
          be created through a verified invitation from a parent or guardian, a school, or a
          participating organisation. Guardians and teachers must provide accurate information
          when setting up or verifying accounts.
        </p>

        <h2>Guardian responsibility</h2>
        <p>
          A parent or guardian is responsible for approving a child's account, for authorising
          the publication or sharing of a child's work beyond the family, and for the accuracy of
          the information they provide. Guardians should review a child's activity periodically
          and are responsible for keeping their own account credentials secure.
        </p>

        <h2>Acceptable use</h2>
        <p>Everyone using Aurelia agrees to:</p>
        <ul>
          <li>Use the platform for the creative, learning and community purposes it is designed for.</li>
          <li>Treat other members with respect, and never harass, bully, or attempt to contact a child outside approved channels.</li>
          <li>Not attempt to bypass age separation, permission controls or moderation systems.</li>
          <li>Not upload content that is unlawful, harmful, or that they do not have the right to share.</li>
          <li>Report content or conduct that appears to put a child at risk.</li>
        </ul>

        <h2>Content ownership</h2>
        <p>
          Young people keep ownership of the work they create on Aurelia. Making something on the
          platform does not transfer copyright or any other ownership right in that work to
          Aurelia.
        </p>

        <h2>Licence granted to Aurelia</h2>
        <p>
          To operate the platform, a member (or their guardian, on their behalf) grants Aurelia a
          limited licence to host, store, display and process their work solely for the purposes
          of providing the service — for example, showing it to the people the guardian has
          approved, supporting the Achievement Passport, or enabling participation in an approved
          challenge. This licence never extends beyond the permissions the guardian has set for
          that content.
        </p>

        <h2>Suspension and termination</h2>
        <p>
          We may suspend or close an account where these terms are breached, where we reasonably
          believe an account poses a safeguarding risk, or where we are required to do so by law.
          Guardians and schools can also request that an account be suspended or closed.
        </p>

        <h2>Disclaimers</h2>
        <p>
          Aurelia is provided with the safeguards described across our trust and safety pages, but
          we cannot guarantee that the platform will be free of interruption or error. Aurelia is
          not a substitute for a guardian's own supervision and judgement, or for statutory
          child-protection services.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms as the platform evolves. Where a change is significant, we
          will take reasonable steps to notify guardians and schools before it takes effect.
          Continued use of Aurelia after a change takes effect means the updated terms apply. For
          questions, visit our{" "}
          <Link to="/contact" className="font-medium text-foreground underline underline-offset-4">
            contact page
          </Link>
          .
        </p>
      </LegalPage>
    </PublicPage>
  );
}
