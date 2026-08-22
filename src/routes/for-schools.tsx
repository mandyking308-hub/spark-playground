import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  ShieldAlert,
  Users2,
  Workflow,
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

export const Route = createFileRoute("/for-schools")({
  head: () => ({
    meta: [
      { title: "For Schools — Aurelia" },
      {
        name: "description",
        content:
          "How Aurelia works for schools: teacher briefs, pupil work review, Achievement Passport verification, class oversight, safeguarding and staff roles.",
      },
      { property: "og:title", content: "For Schools — Aurelia" },
      {
        property: "og:description",
        content:
          "Teacher briefs, verification, class oversight and safeguarding workflow for schools using Aurelia.",
      },
      { property: "og:url", content: "/for-schools" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/for-schools" }],
  }),
  component: ForSchools,
});

const staffRoles = [
  { icon: GraduationCap, title: "Teacher", text: "Sets briefs, reviews submitted work and verifies achievements for the classes they are assigned to — nothing outside that scope." },
  { icon: Users2, title: "School Admin", text: "Manages staff and class rosters, oversees safeguarding cases raised within the school, and reports to the education group where one exists." },
  { icon: ShieldAlert, title: "Designated safeguarding lead", text: "Receives escalated concerns, coordinates the school's response and maintains the audit trail of any case involving a pupil." },
];

const oversight = [
  "Teachers see only the pupils and classes they have been assigned, never the whole school by default.",
  "School Admins see aggregate and case-level information across the school, with every access logged.",
  "Guardian approval still governs whether a piece of work can be shared beyond the class, even once a teacher has reviewed it.",
  "Class rosters and staff assignments are set by the School Admin and enforced at the database level, not just in the interface.",
];

const safeguarding = [
  { step: "01", title: "A concern is raised", text: "By a pupil, a parent, a member of staff or through automated review flags on submitted content." },
  { step: "02", title: "It is triaged", text: "The designated safeguarding lead reviews the concern and decides on urgency and next steps." },
  { step: "03", title: "It is escalated where needed", text: "Serious concerns are escalated beyond the school through the same safeguarding route used platform-wide." },
  { step: "04", title: "It is recorded", text: "Every action taken is written to an auditable trail that the school can be held to account against." },
];

function ForSchools() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="For schools"
        title="Give pupils real briefs, and give teachers real oversight"
        description="Aurelia lets teachers set meaningful briefs, review the work pupils actually produce, and verify genuine achievement — inside a class structure with clear roles and a safeguarding workflow behind it."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/contact">Talk to us about your school</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/achievement-passport">See the Achievement Passport</Link>
            </Button>
          </>
        }
      />

      <Section>
        <SectionHeading
          eyebrow="Teacher briefs"
          title="Set the task, not just the platform"
          description="A teacher creates a brief for a class or a group within it — a project, a challenge response, a piece of coursework — and pupils submit their work against that brief inside the Creator Studio."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <FeatureCard icon={Workflow} title="Structured briefs">
            Briefs carry clear success criteria, so a teacher's review and a pupil's submission are working against the same expectations.
          </FeatureCard>
          <FeatureCard icon={FileCheck2} title="Draft and review cycle">
            Pupils can submit drafts before a final version, and teachers can give feedback that becomes part of the visible evidence of the work.
          </FeatureCard>
          <FeatureCard icon={ClipboardCheck} title="Review at the point of submission">
            Teachers review pupil work directly against the brief, rather than relying on a separate, disconnected marking system.
          </FeatureCard>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Achievement Passport"
          title="Verification with a named teacher behind it"
          description="When a teacher confirms that a pupil has genuinely demonstrated a skill or completed a piece of work to standard, that verification is written to the pupil's Achievement Passport — durable evidence the pupil keeps."
        />
        <div className="mt-10">
          <Button asChild variant="outline">
            <Link to="/achievement-passport">How the passport works</Link>
          </Button>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Class oversight"
            title="Scoped access, not blanket visibility"
            description="Oversight in Aurelia is built to mirror how a school actually works — a teacher sees their classes, a School Admin sees the school, and nobody sees more than their role requires."
          />
          <CheckList items={oversight} />
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Safeguarding workflow"
          title="A clear route from concern to resolution"
          description="Every school using Aurelia operates the same underlying safeguarding workflow, so a concern raised about a pupil is never left to informal handling."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {safeguarding.map((item) => (
            <li key={item.step} className="rounded-2xl border border-border/70 bg-card p-6">
              <span className="font-display text-sm tracking-[0.2em] text-accent-foreground">{item.step}</span>
              <h3 className="mt-3 font-display text-lg tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/safeguarding-and-reporting">Read the safeguarding model</Link>
          </Button>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Staff roles and setup"
          title="Roles built around real school structure"
          description="Every member of staff who touches Aurelia is assigned a role that matches their actual responsibility, and access follows that role automatically."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {staffRoles.map((role) => (
            <FeatureCard key={role.title} icon={role.icon} title={role.title}>
              {role.text}
            </FeatureCard>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A school is set up through an invitation from Aurelia or from its education group, with
          a School Admin verified first. That admin then invites teaching staff, builds class
          rosters, and coordinates with families as pupils are added — each step verified before
          the next is unlocked.
        </p>
      </Section>

      <CtaBand
        title="Bring Aurelia into your school"
        description="We work with schools individually to set up staff roles, classes and safeguarding contacts before any pupil joins."
      />
    </PublicPage>
  );
}
