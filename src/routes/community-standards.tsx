import { Link, createFileRoute } from "@tanstack/react-router";

import { PublicPage } from "@/components/public/public-page";
import { LegalPage } from "@/components/public/sections";

export const Route = createFileRoute("/community-standards")({
  head: () => ({
    meta: [
      { title: "Community Standards — Aurelia" },
      {
        name: "description",
        content:
          "What is welcome and what is never allowed on Aurelia, how content is reviewed, and how decisions can be appealed.",
      },
      { property: "og:title", content: "Community Standards — Aurelia" },
      {
        property: "og:description",
        content:
          "Aurelia's community standards for creative work, conduct, review and appeals, including expectations for adults.",
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
        updated="August 2026"
        intro="These standards describe the kind of community Aurelia is built to be, and what we expect from every member — young or adult."
      >
        <h2>What is welcome</h2>
        <ul>
          <li>Original creative work — stories, art, film, podcasts, games, inventions and more — made and shared with pride.</li>
          <li>Constructive, kind feedback that helps a young creator improve.</li>
          <li>Honest effort and genuine authorship, including work made with clearly labelled AI assistance.</li>
          <li>Curiosity, ambition and experimentation, even when the result is unfinished or imperfect.</li>
        </ul>

        <h2>What is never allowed</h2>
        <ul>
          <li>Content that is unlawful, sexually explicit, or that exploits, endangers or sexualises a child in any way.</li>
          <li>Bullying, harassment, hateful or discriminatory conduct directed at any member.</li>
          <li>Attempts to contact a child outside the channels a guardian has approved, or to bypass age-separation controls.</li>
          <li>Passing off someone else's work as one's own, or presenting AI-generated work as entirely unassisted.</li>
          <li>Sharing another member's personal information without their and, where relevant, their guardian's consent.</li>
        </ul>

        <h2>How work is reviewed</h2>
        <p>
          Work that a guardian approves for wider sharing, and submissions to challenges or clubs,
          pass through a review step before they become visible beyond the family. Automated
          checks help flag potential issues, but decisions about what is published rest with
          trained staff. Members can report content or conduct at any time, which triggers the
          same review process described in our{" "}
          <Link
            to="/safeguarding-and-reporting"
            className="font-medium text-foreground underline underline-offset-4"
          >
            safeguarding and reporting
          </Link>{" "}
          approach.
        </p>

        <h2>How decisions are made and appealed</h2>
        <p>
          Where content is removed, or an account is restricted, we aim to explain the reason to
          the guardian responsible for that account. If a guardian believes a decision was made in
          error, they can raise this through our{" "}
          <Link to="/contact" className="font-medium text-foreground underline underline-offset-4">
            contact page
          </Link>{" "}
          for a further, human review. Decisions relating to an active safeguarding concern may be
          handled with additional care and confidentiality.
        </p>

        <h2>Standards for adults in the community</h2>
        <p>
          Parents, teachers, school administrators, education group administrators and 16+ alumni
          all interact with the platform under the same underlying respect and safety principles,
          adapted to their role. Adults must never use their access to contact a child outside
          approved channels, must respect the boundaries between the under-16 and 16+ environments,
          and are expected to model the constructive, encouraging feedback culture Aurelia is built
          around. Teachers and administrators additionally carry a responsibility to verify
          achievements honestly and to raise safeguarding concerns promptly.
        </p>
      </LegalPage>
    </PublicPage>
  );
}
