import { Link, createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Contact,
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
  { icon: Users, title: "Circles", text: "Small groups of parents organised around a school, a club or a shared interest, giving families a place to compare notes and support one another." },
  { icon: CalendarDays, title: "Events", text: "School and community events that parents can see, discuss and organise attendance around, kept separate from anything a child would see." },
  { icon: Contact, title: "Directory", text: "An opt-in directory that lets verified parents connect with one another, with visibility controlled entirely by the parent who is listed." },
];

const boundaries = [
  "No parent can browse, search or view another family's child through the parent community.",
  "The parent community has no view into a specific child's work, messages or Achievement Passport beyond what that child's own guardian shares.",
  "Children cannot see, join or be added to the parent community at any age.",
  "Membership requires the same identity verification as any adult account on Aurelia.",
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
