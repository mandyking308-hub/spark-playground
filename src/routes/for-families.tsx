import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Baby,
  Eye,
  KeyRound,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { PublicPage } from "@/components/public/public-page";
import {
  CheckList,
  CtaBand,
  FeatureCard,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/public/sections";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/for-families")({
  head: () => ({
    meta: [
      { title: "For Families — Aurelia" },
      {
        name: "description",
        content:
          "How Aurelia works for families: the child creator experience, guardian approval of publication and sharing, and the controls parents keep at all times.",
      },
      { property: "og:title", content: "For Families — Aurelia" },
      {
        property: "og:description",
        content:
          "The child creator experience, guardian approval, and family permissions inside Aurelia.",
      },
      { property: "og:url", content: "/for-families" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/for-families" }],
  }),
  component: ForFamilies,
});

const childExperience = [
  { icon: Baby, title: "A place to make things", text: "Children use the Creator Studio to produce podcasts, writing, art, film and games inside age-appropriate tools designed for their stage of development." },
  { icon: ShieldCheck, title: "No open exposure", text: "There is no public feed, no follower count and no open messaging. A child's audience is always bounded — family, class, club or a specific challenge." },
  { icon: UserCheck, title: "Recognition that means something", text: "Work submitted for the Achievement Passport is reviewed by a verified teacher, so the record a child builds is real, not automatic." },
];

const guardianControls = [
  "Nothing a child makes is published or shared beyond the family until a guardian approves it.",
  "Guardians approve who can contact their child — a teacher, a club supervisor, a challenge organiser — and can withdraw that permission at any time.",
  "Guardians decide whether a child's work can appear in a school challenge, a club, or the wider Aurelia community.",
  "Guardians control what data is held about their child and can request a copy or deletion, subject to safeguarding retention rules.",
  "Guardians can restrict or switch off AI assistance for their child entirely.",
];

const visibility = [
  "Every piece of work the child has created, drafted or submitted, including versions that have not been shared further.",
  "Every approval decision the guardian has made, and who currently has permission to contact or view the child's work.",
  "Any verified achievement recorded on the child's Achievement Passport, and which teacher verified it.",
  "Any safeguarding communication that involves their child, handled through the same trusted reporting route as the rest of the platform.",
];

function ForFamilies() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="For families"
        title="A protected space for your child to create — with you holding the keys"
        description="Aurelia gives children a real studio to make things and a real record of what they achieve. It gives parents and guardians the final say over what leaves the family and who can reach their child."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/auth/join">Join with an invitation</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/safety-and-trust">See how safety works</Link>
            </Button>
          </>
        }
      />

      <Section>
        <SectionHeading
          eyebrow="The child experience"
          title="What your child can actually do"
          description="Aurelia is built as a genuine creative and learning environment, not a locked-down holding pen — the protection sits around the experience, not in place of it."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {childExperience.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="The guardian layer"
            title="Nothing leaves the family without you"
            description="A guardian sits above every child account. Publication, sharing, contact and data are all gated through explicit guardian decisions — not default settings a child could change."
          />
          <CheckList items={guardianControls} />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Joining Aurelia"
          title="How a family joins"
          description="Aurelia does not allow open self-registration for children. A family joins through a verified invitation, so there is always a trusted party who vouches for the connection."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <FeatureCard icon={Mail} title="An invitation arrives">
            A school, education group or another verified guardian sends an invitation to set up a family account, or a family requests one directly and is verified before access is granted.
          </FeatureCard>
          <FeatureCard icon={KeyRound} title="The guardian account is verified">
            The adult who will hold guardian responsibility is verified first, and it is that account which controls every child profile linked to it.
          </FeatureCard>
          <FeatureCard icon={Baby} title="Children are added by the guardian">
            The guardian creates each child's profile, sets initial permissions, and can add a second guardian to share oversight of the same child.
          </FeatureCard>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="What you can see"
          title="Full visibility into your child's world"
          description="A guardian account is not a dashboard bolted on afterwards — it is the account with authority, and it can see everything relevant to that authority."
        />
        <div className="mt-10">
          <CheckList items={visibility} />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Family permissions"
          title="Permissions that grow with your child, on your terms"
          description="As a child gets older, guardians can widen what they are able to do — more independence in the studio, participation in more challenges, broader visibility of their passport — but every widening is a deliberate guardian decision, never an automatic default."
        />
        <div className="mt-10 flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-6">
          <Eye className="mt-1 size-6 shrink-0 text-accent-foreground" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            If your child reaches 16 while using Aurelia, they move into the separate Alumni
            world through a deliberate transition, not an automatic merge. Parents keep continuity
            through Parent Alumni, without gaining access to the child-only environment their
            younger children may still be using.
          </p>
        </div>
      </Section>

      <CtaBand
        title="Bring your family into Aurelia"
        description="Aurelia is invitation-only. Request access and we will guide you through verified guardian onboarding."
      />
    </PublicPage>
  );
}
