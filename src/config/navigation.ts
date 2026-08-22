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
  CalendarDays,
  HeartHandshake,
  UserRoundCheck,
  Mic2,
  IdCard,
  UsersRound,
  Flag,
  Bell,
  CreditCard,
  ClipboardList,
  UserPlus,
} from "lucide-react";

export type RoleKey = "child" | "parent" | "parent_alumni" | "teacher" | "school" | "group";

export interface RoleDefinition {
  key: RoleKey;
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
  sections: { title: string; description: string; icon: LucideIcon }[];
}

export const roles: RoleDefinition[] = [
  {
    key: "child",
    label: "Child",
    description: "Create, learn and collect achievements in a protected space.",
    to: "/dashboard/child",
    icon: Sparkles,
    sections: [
      { title: "My Creations", description: "Podcasts, stories, art, video and projects.", icon: Palette },
      { title: "Discover", description: "Curated ideas, shows, clubs and learning by interest.", icon: BookOpen },
      { title: "Achievements", description: "Awards, certificates, skills and milestones.", icon: Trophy },
      { title: "Safe Space", description: "Age-appropriate privacy, AI and support settings.", icon: ShieldCheck },
    ],
  },
  {
    key: "parent",
    label: "Parent",
    description: "Support your children and connect with the verified adult school community.",
    to: "/dashboard/parent",
    icon: Users,
    sections: [
      { title: "Linked Children", description: "Accounts under your verified guardianship.", icon: Users },
      { title: "Consent & Permissions", description: "Publishing, privacy and AI controls.", icon: ShieldCheck },
      { title: "Parent Community", description: "Verified school and group parent connections.", icon: Network },
      { title: "Events & Volunteering", description: "Meet-ups, talks, volunteering and community activity.", icon: CalendarDays },
    ],
  },
  {
    key: "parent_alumni",
    label: "Parent Alumni",
    description: "Stay connected to the adult community after your child leaves.",
    to: "/dashboard/parent-alumni",
    icon: UserRoundCheck,
    sections: [
      { title: "Alumni Parent Directory", description: "Connect with verified former parents.", icon: Users },
      { title: "Professional & Interest Groups", description: "Build useful relationships around work and shared interests.", icon: Network },
      { title: "Events & Reunions", description: "Stay part of the school and group community.", icon: CalendarDays },
      { title: "Volunteer & Give Back", description: "Support projects, talks, fundraising and philanthropy.", icon: HeartHandshake },
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
    description: "Manage staff, learners, community and school-level settings.",
    to: "/dashboard/school",
    icon: Building2,
    sections: [
      { title: "People", description: "Staff, learner and verified parent accounts.", icon: Users },
      { title: "Safeguarding", description: "Policies, moderation and safety configuration.", icon: ShieldCheck },
      { title: "School Reporting", description: "Whole-school insight.", icon: BarChart3 },
      { title: "Community", description: "Parent, alumni-parent and school events.", icon: Network },
    ],
  },
  {
    key: "group",
    label: "Education Group Admin",
    description: "Oversee schools and communities across a trust or group.",
    to: "/dashboard/group",
    icon: Network,
    sections: [
      { title: "Schools", description: "Institutions in your group.", icon: Building2 },
      { title: "Group Policies", description: "Shared standards and settings.", icon: ShieldCheck },
      { title: "Group Analytics", description: "Cross-school comparison.", icon: BarChart3 },
      { title: "Group Community", description: "Cross-school challenges, parents and alumni-parent engagement.", icon: Users },
    ],
  },
];

export const roleByKey = Object.fromEntries(roles.map((r) => [r.key, r])) as Record<
  RoleKey,
  RoleDefinition
>;

export const platformModules = [
  { key: "creator", label: "Creator Studio", to: "/dashboard/creator", icon: Mic2, audience: "Under-16" },
  { key: "shows", label: "My Shows", to: "/dashboard/shows", icon: Mic2, audience: "Under-16" },
  { key: "discover", label: "Discover", to: "/dashboard/discover", icon: Compass, audience: "Under-16" },
  { key: "passport", label: "Achievement Passport", to: "/dashboard/passport", icon: IdCard, audience: "Under-16" },
  { key: "challenges", label: "Challenges", to: "/dashboard/challenges", icon: Trophy, audience: "Under-16" },
  { key: "clubs", label: "Clubs", to: "/dashboard/clubs", icon: UsersRound, audience: "Under-16" },
  { key: "parent-community", label: "Parent Community", to: "/dashboard/parent-community", icon: UsersRound, audience: "Adults" },
  { key: "parent-alumni-community", label: "Parent Alumni Network", to: "/dashboard/parent-alumni-community", icon: UserRoundCheck, audience: "Adults" },
  { key: "invitations", label: "Invitations", to: "/dashboard/invitations", icon: UserPlus, audience: "Verified issuers" },
  { key: "ai-controls", label: "AI Controls", to: "/dashboard/ai-controls", icon: ShieldCheck, audience: "Parents & staff" },
  { key: "privacy", label: "Privacy & Consent", to: "/dashboard/privacy", icon: ShieldCheck, audience: "Parents & staff" },
  { key: "notifications", label: "Notifications", to: "/dashboard/notifications", icon: Bell, audience: "Members" },
  { key: "safeguarding", label: "Safeguarding Centre", to: "/dashboard/safeguarding", icon: ShieldCheck, audience: "Staff" },
  { key: "organisations", label: "Organisation Spaces", to: "/dashboard/organisations", icon: Building2, audience: "Partners" },
  { key: "licensing", label: "Licensing & Billing", to: "/dashboard/licensing", icon: CreditCard, audience: "Payers & admins" },
  { key: "audit", label: "Audit & Compliance", to: "/dashboard/audit", icon: ClipboardList, audience: "Enterprise" },
] as const;

export const dashboardNav = {
  overviewIcon: LayoutDashboard,
  reportIcon: Flag,
  alumni: {
    label: "Alumni (16+)",
    to: "/alumni",
    icon: Compass,
    description: "A separate environment for members aged 16 and over.",
    sections: [
      { title: "Portfolio", description: "Approved work carried forward from childhood plus ongoing work.", icon: Palette },
      { title: "Opportunities", description: "University, apprenticeships, internships and careers.", icon: Briefcase },
      { title: "Community", description: "Alumni networking, mentoring and entrepreneurship.", icon: Users },
    ],
  },
};
