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
          "Aurelia's verified adult-only parent community: circles, events and a directory, kept entirely separate from the child world, with Parent Alumni continuity at 16.",
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
  { icon: Users, title: "Circles", text: "Small groups of adults organised around a school, a club or a shared interest, giving parents a place to compare notes and support one another." },
  { icon: CalendarDays, title: "Events", text: "School and community events that parents can see, discuss and organise attendance around, kept separate from anything a child would see." },
  { icon: Contact, title: "Directory", text: "An opt-in directory of verified adults, with visibility controlled entirely by the parent who is listed — and no child named anywhere in it." },
];

const cardShows = [
  "The adult's own display name and, if they choose it, a photograph of themselves.",
  "A short self-written introduction.",
  "Broad interests or the circles they take part in.",
  "A general area or the school community they've chosen to associate with.",
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
  "Children cannot see, join, message or be added to the parent community at any age.",
  "Membership requires the same identity verification as any adult account on Aurelia.",
  "Parent Alumni status is an adult community status only — it never grants access to any child, including a member's own now-adult child's account.",
  "Circles, events and the directory operate under their own moderation, distinct from moderation of child-facing spaces.",
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
        <p className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
          Circles, events and the directory describe product direction for the parent community and
          are being rolled out to verified adult members — they are not all live today. The guardian
          controls over your own child's account, described on the families page, are part of the
          live platform.
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
                Verification happens once, at account level, and applies across every community
                feature. There is no separate signup that skips the check.
              </PaperNote>
            </div>
          }
        >
          <SectionHeading
            eyebrow="Verified adults only"
            title="Membership is verified, not open"
            description="Every member of the parent community has been through the same identity verification required of any guardian account, so the space stays trustworthy."
          />
          <CheckList
            className="mt-6"
            items={[
              "Verification happens once, at account level, and applies across every community feature.",
              "Parents choose what to share in the directory and can withdraw at any time.",
              "Moderation staff can act on reports within the community independently of child-side moderation.",
            ]}
          />
        </SplitFeature>
      </Section>

      {/* Adults only, on the card itself */}
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
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-foreground"
                  />
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
                  <span
                    aria-hidden="true"
                    className="mt-[0.6rem] h-px w-3 shrink-0 bg-muted-foreground/60"
                  />
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
          description="The parent community is held to the same safeguarding and conduct standards as the rest of Aurelia — reports are taken seriously and handled through a clear route."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <FeatureCard icon={ShieldCheck} title="Reportable at any time">
            Any parent can raise a concern about conduct within the community through the same trusted reporting channel used platform-wide.
          </FeatureCard>
          <FeatureCard icon={Contact} title="Independent moderation">
            Community moderation decisions are made by staff responsible for the adult spaces, distinct from those overseeing child safeguarding cases.
          </FeatureCard>
        </div>
      </Section>

      <CtaBand
        title="Join the parent community"
        description="Verified parents and guardians can request access to circles, events and the directory alongside their family account."
      />
    </PublicPage>
  );
}
