import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BookOpenText,
  Film,
  Gamepad2,
  HeartHandshake,
  Lightbulb,
  Mic2,
  Palette,
  School,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { PublicPage } from "@/components/public/public-page";
import { CtaBand, Section, SectionHeading } from "@/components/public/sections";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/ideas-and-resources")({
  head: () => ({
    meta: [
      { title: "Ideas & Resources — Aurelia" },
      {
        name: "description",
        content:
          "Explore curated Aurelia project starters and family/educator resources by age band and interest — without behavioural recommendations.",
      },
    ],
  }),
  component: IdeasAndResourcesPage,
});

type Age = "all" | "under_9" | "9_12" | "13_15";
type Interest = "all" | "story" | "audio" | "film" | "art" | "invention" | "code" | "impact";

type Starter = {
  title: string;
  format: string;
  age: Exclude<Age, "all">[];
  interest: Exclude<Interest, "all">;
  icon: LucideIcon;
  prompt: string;
  outcome: string;
};

const starters: Starter[] = [
  { title: "Interview someone who knows something you don't", format: "Podcast", age: ["9_12", "13_15"], interest: "audio", icon: Mic2, prompt: "Choose one person, prepare five thoughtful questions and record a short conversation.", outcome: "A 3–6 minute edited audio story plus a reflection on what changed your mind." },
  { title: "The object with a secret life", format: "Story", age: ["under_9", "9_12"], interest: "story", icon: BookOpenText, prompt: "Pick an ordinary object and imagine what it does when nobody is watching.", outcome: "A short illustrated story, comic or narrated reading." },
  { title: "Make a one-minute documentary", format: "Film", age: ["9_12", "13_15"], interest: "film", icon: Film, prompt: "Find one tiny true story in your street, school, family or local environment.", outcome: "A planned, shot and edited one-minute film with a source note." },
  { title: "Design a poster that changes one behaviour", format: "Art & design", age: ["under_9", "9_12", "13_15"], interest: "art", icon: Palette, prompt: "Choose one action you want people to take and design for clarity, not decoration.", outcome: "A finished visual plus the thinking behind three design choices." },
  { title: "Fix one annoying everyday problem", format: "Invention", age: ["9_12", "13_15"], interest: "invention", icon: Wrench, prompt: "Notice something small that wastes time, creates mess or makes life harder. Prototype a better way.", outcome: "A prototype, sketch or model with test notes and one improvement." },
  { title: "Build a tiny game with one clear rule", format: "Coding & games", age: ["9_12", "13_15"], interest: "code", icon: Gamepad2, prompt: "Start with one action, one obstacle and one win condition. Keep the first version deliberately small.", outcome: "A playable prototype plus a short explanation of the logic." },
  { title: "Make one local thing better", format: "Social-impact challenge", age: ["under_9", "9_12", "13_15"], interest: "impact", icon: HeartHandshake, prompt: "Choose a real issue close to you and propose one practical response a small group could actually try.", outcome: "A pitch, poster, prototype or mini campaign with evidence for the need." },
];

const ageOptions: { value: Age; label: string }[] = [
  { value: "all", label: "All ages" },
  { value: "under_9", label: "Under 9" },
  { value: "9_12", label: "9–12" },
  { value: "13_15", label: "13–15" },
];

const interestOptions: { value: Interest; label: string }[] = [
  { value: "all", label: "All interests" },
  { value: "story", label: "Storytelling" },
  { value: "audio", label: "Podcast & voice" },
  { value: "film", label: "Film & media" },
  { value: "art", label: "Art & design" },
  { value: "invention", label: "Science & invention" },
  { value: "code", label: "Coding & games" },
  { value: "impact", label: "World & impact" },
];

const resources = [
  { icon: Users, audience: "Families", title: "Creation over consumption", text: "A practical family guide for helping screen time end with something made, learned or reflected on rather than simply consumed." },
  { icon: HeartHandshake, audience: "Families & educators", title: "How to give constructive feedback", text: "Use prompts that notice effort, choices and next steps without turning a child's work into a score or popularity contest." },
  { icon: School, audience: "Educators", title: "Starter brief template", text: "A simple brief structure: purpose, audience, constraints, evidence, reflection and verification criteria." },
  { icon: Sparkles, audience: "Educators", title: "From creative work to verified achievement", text: "Design evidence so a teacher can verify what the child actually did, not just what the finished object looks like." },
];

function IdeasAndResourcesPage() {
  const [age, setAge] = useState<Age>("all");
  const [interest, setInterest] = useState<Interest>("all");

  const filtered = useMemo(
    () => starters.filter((starter) => (age === "all" || starter.age.includes(age)) && (interest === "all" || starter.interest === interest)),
    [age, interest],
  );

  return (
    <PublicPage>
      <section className="border-b border-border/70 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-foreground">Ideas & Resources</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.02] tracking-[-0.04em] sm:text-6xl">Start with curiosity, not an algorithm.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">Browse static, curated project starters by age and interest. Nothing here learns a child's behaviour, ranks their attention or follows them around the platform.</p>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading eyebrow="Project starters" title="Seven ways to make something real" description="These are illustrative starter briefs, not live challenge submissions or customer work." />

        <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-muted/35 p-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium">
            <span>Age band</span>
            <select value={age} onChange={(event) => setAge(event.target.value as Age)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm">
              {ageOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>Interest</span>
            <select value={interest} onChange={(event) => setInterest(event.target.value as Interest)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm">
              {interestOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((starter) => {
            const Icon = starter.icon;
            return (
              <article key={starter.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-gold-soft text-gold-foreground"><Icon className="size-5" aria-hidden="true" /></div>
                  <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{starter.format}</span>
                </div>
                <h2 className="mt-5 font-display text-2xl tracking-tight">{starter.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{starter.prompt}</p>
                <div className="mt-5 rounded-xl bg-muted/50 p-4 text-sm leading-relaxed">
                  <strong className="font-medium text-foreground">Possible outcome:</strong> <span className="text-muted-foreground">{starter.outcome}</span>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 ? <p className="mt-8 text-sm text-muted-foreground">No starter matches those filters yet. Try another age band or interest.</p> : null}
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="For adults" title="Help the work grow without taking it over" description="Practical guides for families and educators around feedback, digital wellbeing, briefs and evidence." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <article key={resource.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-ink text-ink-foreground"><Icon className="size-5" aria-hidden="true" /></div>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{resource.audience}</span>
                </div>
                <h2 className="mt-5 font-display text-2xl tracking-tight">{resource.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{resource.text}</p>
              </article>
            );
          })}
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 rounded-3xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-foreground">Educator brief template</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight">A good brief creates room to think.</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Aurelia's live teacher workflow is built around scoped briefs and evidence. This public example shows the shape without pretending to create a live assignment.</p>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {["Purpose — why are we making this?", "Audience — who is it genuinely for?", "Constraints — what must be true?", "Evidence — what will show the work?", "Reflection — what changed while making it?", "Verification — what can an adult honestly stand behind?"].map((item, index) => (
              <li key={item} className="rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed"><span className="mr-2 font-display text-gold-foreground">{String(index + 1).padStart(2, "0")}</span>{item}</li>
            ))}
          </ol>
        </div>
      </Section>

      <CtaBand
        eyebrow="Ready to make"
        title="An idea is enough to begin."
        description="Children enter Aurelia through verified invitation. Schools and families can start by understanding the model and choosing the right onboarding path."
        primary={{ label: "Join with an invitation", to: "/auth/join" }}
        secondary={{ label: "For schools", to: "/for-schools" }}
      />
    </PublicPage>
  );
}
