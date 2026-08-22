import { Link, createFileRoute } from "@tanstack/react-router";

import { PublicPage } from "@/components/public/public-page";
import { LegalPage } from "@/components/public/sections";

export const Route = createFileRoute("/community-standards")({
  head: () => ({
    meta: [
      { title: "Community Standards — Aurelia World" },
      {
        name: "description",
        content:
          "What is welcome and prohibited on Aurelia World, how safety and moderation gates work, and how decisions can be reviewed.",
      },
      { property: "og:title", content: "Community Standards — Aurelia World" },
      {
        property: "og:description",
        content:
          "Aurelia World's standards for creative work, conduct, safety, moderation and review, operated by Global Solutions Management LLC.",
      },
      { property: "og:url", content: "/community-standards" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/community-standards" }],
  }),
  component: CommunityStandards,
});

function CommunityStandards() {
  return (
    <PublicPage>
      <LegalPage
        title="Community Standards"
        updated="22 August 2026 — prepared for counsel review"
        intro="These standards apply to Aurelia World, a service operated by Global Solutions Management LLC, and describe the behaviour and content expected from every young or adult member."
      >
        <h2>What is welcome</h2>
        <ul>
          <li>Original creative work — stories, art, film, podcasts, games, inventions and more — made and shared with care.</li>
          <li>Constructive, kind feedback that helps a young creator improve.</li>
          <li>Honest effort and genuine authorship, including appropriate disclosure of material AI assistance.</li>
          <li>Curiosity, ambition and experimentation, including unfinished work kept privately.</li>
        </ul>

        <h2>What is never allowed</h2>
        <ul>
          <li>Content or conduct that exploits, grooms, endangers, threatens or sexualises a child.</li>
          <li>Sexually explicit, unlawful, hateful, discriminatory, harassing or seriously harmful content or conduct.</li>
          <li>Attempts to contact a child outside approved pathways or to bypass age, identity, permission, moderation or security controls.</li>
          <li>Publishing another person's personal, contact or precise-location information without lawful authority.</li>
          <li>Passing off another person's work as one's own or materially misrepresenting AI-generated work as unassisted authorship.</li>
          <li>Fraud, impersonation, malicious software, scraping, credential theft, security probing or attempts to interfere with the platform.</li>
          <li>Using child data for behavioural advertising, commercial profiling, lead generation or unauthorised solicitation.</li>
        </ul>

        <h2>Private work and wider sharing</h2>
        <p>
          A child's draft is private by default. Requesting to share a project does not itself make
          the work visible to a wider audience. Where wider sharing is enabled, the project must
          complete the permission, safety and moderation steps required by the relevant product
          flow before any approved audience can receive it.
        </p>
        <p>
          A guardian's approval alone does not publish a project. Features that do not yet have the
          required protection — including protected media scanning/quarantine — remain unavailable
          rather than bypassing the safety gate.
        </p>

        <h2>Reports, moderation and protective action</h2>
        <p>
          Members can report content or conduct through the platform and through our{" "}
          <Link
            to="/safeguarding-and-reporting"
            className="font-medium text-foreground underline underline-offset-4"
          >
            safeguarding and reporting
          </Link>{" "}
          information. GSM may restrict visibility, preserve evidence, remove content, suspend
          features or accounts, or take other proportionate protective action where reasonably
          necessary for safety, security, legal compliance or enforcement of these standards.
        </p>
        <p>
          Automated tools may be introduced to assist with detection or prioritisation only when
          the relevant feature is actually operational and appropriately governed. We do not
          describe a safety scan as completed merely because a project has entered a pending state.
          Human review remains important for moderation decisions affecting wider publication.
        </p>

        <h2>Review and appeals</h2>
        <p>
          Where appropriate, we aim to explain a removal or restriction to the responsible adult
          or institutional administrator. A person who believes a decision was made in error can
          request further human review through our{" "}
          <Link to="/contact" className="font-medium text-foreground underline underline-offset-4">
            contact page
          </Link>
          . We may limit information where disclosure could compromise a child-safety, security,
          legal or law-enforcement investigation.
        </p>

        <h2>Standards for adults</h2>
        <p>
          Parents, guardians, teachers, administrators, sponsors and 16+ alumni must respect the
          boundaries of their verified roles. No adult may treat sponsorship, employment,
          educational authority or community membership as permission to browse a child's private
          workspace, contact a child outside approved pathways, or extract child data for unrelated
          purposes. Teachers and administrators must verify achievements honestly and raise serious
          safety concerns promptly.
        </p>

        <h2>Enforcement and legal duties</h2>
        <p>
          These standards form part of the Aurelia World Terms of Use. They do not limit GSM's
          ability or obligation to take additional steps where required by applicable child-safety,
          privacy, criminal, platform or other law.
        </p>
      </LegalPage>
    </PublicPage>
  );
}
