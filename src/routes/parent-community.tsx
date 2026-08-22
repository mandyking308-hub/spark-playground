import { Link, createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Contact,
  EyeOff,
  ShieldCheck,
  Users,
  UserRoundCheck,
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
import { Figure, GoldRule, PaperNote, SplitFeature } from "@/components/public/editorial";
import { Button } from "@/components/ui/button";

import adultsCommunity from "@/assets/adults-community.jpg";
import familyReview from "@/assets/family-review.jpg";

export const Route = createFileRoute("/parent-community")({
  head: () => ({
    meta: [
      { title: "Parent Community — Aurelia" },
      {
        name: "description",
        content:
          "Aurelia's verified adult-only parent community: live circles, events and an opt-in directory, kept entirely separate from the child world, with Parent Alumni continuity at 16.",
      },
      { property: "og:title", content: "Parent Community — Aurelia" },
      {
        property: "og:description",
        content:
          "A verified, adult-only space for parents and guardians, entirely separate from the child world.",
      },
      { property: "og:url", content: "/parent-community" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/parent-community" }],
  }),
  component: ParentCommunity,
});

const features = [
  { icon: Users, title: "Circles", text: "Create and join small groups of verified adults around professions, places, interests or community projects, with discussion contained inside the adult space." },
  { icon: CalendarDays, title: "Events", text: "Create adult community events, see upcoming dates and RSVP inside Aurelia, kept separate from anything a child would see." },
  { icon: Contact, title: "Directory", text: "An opt-in directory of verified adults, with visibility controlled entirely by the parent who is listed — and no child named anywhere in it." },
];

const cardShows = [
  "The adult's own display name.",
  "An optional professional headline.",
  "A short self-written introduction.",
  "A general area they choose to share.",
];

const cardNeverShows = [
  "Any child's name, photograph, age or year group.",
  "The number of children in a household, or their school class.",
  "Any child's work, drafts, Passport achievements or activity.",
  "Home addresses or private contact details.",
];

const boundaries = [
  "No parent can browse, search or view another family's child through the parent community.",
  "No child identifiers appear in the adult directory or on community cards — the community describes adults only.",
  "The parent community has no view into a specific child's work, private drafts or Achievement Passport beyond what that child's own guardian shares.",
  "Children cannot see, join, post in or be added to the parent community at any age.",
  "Adult community access is restricted to eligible parent and Parent Alumni accounts.",
  "Parent Alumni status is an adult community status only — it never grants access to any child, including a member's own now-adult child's account.",
  "Adult circles, connections and events use their own data tables with no child-content foreign keys.",
];

function ParentCommunity() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="Parent community"
        title="A room for the grown-ups, once the kids are busy making things"
        description="Alongside the guardian controls every parent has over their own child's account, Aurelia offers a separate adult-only community — circles, events and a directory — with no bridge into the world their children use."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/auth/join">Join with an invitation</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/for-families">See the guardian controls</Link>
            </Button>
          </>
        }
      >
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <Figure
            src={adultsCommunity}
            alt="A small group of adults talking around a table in a sunlit room, notebooks open"
            width={1280}
            height={960}
            label="Illustrative · Parent circle"
            priority
          />
          <Figure
            src={familyReview}
            alt="A parent and child looking together at a drawing on a tablet, seen from behind"
            width={1280}
            height={960}
            label="Illustrative · At home"
          />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Images are illustrative examples created for Aurelia. They are not member work and do not
          depict identifiable people.
        </p>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="What's inside"
          title="A community built for parents, not for children"
          description="The parent community exists to support the adults raising the children who use Aurelia — not to extend the child experience upward. It reads and feels like a room full of adults, because it is one."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map((item) => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.text}
            </FeatureCard>
          ))}
        </div>
        <p className="mt-6 rounded-xl border border-gold/35 bg-gold-soft/35 p-4 text-xs leading-relaxed text-muted-foreground">
          The adult directory, connection requests, parent circles, circle posts, adult events and
          RSVPs are now backed by Aurelia's live protected database. They remain available only to
          eligible signed-in parent accounts; an empty community shows an honest empty state rather
          than invented members or activity.
        </p>
      </Section>

      <Section tone="muted">
        <SplitFeature
          reverse
          image={
            <div className="space-y-4">
              <Figure
                src={adultsCommunity}
                alt="Adults in conversation around a table, coffee cups and notebooks between them"
                width={1280}
                height={960}
                label="Verified adults"
              />
              <PaperNote tone="lined">
                Adult community access is tied to the member's account role. There is no separate
                community signup that bypasses the platform's access controls.
              </PaperNote>
            </div>
          }
        >
          <SectionHeading
            eyebrow="Verified adults only"
            title="Membership is controlled, not open"
            description="The parent community sits behind Aurelia's authenticated adult account boundary, so its social layer cannot become an open route into the child world."
          />
          <CheckList
            className="mt-6"
            items={[
              "Only eligible parent and Parent Alumni accounts can load the adult community.",
              "Parents choose what to share in the directory and can hide their profile at any time.",
              "Connection requests, circle membership and event RSVPs remain adult-to-adult records.",
            ]}
          />
        </SplitFeature>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="A community of adults"
          title="A community card describes a grown-up, and only a grown-up"
          description="It would be easy to build a parent community that quietly becomes a directory of children. Aurelia does not. A member's card carries their own identity — never their child's."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <UserRoundCheck className="size-5 text-accent-foreground" aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg tracking-tight">What a card can show</h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
              {cardShows.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-6">
            <EyeOff className="size-5 text-muted-foreground" aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg tracking-tight">What never appears</h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
              {cardNeverShows.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-[0.6rem] h-px w-3 shrink-0 bg-muted-foreground/60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Circles and events are conversations between adults. They carry no messaging route to a
          child and no window into a child's private drafts — a parent's sight of their own child's
          work comes only through the guardian controls on their own account.
        </p>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Boundaries"
          title="Where the parent community stops"
          description="The parent community is deliberately bounded so that it never becomes a way to reach or observe children beyond what their own guardian already controls."
        />
        <GoldRule className="mt-6 w-16" />
        <div className="mt-8">
          <CheckList items={boundaries} />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Parent Alumni"
          title="Continuity when your child turns 16"
          description="When a child moves into Aurelia's 16+ Alumni world, their parent does not lose the relationships and community built up over the years — but nor do they gain any new access into their now-adult child's world."
        />
        <div className="mt-10 flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-6">
          <UserRoundCheck className="mt-1 size-6 shrink-0 text-accent-foreground" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Parent Alumni keeps a parent connected to the wider Aurelia parent community after
            their child turns 16, while respecting that the young person's Alumni account and
            portfolio belong to them alone from that point forward.
          </p>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Safety"
          title="The same standards, a different audience"
          description="The adult community remains subject to Aurelia's conduct and reporting standards, while its database boundary stays separate from child records and child-facing spaces."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <FeatureCard icon={ShieldCheck} title="Reportable at any time">
            A parent can use Aurelia's trusted reporting route if conduct in the community raises a concern.
          </FeatureCard>
          <FeatureCard icon={Contact} title="Adult-only data model">
            Directory profiles, connections, circles, posts, events and RSVPs are stored as adult-community records with no child-content relationship.
          </FeatureCard>
        </div>
      </Section>

      <CtaBand
        title="Join the parent community"
        description="Eligible verified parents and Parent Alumni can use the live directory, circles and events alongside their family account."
      />
    </PublicPage>
  );
}
