import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  Users,
  GraduationCap,
  Building2,
  Network,
  Compass,
  LayoutDashboard,
  BookOpen,
  Trophy,
  ShieldCheck,
  Palette,
  BarChart3,
  Briefcase,
} from "lucide-react";

export type RoleKey = "child" | "parent" | "teacher" | "school" | "group";

export interface RoleDefinition {
  key: RoleKey;
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
  /** Placeholder sections that future work will fill in. */
  sections: { title: string; description: string; icon: LucideIcon }[];
}

export const roles: RoleDefinition[] = [
  {
    key: "child",
    label: "Child",
    description: "Create, learn and collect achievements in a safe space.",
    to: "/dashboard/child",
    icon: Sparkles,
    sections: [
      { title: "My Creations", description: "Projects and creative work will appear here.", icon: Palette },
      { title: "Learning Path", description: "Guided lessons and next steps.", icon: BookOpen },
      { title: "Achievements", description: "Badges, streaks and milestones.", icon: Trophy },
      { title: "Safe Space", description: "Age-appropriate settings and support.", icon: ShieldCheck },
    ],
  },
  {
    key: "parent",
    label: "Parent",
    description: "Oversee your children's activity, consent and wellbeing.",
    to: "/dashboard/parent",
    icon: Users,
    sections: [
      { title: "Linked Children", description: "Accounts under your guardianship.", icon: Users },
      { title: "Consent & Permissions", description: "Approvals and privacy controls.", icon: ShieldCheck },
      { title: "Progress Summary", description: "Learning and achievement overview.", icon: BarChart3 },
    ],
  },
  {
    key: "teacher",
    label: "Teacher",
    description: "Set work, review creations and track class progress.",
    to: "/dashboard/teacher",
    icon: GraduationCap,
    sections: [
      { title: "My Classes", description: "Groups of learners you support.", icon: Users },
      { title: "Assignments", description: "Tasks, briefs and submissions.", icon: BookOpen },
      { title: "Class Progress", description: "Attainment and engagement signals.", icon: BarChart3 },
    ],
  },
  {
    key: "school",
    label: "School Admin",
    description: "Manage staff, learners and school-level settings.",
    to: "/dashboard/school",
    icon: Building2,
    sections: [
      { title: "People", description: "Staff and learner accounts.", icon: Users },
      { title: "Safeguarding", description: "Policies and safety configuration.", icon: ShieldCheck },
      { title: "School Reporting", description: "Whole-school insight.", icon: BarChart3 },
    ],
  },
  {
    key: "group",
    label: "Education Group Admin",
    description: "Oversee multiple schools across a trust or group.",
    to: "/dashboard/group",
    icon: Network,
    sections: [
      { title: "Schools", description: "Institutions in your group.", icon: Building2 },
      { title: "Group Policies", description: "Shared standards and settings.", icon: ShieldCheck },
      { title: "Group Analytics", description: "Cross-school comparison.", icon: BarChart3 },
    ],
  },
];

export const roleByKey = Object.fromEntries(roles.map((r) => [r.key, r])) as Record<
  RoleKey,
  RoleDefinition
>;

export const dashboardNav = {
  overviewIcon: LayoutDashboard,
  alumni: {
    label: "Alumni (16+)",
    to: "/alumni",
    icon: Compass,
    description: "A separate environment for members aged 16 and over.",
    sections: [
      { title: "Portfolio", description: "Your archived and ongoing work.", icon: Palette },
      { title: "Opportunities", description: "Pathways, courses and roles.", icon: Briefcase },
      { title: "Community", description: "Alumni network and mentoring.", icon: Users },
    ],
  },
};
