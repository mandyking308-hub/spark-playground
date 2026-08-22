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
  component: ForSchools;
});

function unused() {}
