import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Ban,
  Bot,
  Fingerprint,
  Layers,
  Lock,
  ShieldCheck,
  Sliders,
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

export const Route = createFileRoute("/ai-and-children")({
  head: () => ({
    meta: [
      { title: "AI and Children — Aurelia" },
      {
        name: "description",
        content:
          "Aurelia's position on AI and children: bounded, age-banded assistance, clear authorship labelling, guardian and school controls, and human verification that never gives way to automated scoring.",
      },
      { property: "og:title", content: "AI and Children — Aurelia" },
      {
        property: "og:description",
        content:
          "Assistance with a boundary around it: bounded, labelled, controllable, and never a substitute for human verification.",
      },
      { property: "og:url", content: "/ai-and-children" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/ai-and-children" }],
  }),
  component: AiAndChildrenPage,
});

function AiAndChildrenPage() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="AI and children"
        title="Assistance with a boundary around it"
        description="Aurelia uses artificial intelligence carefully and narrowly, to help a young person think, plan and improve their own work. It is never used to generate finished work in a child's name, to replace human judgement, or to profile children for engagement."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/safety-and-trust">Read the wider safety model</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/for-families">How families control AI settings</Link>
            </Button>
          </>
        }
      />

      <Section>
        <SectionHeading
          eyebrow="Our position"
          title="AI should support authorship, never replace it"
          description="Every use of AI inside Aurelia is designed around a single principle: the work must remain genuinely the child's own, and everyone reviewing it must be able to tell what help, if any, was used."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <FeatureCard icon={Sliders} title="Bounded, age-banded">
            What AI can do for an eight-year-old is deliberately narrower than what it can do for
            a fifteen-year-old, and both are narrower than general-purpose AI tools.
          </FeatureCard>
          <FeatureCard icon={Fingerprint} title="Authorship labelling">
            Where AI has contributed to a piece of work, that contribution is labelled clearly, so
            verification never mistakes assisted work for unassisted work.
          </FeatureCard>
          <FeatureCard icon={UserCheck} title="Human verification stands">
            A teacher's judgement, not an AI score, remains the standard by which achievement is
            verified in the passport.
          </FeatureCard>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Bounded, age-banded assistance"
          title="Different help at different ages"
          description="AI capability inside the Creator Studio is tied to a child's age band and to settings a guardian or school has chosen, rather than offering the same open-ended assistant to every user."
        />
        <div className="mt-10">
          <CheckList
            items={[
              "Younger children see the most limited forms of assistance, focused on prompts, structure and encouragement rather than generated content.",
              "Older children within the under-16 range may have access to more capable assistance, always within limits set for their age band.",
              "Assistance is scoped to specific tasks inside a project — it does not operate as an open, general-purpose chat companion.",
              "AI never initiates contact with a child; it responds only within a project the child has opened.",
            ]}
          />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Authorship labelling"
          title="Verification depends on honesty about what helped"
          description="Because the Achievement Passport depends on teachers being able to trust what they are verifying, any AI contribution to a project is recorded and shown alongside the work."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <p className="text-base leading-relaxed text-muted-foreground">
            A teacher reviewing a submission can see where a child used assistance to structure an
            idea, check spelling, or explore an alternative approach, distinct from the parts of
            the work the child produced unaided. This is not a penalty against using assistance —
            it is what allows verification to remain meaningful.
          </p>
          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <Layers className="size-6 text-accent-foreground" aria-hidden="true" />
            <h3 className="mt-3 font-display text-lg tracking-tight">Labelled, not hidden</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Assisted sections of a project remain visible as such throughout drafting, review
              and, where relevant, verification — they are never quietly folded into the finished
              piece as if a child produced them alone.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Guardian and school controls"
          title="Families and schools decide how much AI is available"
          description="AI assistance in Aurelia is opt-in at the family and school level, not a default a parent has to work out how to switch off."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <FeatureCard icon={Sliders} title="Restrict by setting">
            Guardians can limit AI assistance to specific tasks or disciplines within the Creator
            Studio.
          </FeatureCard>
          <FeatureCard icon={Ban} title="Disable entirely">
            AI assistance can be switched off completely for a child's account, at the guardian's
            discretion, or by a school across its own accounts.
          </FeatureCard>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Data"
          title="Children's data does not train third-party models"
          description="Aurelia does not send a child's work, conversations or personal data to third-party AI providers for the purpose of training their models."
        />
        <div className="mt-8 flex items-start gap-4">
          <Lock className="mt-1 size-6 shrink-0 text-accent-foreground" aria-hidden="true" />
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Where third-party AI capability is used to power in-product assistance, it is
            configured to process the specific request needed and is not used to build or improve
            general models on the back of children's content.
          </p>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Human verification"
          title="A person always stands behind a verified achievement"
          description="No amount of AI assistance changes the fact that only a named, accountable adult can verify an achievement for the passport. There is no automated approval path."
        />
        <div className="mt-8">
          <ShieldCheck className="size-6 text-accent-foreground" aria-hidden="true" />
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            This is a deliberate limit on what AI is allowed to do inside Aurelia: it can support
            the making of work, but it never replaces the human judgement that turns that work
            into a recognised achievement.
          </p>
        </div>
      </Section>

      <CtaBand
        title="See where AI sits inside the wider platform"
        description="AI assistance is one part of a much larger safety architecture. Read how the rest of Aurelia is built to protect children."
        secondary={{ label: "Read the safety model", to: "/safety-and-trust" }}
      />
    </PublicPage>
  );
}
