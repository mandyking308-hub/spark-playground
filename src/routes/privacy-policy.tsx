import { Link, createFileRoute } from "@tanstack/react-router";

import { PublicPage } from "@/components/public/public-page";
import { LegalPage } from "@/components/public/sections";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Aurelia" },
      {
        name: "description",
        content:
          "How Aurelia collects, uses, protects and retains personal data, including the additional protections in place for children's data.",
      },
      { property: "og:title", content: "Privacy Policy — Aurelia" },
      {
        property: "og:description",
        content:
          "What data Aurelia collects, why, how long it is kept, who it is shared with, and how to exercise your data rights.",
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
        updated="August 2026"
        intro="This policy explains what personal data Aurelia collects, why we collect it, and how it is protected — including the additional care we take because many of our members are children."
      >
        <h2>Who we are</h2>
        <p>
          Aurelia operates a protected platform for young creators, their guardians, teachers,
          schools and, from age 16, alumni. Throughout this policy, "we" and "Aurelia" refer to
          the organisation responsible for operating the platform and deciding how personal data
          is used within it.
        </p>

        <h2>What data we collect and why</h2>
        <p>We collect the data needed to run a safe, verified platform, and no more than that. This includes:</p>
        <ul>
          <li>Account and identity information for children, guardians, teachers and administrators, used to create and verify accounts.</li>
          <li>Work that a child creates on the platform, including drafts, media and submissions, used to provide the creative and learning features themselves.</li>
          <li>Guardian consent and approval records, used to demonstrate that publication and sharing decisions were properly authorised.</li>
          <li>Verification records from teachers and schools, used to support the Achievement Passport.</li>
          <li>Safeguarding reports and related case notes, used to investigate and respond to concerns.</li>
          <li>Basic technical and usage information, used to keep the platform secure and functioning correctly.</li>
        </ul>

        <h2>Lawful bases and consent for children</h2>
        <p>
          Where we process a child's personal data, we rely on the involvement and consent of a
          parent or guardian in addition to any other applicable lawful basis, such as the
          performance of our contract with the family or school, or a legitimate safeguarding
          interest. A guardian must approve a child's account, and no child's work is published
          or shared beyond the family without guardian approval.
        </p>

        <h2>Guardian rights</h2>
        <p>
          Guardians can view what information is held about their child, review and withdraw
          consent for publication or sharing, request corrections, and request deletion of their
          child's account and associated data, subject to any safeguarding or legal records we
          are required to retain.
        </p>

        <h2>How long we keep data</h2>
        <p>
          We keep personal data only for as long as it is needed for the purpose it was collected
          for. Account and creative data is retained while an account is active and for a limited
          period afterwards to allow reactivation or guardian requests. Safeguarding records are
          retained for longer where necessary to meet our safeguarding responsibilities. Retention
          periods are enforced through defined rules rather than left to individual discretion.
        </p>

        <h2>Who data is shared with</h2>
        <p>
          We do not sell personal data, and we do not use children's data for advertising. Data
          is shared only with service providers who help us operate the platform — for example
          hosting, storage and moderation tooling — under agreements that require them to protect
          it and use it only for the purpose we specify. Data is shared with a school or
          organisation only where the account was created through that school or organisation and
          only to the extent needed for their oversight role. Data may be disclosed to authorities
          where we are legally required to, or where necessary to protect a child from harm.
        </p>

        <h2>Security measures</h2>
        <p>
          Access to personal data is controlled through role-based permissions enforced at the
          database level, so that a person or system can only see the data their role requires.
          Sensitive actions are logged for review. We apply encryption, access controls and
          internal review to reduce the risk of unauthorised access, loss or misuse of data.
        </p>

        <h2>International transfers</h2>
        <p>
          Aurelia serves families, schools and organisations in different locations. Where
          personal data is transferred across borders — for example because of where our
          infrastructure or service providers are located — we take steps intended to keep that
          data protected to a standard consistent with this policy, wherever it is processed.
        </p>

        <h2>Data rights and how to exercise them</h2>
        <p>
          Depending on your location and role, you may have rights to access, correct, delete or
          export personal data, and to object to or restrict certain processing. Guardians can
          exercise these rights on behalf of a child. To make a request, use our{" "}
          <Link to="/contact" className="font-medium text-foreground underline underline-offset-4">
            contact page
          </Link>
          , and we will respond as required by applicable law.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy as the platform evolves or as our legal obligations change.
          Where a change is significant, we will take reasonable steps to bring it to the
          attention of guardians and schools before it takes effect.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy, or requests relating to personal data, can be sent through
          our{" "}
          <Link to="/contact" className="font-medium text-foreground underline underline-offset-4">
            contact page
          </Link>
          .
        </p>
      </LegalPage>
    </PublicPage>
  );
}
