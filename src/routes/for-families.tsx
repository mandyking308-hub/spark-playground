import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Baby,
  CalendarClock,
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
  Eyebrow,
  FeatureCard,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/public/sections";
import {
  Figure,
  GoldRule,
  PaperNote,
  SplitFeature,
} from "@/components/public/editorial";
import { Button } from "@/components/ui/button";

import familyReview from "@/assets/family-review.jpg";
import storyArt from "@/assets/story-art.jpg";
import heroPodcast from "@/assets/hero-podcast.jpg";

export const Route = createFileRoute("/for-families")({
  head: () => ({
    meta: [
      { title: "For Families — Aurelia" },
      {
        name: "description",
        content:
          "How Aurelia works for families: what your child can make, how guardian approval works step by step, what you can see, and the calm boundaries that keep the experience safe.",
      },
      { property: "og:title", content: "For Families — Aurelia" },
      {
        property: "og:description",
        content:
          "Guardian approval, family visibility and the boundaries that protect a child's creative privacy inside Aurelia.",
      },
      { property: "og:url", content: "/for-families" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/for-families" }],
  }),
  component: ForFamilies,
});

const childExperience = [
  {
    icon: Baby,
    title: "A place to make things",
    text: "Your child uses the Creator Studio to produce podcasts, writing, art, film and games inside tools built for their stage of development — not a scaled-down adult app.",
  },
  {
    icon: ShieldCheck,
    title: "No open exposure",
    text: "There is no public feed, no follower count and no open messaging. Whoever might see a piece of work is always a bounded, known group — family, class, club or a specific challenge.",
  },
  {
    icon: UserCheck,
    title: "Recognition that means something",
    text: "Work put forward for the Achievement Passport is reviewed by a verified teacher, so the record your child builds reflects something an adult actually witnessed.",
  },
];

const approvalSteps = [
  {
    step: "01",
    title: "A request comes to you",
    text: "When your child wants to share or submit something beyond their own private space — to a class, a club, a challenge, or a specific contact — a request is sent to your guardian account. Nothing moves without it.",
  },
  {
    step: "02",
    title: "You see what they made",
    text: "You are shown the actual piece of work, who it would be shared with, and why. Not a summary — the thing itself, in enough context to make a real decision.",
  },
  {
    step: "03",
    title: "You approve or decline",
    text: "You say yes or no. A decline is not a punishment inside the product — it simply means the work stays where it is, private to your child, until you're ready to say yes.",
  },
  {
    step: "04",
    title: "You can withdraw later",
    text: "Approval is not permanent. If you change your mind about a contact, a club or a piece of shared work, you can withdraw that permission at any time.",
  },
];

const boundary = [
  "You can see every piece of work your child has shared or submitted, and every decision you've made about it.",
  "You can see verified achievements on their Achievement Passport, and which teacher verified each one.",
  "You are not shown every private draft sitting in their own space — a child is allowed a sketchbook that isn't yours to read, the same way a paper notebook would be.",
  "The moment a child wants that private work to go anywhere — a class, a club, a challenge — it comes to you first.",
];

const updatesVisibility = [
  "A calendar view of class briefs, challenge deadlines and club sessions your child is part of, with reminders so nothing catches you by surprise. This is product direction we are building toward, not a description of every feature live today.",
  "Family visibility of the approvals you've made and the work currently shared beyond your family, kept in one place rather than scattered across notifications — designed as a single calm view, with parts of it still being built.",
  "A running view of Achievement Passport progress — what has been verified, and by whom — so you can see the shape of what your child is building over time. Verification itself is live; the at-a-glance family view is planned.",
  "None of this involves real-time messaging with staff or other families, and Aurelia does not connect to third-party calendar, school or messaging systems. Anything described here is designed to happen inside Aurelia itself.",
];


const reassurance = [
  "No follower counts, no likes, no leaderboards — nothing that turns your child's work into a popularity contest.",
  "No adult can message your child directly. Contact permissions are set by you and can be withdrawn at any time.",
  "No advertising and no behavioural targeting of children. Aurelia does not build a profile of your child to sell attention against.",
];

function ForFamilies() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="For families"
        title="The first time they show someone what they made, you're it"
        description="Aurelia gives your child a real place to make things, and gives you the final word on anything that leaves the family. It is built so that moment — sharing something they made — stays exactly as it should feel: a bit nervous, and safe."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/auth/join">Join with an invitation</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact-enquiry">Ask us a question</Link>
            </Button>
          </>
        }
      >
        <div className="mt-12">
          <Figure
            src={heroPodcast}
            alt="Hands setting up a podcast microphone beside a handwritten episode plan"
            width={1536}
            height={1024}
            ratio="wide"
            priority
            label="Illustrative example"
          />
        </div>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="What your child can actually do"
          title="A real studio, not a locked room"
          description="The protection sits around the experience, not instead of it. Your child gets genuine creative tools; you get the controls that keep it safe."
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
        <SplitFeature
          image={
            <div className="space-y-4">
              <Figure
                src={familyReview}
                alt="A parent and child looking together at a drawing on a tablet, seen from behind"
                width={1280}
                height={960}
                label="Guardian approval"
              />
              <PaperNote tone="lined">
                A decline isn't a wall — it just keeps the work at home a little longer, until
                you're ready to say yes.
              </PaperNote>
            </div>
          }
        >
          <SectionHeading
            eyebrow="How guardian approval actually works"
            title="Nothing leaves the family without your yes"
            description="This isn't a one-time toggle buried in settings. It's a step that happens every time it matters."
          />
          <ol className="mt-8 space-y-5">
            {approvalSteps.map((item) => (
              <li key={item.step} className="flex gap-4">
                <span className="mt-1 font-display text-sm tracking-[0.2em] text-accent-foreground">
                  {item.step}
                </span>
                <span>
                  <span className="block font-medium">{item.title}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </SplitFeature>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Their privacy, your oversight</Eyebrow>
            <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              You see what's shared. Not every private draft.
            </h2>
            <GoldRule className="mt-6 w-24" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Children need somewhere to be messy, to try something and abandon it, to write a
              first version nobody sees. Aurelia respects that — your child's private drafts stay
              private to them, the way a notebook in a drawer would. The instant anything is meant
              to go further than that, it comes to you.
            </p>
          </div>
          <CheckList items={boundary} />
        </div>
      </Section>

      <Section tone="muted">
        <SplitFeature
          reverse
          image={
            <Figure
              src={storyArt}
              alt="An illustrated storybook spread with hand lettering and coloured pencils"
              width={1024}
              height={1024}
              ratio="square"
              label="Family view"
            />
          }
        >
          <SectionHeading
            eyebrow="Updates, events & visibility"
            title="One calm place to keep track, instead of a dozen notifications"
            description="For the adults around a young maker — parents, guardians, grandparents with permission — Aurelia is working toward a single, quiet view of what's coming up and what's already been achieved."
          />
          <CheckList className="mt-8" items={updatesVisibility} />
        </SplitFeature>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Joining Aurelia"
          title="How a family joins"
          description="Aurelia does not allow open self-registration for children. A family joins through a verified invitation, so there is always a trusted party who vouches for the connection."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <FeatureCard icon={Mail} title="An invitation arrives">
            A school or education group sends an invitation, or a family requests one directly
            and is verified before access is granted.
          </FeatureCard>
          <FeatureCard icon={KeyRound} title="The guardian account is verified">
            The adult who will hold guardian responsibility is verified first, and it is that
            account which controls every child profile linked to it.
          </FeatureCard>
          <FeatureCard icon={Baby} title="Children are added by the guardian">
            The guardian creates each child's profile, sets initial permissions, and can add a
            second guardian to share oversight of the same child.
          </FeatureCard>
        </div>
      </Section>

      <Section tone="ink">
        <div className="flex items-start gap-4 rounded-2xl border border-ink-foreground/15 bg-ink-foreground/5 p-8">
          <Eye className="mt-1 size-6 shrink-0 text-gold" aria-hidden="true" />
          <div>
            <h2 className="font-display text-2xl tracking-tight">
              The things we left out on purpose
            </h2>
            <ul className="mt-4 space-y-3">
              {reassurance.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-foreground/80">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button asChild variant="secondary">
                <Link to="/safety-and-trust">How safety is designed</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Not sure where to start?"
          title="Guides for families new to Aurelia"
          description="Practical ideas for a first project, and plain explanations of the guardian tools above, written for parents rather than developers."
        />
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/ideas-and-resources">Browse ideas & resources</Link>
          </Button>
        </div>
      </Section>

      <CtaBand
        title="Bring your family into Aurelia"
        description="Aurelia is invitation-only. Request access and we will guide you through verified guardian onboarding — or ask us anything first."
        primary={{ label: "Join with an invitation", to: "/auth/join" }}
        secondary={{ label: "Send an enquiry", to: "/contact-enquiry" }}
      />
    </PublicPage>
  );
}
