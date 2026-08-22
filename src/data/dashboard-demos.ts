import {
  Award,
  BadgeCheck,
  Blocks,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  ClipboardList,
  Compass,
  FileCheck2,
  GraduationCap,
  HeartHandshake,
  Landmark,
  LineChart,
  MessageCircleHeart,
  Mic2,
  Network,
  Palette,
  ReceiptText,
  ScrollText,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DemoModule {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface DemoMetric {
  /** Illustrative only — never a real platform statistic. */
  label: string;
  value: string;
}

export interface DemoPanel {
  title: string;
  description: string;
  rows: { primary: string; secondary: string; status: string }[];
}

export interface DashboardDemo {
  key: string;
  label: string;
  audience: string;
  headline: string;
  summary: string;
  icon: LucideIcon;
  modules: DemoModule[];
  metrics: DemoMetric[];
  panel: DemoPanel;
  boundaries: string[];
}

export const sharingJourney = [
  { step: "Draft", description: "Private by default — only the child can see it." },
  { step: "Safety scan", description: "Automated media and text checks run before anything moves on." },
  { step: "Parent approval", description: "A verified parent or guardian decides whether it may travel further." },
  { step: "Moderation", description: "A verified adult reviews context before anything is published." },
  { step: "Approved audience", description: "Visible only to the approved audience — never an open public feed." },
] as const;

export const dashboardDemos: DashboardDemo[] = [
  {
    key: "child",
    label: "Child",
    audience: "Under-16 member",
    headline: "A protected place to make things",
    summary:
      "The under-16 workspace is built around making, not scrolling. No follower counts, no open directory, no strangers.",
    icon: Palette,
    modules: [
      { title: "Create / Creator Studio", description: "Podcasts, stories, art, film, games and inventions.", icon: Mic2 },
      { title: "Challenges", description: "Purposeful briefs set by schools, groups and approved partners.", icon: Trophy },
      { title: "Clubs", description: "Small, supervised interest and project clubs.", icon: UsersRound },
      { title: "My Passport", description: "Projects, skills, awards and milestones in one place.", icon: BookOpen },
      { title: "Sharing", description: "Request wider sharing and see what is awaiting approval.", icon: Share2 },
      { title: "Feedback", description: "Constructive encouragement without popularity scoring.", icon: MessageCircleHeart },
    ],
    metrics: [
      { label: "Projects in studio", value: "7" },
      { label: "Passport entries", value: "12" },
      { label: "Clubs joined", value: "2" },
    ],
    panel: {
      title: "My projects",
      description: "Illustrative demo projects — not a real child's work.",
      rows: [
        { primary: "Rockpool Radio — Episode 3", secondary: "Podcast · 8 min", status: "Awaiting parent approval" },
        { primary: "The Lighthouse Keeper", secondary: "Story · 14 pages", status: "Private draft" },
        { primary: "Recycled city model", secondary: "Invention · photo series", status: "Shared with class" },
      ],
    },
    boundaries: [
      "No direct messaging between children.",
      "No follower counts or popularity ranking.",
      "No open child directory and no contact sharing.",
    ],
  },
  {
    key: "parent",
    label: "Parent",
    audience: "Verified parent or guardian",
    headline: "Approval, not surveillance",
    summary:
      "Parents hold the consent layer: who a child's work reaches, which AI assistance is available, and which activities are allowed.",
    icon: HeartHandshake,
    modules: [
      { title: "Linked children", description: "Each sponsored child account, clearly separated.", icon: UsersRound },
      { title: "Permissions & consent", description: "Sharing scope, media, clubs and challenge participation.", icon: ShieldCheck },
      { title: "AI controls", description: "Age-banded assistance limits with authorship labelling.", icon: Sparkles },
      { title: "Parent community", description: "Verified adult community spaces.", icon: Network },
      { title: "Events", description: "Approved school and club events (product direction).", icon: CalendarDays },
    ],
    metrics: [
      { label: "Linked children", value: "2" },
      { label: "Requests awaiting review", value: "3" },
      { label: "Consents on record", value: "9" },
    ],
    panel: {
      title: "Waiting for you",
      description: "Illustrative approval queue.",
      rows: [
        { primary: "Share podcast with year group", secondary: "Requested by Ella · today", status: "Needs approval" },
        { primary: "Join Coding Club", secondary: "Verified school club", status: "Needs approval" },
        { primary: "Enter Ocean Challenge", secondary: "Approved partner brief", status: "Approved" },
      ],
    },
    boundaries: [
      "Private drafts stay private — approval is requested, not browsed.",
      "Consent is recorded and revocable.",
      "No advertising or profiling of children.",
    ],
  },
  {
    key: "parent-alumni",
    label: "Parent Alumni",
    audience: "Parent after their child turns 16",
    headline: "Community continuity for adults",
    summary:
      "Parents who have been part of Aurelia keep an adult-only community space once their child moves on.",
    icon: UserRoundCheck,
    modules: [
      { title: "Adult network", description: "Verified adult-to-adult connections only.", icon: Network },
      { title: "Events & reunions", description: "School and cohort gatherings (product direction).", icon: CalendarDays },
      { title: "Interest & professional groups", description: "Opt-in groups by interest, region or profession.", icon: UsersRound },
      { title: "Giving back", description: "Offer mentoring, briefs or opportunities to adult members.", icon: HeartHandshake },
    ],
    metrics: [
      { label: "Groups joined", value: "4" },
      { label: "Upcoming events", value: "2" },
      { label: "Contributions offered", value: "1" },
    ],
    panel: {
      title: "Your adult community",
      description: "Illustrative activity.",
      rows: [
        { primary: "Coastal Schools reunion", secondary: "Regional event", status: "Registered" },
        { primary: "Careers & mentoring group", secondary: "Professional group", status: "Member" },
        { primary: "Offer a design brief", secondary: "Giving back", status: "Draft" },
      ],
    },
    boundaries: [
      "Adult-only space — no under-16 members.",
      "Opt-in directory with no contact details exposed by default.",
    ],
  },
  {
    key: "teacher",
    label: "Teacher",
    audience: "Verified school staff",
    headline: "Set work, review it, verify achievement",
    summary:
      "Teachers work with classes and briefs, review submitted work in context, and issue verified achievement evidence.",
    icon: GraduationCap,
    modules: [
      { title: "Classes", description: "Groups of invited pupils held by the school.", icon: UsersRound },
      { title: "Briefs & assignments", description: "Create purposeful briefs with clear success criteria.", icon: ClipboardList },
      { title: "Review", description: "Read submissions with safeguarding context alongside.", icon: FileCheck2 },
      { title: "Passport verification", description: "Confirm skills and achievements through an accountable workflow.", icon: BadgeCheck },
    ],
    metrics: [
      { label: "Classes", value: "3" },
      { label: "Submissions to review", value: "18" },
      { label: "Verifications this term", value: "24" },
    ],
    panel: {
      title: "Review queue",
      description: "Illustrative submissions.",
      rows: [
        { primary: "Year 6 — Ocean brief", secondary: "9 submissions", status: "In review" },
        { primary: "Podcast unit — episode drafts", secondary: "5 submissions", status: "Feedback sent" },
        { primary: "Skill: research & referencing", secondary: "4 verification requests", status: "Awaiting verification" },
      ],
    },
    boundaries: [
      "Teachers see work submitted to them, not private drafts.",
      "Verification is attributed to a named, accountable issuer.",
    ],
  },
  {
    key: "school-admin",
    label: "School Admin",
    audience: "School leadership",
    headline: "Run the school safely",
    summary:
      "School administrators manage people and invitations, safeguarding routes, reporting and licensing in one place.",
    icon: Building2,
    modules: [
      { title: "People & invitations", description: "Staff, pupils and guardians by invitation only.", icon: UsersRound },
      { title: "Safeguarding", description: "Concern routing, triage and audit trail.", icon: ShieldCheck },
      { title: "School reporting", description: "Participation and achievement summaries.", icon: LineChart },
      { title: "Community", description: "School-run clubs, challenges and parent spaces.", icon: Compass },
      { title: "Licensing overview", description: "Seats, renewal dates and institutional terms.", icon: ReceiptText },
    ],
    metrics: [
      { label: "Active seats", value: "412" },
      { label: "Open safeguarding items", value: "1" },
      { label: "Verified staff", value: "38" },
    ],
    panel: {
      title: "School operations",
      description: "Illustrative operations board.",
      rows: [
        { primary: "Guardian invitations pending", secondary: "24 households", status: "Sending" },
        { primary: "Safeguarding concern #A-118", secondary: "Routed to DSL", status: "In triage" },
        { primary: "Annual licence", secondary: "Renews 1 September", status: "Active" },
      ],
    },
    boundaries: [
      "Administrators see operational records, not children's private drafts.",
      "Every safeguarding action is logged with an accountable owner.",
    ],
  },
  {
    key: "group-admin",
    label: "Education Group Admin",
    audience: "Multi-school trust or group",
    headline: "One policy layer across many schools",
    summary:
      "Group administrators set shared policy, compare participation across schools, and run group-wide challenges.",
    icon: Landmark,
    modules: [
      { title: "Schools", description: "Every school in the group with its own boundary.", icon: Building2 },
      { title: "Group policies", description: "Shared safeguarding, AI and sharing settings.", icon: ScrollText },
      { title: "Cross-school insight", description: "Aggregate participation and achievement patterns.", icon: LineChart },
      { title: "Group challenges & community", description: "Trust-wide briefs and staff community.", icon: Trophy },
    ],
    metrics: [
      { label: "Schools", value: "11" },
      { label: "Policies applied", value: "6" },
      { label: "Group challenges live", value: "2" },
    ],
    panel: {
      title: "Group overview",
      description: "Illustrative aggregate view — no individual child records.",
      rows: [
        { primary: "Northgate Primary", secondary: "Participation steady", status: "Healthy" },
        { primary: "Harbour Academy", secondary: "New staff onboarding", status: "Setup" },
        { primary: "Group AI policy v2", secondary: "Applies to 11 schools", status: "Published" },
      ],
    },
    boundaries: [
      "Group insight is aggregate — no browsing individual children.",
      "Each school keeps its own safeguarding ownership.",
    ],
  },
  {
    key: "organisation-admin",
    label: "Organisation Admin",
    audience: "Verified partner organisation",
    headline: "Contribute without ever touching children",
    summary:
      "Approved organisations publish challenges and opportunities through schools — with no route to individual children.",
    icon: Briefcase,
    modules: [
      { title: "Programmes & opportunities", description: "Briefs, competitions and 16+ opportunities.", icon: Blocks },
      { title: "Approved publishing", description: "Everything is reviewed before it reaches a school.", icon: FileCheck2 },
      { title: "Partner safety", description: "Contractual boundaries and verified staff only.", icon: ShieldCheck },
      { title: "Reporting", description: "Aggregate reach and participation only.", icon: LineChart },
    ],
    metrics: [
      { label: "Live programmes", value: "3" },
      { label: "Schools reached", value: "27" },
      { label: "Items in review", value: "1" },
    ],
    panel: {
      title: "Partner activity",
      description: "Illustrative partner board.",
      rows: [
        { primary: "Marine science challenge", secondary: "Published to 27 schools", status: "Live" },
        { primary: "Engineering work experience (16+)", secondary: "Alumni opportunity", status: "In review" },
        { primary: "Q3 impact summary", secondary: "Aggregate reporting", status: "Ready" },
      ],
    },
    boundaries: [
      "Cannot browse, contact or message children.",
      "Cannot export child or private contact data.",
      "No profiling and no advertising to children.",
    ],
  },
  {
    key: "alumni",
    label: "Alumni 16+",
    audience: "Separate adult environment",
    headline: "Growing up without starting over",
    summary:
      "At 16, members move to a separate environment where their Achievement Passport becomes a portfolio for real opportunity.",
    icon: Award,
    modules: [
      { title: "Portfolio", description: "Selected work presented for adult audiences.", icon: BookOpen },
      { title: "Verified opportunities", description: "Roles and programmes from verified organisations.", icon: Briefcase },
      { title: "Community & mentoring", description: "Adult-to-adult mentoring and interest groups.", icon: UsersRound },
      { title: "Passport continuity", description: "Verified achievements carry across from under-16 years.", icon: BadgeCheck },
    ],
    metrics: [
      { label: "Portfolio pieces", value: "9" },
      { label: "Verified achievements", value: "15" },
      { label: "Opportunities saved", value: "4" },
    ],
    panel: {
      title: "Your adult workspace",
      description: "Illustrative alumni view.",
      rows: [
        { primary: "Documentary short — Coastline", secondary: "Portfolio piece", status: "Published" },
        { primary: "Design apprenticeship", secondary: "Verified organisation", status: "Applied" },
        { primary: "Mentoring: audio production", secondary: "Adult-to-adult", status: "Matched" },
      ],
    },
    boundaries: [
      "Completely separate from the under-16 environment.",
      "Adults never mentor under-16s directly through Aurelia.",
    ],
  },
];
