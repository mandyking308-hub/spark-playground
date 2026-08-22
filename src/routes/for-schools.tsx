import { Link, createFileRoute } from "@tanstack/react-router";
import {
  GraduationCap,
  ShieldAlert,
  Users2,
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

import teacherEvidence from "@/assets/teacher-evidence.jpg";
import classroomMaking from "@/assets/classroom-making.jpg";
import challengeBrief from "@/assets/challenge-brief.jpg";

export const Route = createFileRoute("/for-schools")({
  head: () => ({
    meta: [
      { title: "For Schools — Aurelia" },
      {
        name: "description",
        content:
          "How Aurelia works for schools: the journey from brief to verified achievement, what verification asks of a teacher, safeguarding and oversight, and an educator resource library.",
      },
      { property: "og:title", content: "For Schools — Aurelia" },
      {
        property: "og:description",
        content:
          "Briefs, evidence, teacher verification, safeguarding and class oversight for schools using Aurelia.",
      },
      { property: "og:url", content: "/for-schools" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/for-schools" }],
  }),
  component: ForSchools,
});

const journey = [
  { step: "01", title: "Verified teacher & cohort", text: "A verified teacher is assigned to a class or cohort by the School Admin. Nothing below happens outside that assignment." },
  { step: "02", title: "Educator brief", text: "The teacher issues a brief with clear success criteria to that cohort — a real task, not a form to complete." },
  { step: "03", title: "The child submits their own project", text: "The pupil makes the work in the Creator Studio and chooses to submit an eligible project against the brief themselves." },
  { step: "04", title: "Teacher review", text: "The teacher reviews the submission and the evidence behind it, gives constructive feedback, and can request a revision instead of verifying." },
  { step: "05", title: "Revision, if asked for", text: "A revision request sends the work back to the pupil with specifics. The project keeps its history rather than starting again." },
  { step: "06", title: "Evidence-backed verification", text: "When the teacher is satisfied, they verify the skill demonstrated, and that evidence-backed achievement is written to the pupil's Achievement Passport." },
];

const oversight = [
  "Teachers see only the pupils and classes they have been assigned, never the whole school by default.",
  "School Admins see aggregate and case-level information across their own school, with every access logged.",
  "There is no cross-school directory of children. A school cannot browse, search or contact pupils belonging to another school or group.",
  "Where a school belongs to an education group, group-level oversight is reporting and governance — it does not create a shared pupil directory.",
  "Guardian approval still governs whether a piece of work can be shared beyond the class, even once a teacher has reviewed it.",
  "Class rosters and staff assignments are set by the School Admin and enforced at the database level, not just in the interface.",
];


const staffRoles = [
  { icon: GraduationCap, title: "Teacher", text: "Sets briefs, reviews submitted work and verifies achievements for the classes they are assigned to — nothing outside that scope." },
  { icon: Users2, title: "School Admin", text: "Manages staff and class rosters, oversees safeguarding cases raised within the school, and reports to the education group where one exists." },
  { icon: ShieldAlert, title: "Designated safeguarding lead", text: "Receives escalated concerns, coordinates the school's response and maintains the audit trail of any case involving a pupil." },
];

const updatesVisibility = [
  "Class and brief calendars showing what's due, what's in review and what's been verified — product direction, not a description of what is live today.",
  "Reminders for upcoming brief deadlines and pending verifications, so nothing sits unreviewed by accident — planned, and not yet live.",
  "School-level visibility of pupil progress toward the Achievement Passport, scoped to the classes a teacher is actually assigned. Aurelia is designed for this; the parts that are live are the verification workflow itself.",
  "Anything described here is designed to run inside Aurelia itself — it does not read from or write to a school's existing MIS, timetable or messaging systems.",
];


function ForSchools() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="For schools"
        title="Give pupils a real brief, and give teachers a real say in what counts"
        description="Aurelia lets a teacher set a genuine task, watch the work take shape, give feedback that matters, and verify what a pupil can actually do — inside clear roles and a safeguarding workflow behind it."
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/contact-enquiry">Talk to us about your school</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/achievement-passport">See the Achievement Passport</Link>
            </Button>
          </>
        }
      >
        <div className="mt-12">
          <Figure
            src={classroomMaking}
            alt="A sunlit classroom of students making things, seen from behind"
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
          eyebrow="The supported chain, end to end"
          title="Verified teacher, brief, pupil submission, review, verified Passport entry"
          description="This is the chain Aurelia supports today. Nothing skips a step, nothing is verified because it was popular, and a teacher can always send work back for revision rather than sign it off."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <Figure
              src={challengeBrief}
              alt="A printed challenge brief with a gold seal and a project label"
              width={1280}
              height={960}
              label="The brief"
            />
            <PaperNote tone="lined">
              A brief with clear success criteria means a teacher's review and a pupil's
              submission are working against the same expectations.
            </PaperNote>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {journey.map((item) => (
              <li key={item.step} className="rounded-2xl border border-border/70 bg-card p-6">
                <span className="font-display text-sm tracking-[0.2em] text-accent-foreground">
                  {item.step}
                </span>
                <h3 className="mt-3 font-display text-lg tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="muted">
        <SplitFeature
          reverse
          image={
            <Figure
              src={teacherEvidence}
              alt="A teacher and a student looking together at printed project evidence and sketches"
              width={1280}
              height={960}
              label="Verification"
            />
          }
        >
          <SectionHeading
            eyebrow="What verification asks of a teacher"
            title="A professional act, not a button"
            description="Verifying an achievement means a named teacher is putting their judgement behind it — that they reviewed the evidence and genuinely believe the pupil demonstrated the skill. It is deliberately harder to earn than a badge, and it is written to the pupil's Achievement Passport for them to keep."
          />
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link to="/achievement-passport">How the passport works</Link>
            </Button>
          </div>
        </SplitFeature>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Class oversight"
            title="Scoped access, not blanket visibility"
            description="Oversight in Aurelia mirrors how a school actually works — a teacher sees their classes, a School Admin sees the school, and nobody sees more than their role requires."
          />
          <CheckList items={oversight} />
        </div>
      </Section>

      <Section tone="muted">
        <div>
          <Eyebrow>Safeguarding and oversight</Eyebrow>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            A clear route from concern to resolution
          </h2>
          <GoldRule className="mt-6 w-24" />
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Every school using Aurelia operates the same underlying safeguarding workflow, in
            plain language: a concern raised by anyone — pupil, parent or staff — is triaged by
            the designated safeguarding lead, escalated where needed through the platform-wide
            reporting route, and recorded on an auditable trail the school can be held to account
            against. It is never left to informal handling.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/safety-and-trust">How safety is designed</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/safeguarding-and-reporting">Read the safeguarding model</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section>
        <SplitFeature
          image={
            <Figure
              src={challengeBrief}
              alt="A printed challenge brief with a gold seal, pinned notes and a project label"
              width={1280}
              height={960}
              label="Resource library"
            />
          }
        >
          <SectionHeading
            eyebrow="Resource library"
            title="Brief templates, ready to adapt"
            description="A growing set of static brief templates and project starters, written for teachers to adapt to their own class rather than use as-is."
          />
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link to="/ideas-and-resources">Browse ideas & resources</Link>
            </Button>
          </div>
        </SplitFeature>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Integration-ready architecture"
          title="Built to connect, honestly described"
          description="Aurelia does not currently integrate with any school MIS, LMS or timetabling system. The platform is built with an integration-ready architecture as a direction for the future, but nothing here should be read as a live integration claim — today, everything runs inside Aurelia itself."
        />
      </Section>

      <Section>
        <SplitFeature
          reverse
          image={
            <Figure
              src={classroomMaking}
              alt="Students making projects with cardboard, paint and laptops in a sunlit classroom"
              width={1536}
              height={1024}
              ratio="wide"
              label="School view"
            />
          }
        >
          <SectionHeading
            eyebrow="Updates, events & visibility"
            title="One place for a school to keep track"
            description="For teachers and school admins, Aurelia is working toward a single, quiet view of what's coming up and what's already been verified."
          />
          <CheckList className="mt-8" items={updatesVisibility} />
        </SplitFeature>
      </Section>

      <Section tone="muted">
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
        primary={{ label: "Talk to us", to: "/contact-enquiry" }}
        secondary={{ label: "Read the safeguarding model", to: "/safeguarding-and-reporting" }}
      />
    </PublicPage>
  );
}
