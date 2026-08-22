import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRightLeft,
  BriefcaseBusiness,
  FolderOpenDot,
  Users,
  UserRoundSearch,
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

export const Route = createFileRoute("/alumni-world")({
  head: () => ({
    meta: [
      { title: "Alumni World — Aurelia" },
      {
        name: "description",
        content:
          "Aurelia's separate 16+ environment: portfolio, opportunities, mentoring and community, entered through a deliberate transition at 16, never an automatic merge.",
      },
      { property: "og:title", content: "Alumni World — Aurelia" },
      {
        property: "og:description",
        content:
          "The separate adult environment members move into at 16 — portfolio, opportunities, mentoring and community.",
      },
      { property: "og:url", content: "/alumni-world" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/alumni-world" }],
  }),
  component: AlumniWorld,
});

const pillars = [
  { icon: FolderOpenDot, title: "Portfolio", text: "Everything verified on the Achievement Passport, and everything created since, carries forward into a portfolio the alumnus now owns and controls outright." },
  { icon: BriefcaseBusiness, title: "Opportunities", text: "Work experience, further study routes and early career opportunities suited to a 16 to 18-year-old, curated with the same care as the challenges they grew up with." },
  { icon: UserRoundSearch, title: "Mentoring", text: "Access to mentors — adults who can offer guidance on a craft, a subject or a career path, in a structured and moderated setting." },
  { icon: Users, title: "Community", text: "A community of peers at the same stage of life, with the open discussion and social features that would not be appropriate for a younger audience." },
];

const transition = [
  "The move to Alumni happens at 16, on a schedule the young person and their guardian can see coming in advance.",
  "It is a deliberate, one-way step into a new environment — not an automatic merge of the child account into an adult one.",
  "The young person's portfolio and Achievement Passport history move with them; the child-only social surface does not.",
  "Once in the Alumni world, the account is the young person's own, with adult-level control over privacy and sharing.",
];

function AlumniWorld() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="Alumni world"
        title="A separate world for the next stage, entered on purpose"
        description="At 16, Aurelia members step into a distinct environment built for young adults — with its own portfolio, opportunities, mentoring and community — through a deliberate transition rather than an automatic change of settings."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/achievement-passport">See the Achievement Passport</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/parent-community">Parent Alumni continuity</Link>
            </Button>
          </>
        }
      />

      <Section>
        <SectionHeading
          eyebrow="What's inside"
          title="Built for a young adult, not a grown-up child"
          description="The Alumni world keeps the things worth keeping from the under-16 experience — verified achievement, a real body of work — and adds what a 16 to 18-year-old actually needs next."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {pillars.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="The transition at 16"
            title="A deliberate step, not an automatic merge"
            description="Aurelia treats the move from the under-16 world to the Alumni world as a genuine transition, with its own moment and its own consent — not a background account upgrade."
          />
          <CheckList items={transition} />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Why the separation matters"
          title="Two different worlds need two different rules"
          description="The safeguards that protect an 11-year-old — no open messaging, no public profile, guardian approval on everything — would be the wrong fit for an 17-year-old preparing for further study or early work. Rather than compromise either group, Aurelia keeps the environments entirely separate."
        />
        <div className="mt-10 flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-6">
          <ArrowRightLeft className="mt-1 size-6 shrink-0 text-accent-foreground" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            There is no shared social surface between the two worlds. An Alumni member cannot see
            or contact current under-16 users, and the reverse is also true, regardless of family
            connection.
          </p>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Community and mentoring"
          title="Adult community, adult moderation"
          description="The Alumni community operates under moderation appropriate to its members' age — more open discussion, direct connection between peers, and mentoring relationships with vetted adults — while still holding to Aurelia's standards of conduct and respect."
        />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="For families"
          title="Parents keep continuity, not access"
          description="A parent whose child moves into the Alumni world can stay connected to the wider Aurelia parent community through Parent Alumni, but the Alumni account itself belongs to the young person, with adult-level privacy from that point on."
        />
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/parent-community">Read about Parent Alumni</Link>
          </Button>
        </div>
      </Section>

      <CtaBand
        title="Approaching 16 on Aurelia?"
        description="Families and Alumni-to-be can find out what to expect from the transition well before it happens."
      />
    </PublicPage>
  );
}
