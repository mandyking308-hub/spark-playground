export type FamilyPlanKey =
  | "family_monthly"
  | "family_annual"
  | "family_plus_monthly"
  | "family_plus_annual";

export type CommercialPlanKey =
  | FamilyPlanKey
  | "school"
  | "education_group"
  | "organisation"
  | "alumni"
  | "parent_alumni";

export interface FamilyPlan {
  key: FamilyPlanKey;
  name: "Family" | "Family Plus";
  cadence: "monthly" | "annual";
  amountPence: number;
  displayPrice: string;
  displayCadence: string;
  annualSaving?: string;
  summary: string;
  highlights: readonly string[];
}

export const familyPlans: readonly FamilyPlan[] = [
  {
    key: "family_monthly",
    name: "Family",
    cadence: "monthly",
    amountPence: 1299,
    displayPrice: "£12.99",
    displayCadence: "/ month",
    summary: "A protected creative world for one family, with guardian controls and community access.",
    highlights: [
      "Creator Studio and private drafts",
      "Guardian approval and family permissions",
      "Achievement Passport",
      "Challenges, clubs and parent community",
    ],
  },
  {
    key: "family_annual",
    name: "Family",
    cadence: "annual",
    amountPence: 12900,
    displayPrice: "£129",
    displayCadence: "/ year",
    annualSaving: "Save £26.88 vs monthly",
    summary: "The same Family experience, with simple annual billing and the best-value rate.",
    highlights: [
      "Everything in Family monthly",
      "One annual renewal",
      "Two months effectively free",
      "No advertising or behavioural targeting",
    ],
  },
  {
    key: "family_plus_monthly",
    name: "Family Plus",
    cadence: "monthly",
    amountPence: 1999,
    displayPrice: "£19.99",
    displayCadence: "/ month",
    summary: "For larger families who want one calm household subscription across multiple children.",
    highlights: [
      "Multiple child profiles",
      "Full family permission controls",
      "Parent community and events",
      "Expanded household management",
    ],
  },
  {
    key: "family_plus_annual",
    name: "Family Plus",
    cadence: "annual",
    amountPence: 19900,
    displayPrice: "£199",
    displayCadence: "/ year",
    annualSaving: "Save £40.88 vs monthly",
    summary: "Family Plus with annual billing and a lower effective monthly cost.",
    highlights: [
      "Everything in Family Plus monthly",
      "One annual renewal",
      "Best-value household plan",
      "Parent Alumni continuity included",
    ],
  },
] as const;

export const institutionPricing = {
  school: {
    key: "school" as const,
    label: "Schools",
    from: "£2,950",
    cadence: "/ year",
    range: "Larger schools typically £4,950–£7,500/year",
    summary: "Annual school licensing with staff, safeguarding, verification, reporting and family access.",
  },
  educationGroup: {
    key: "education_group" as const,
    label: "Education Groups",
    from: "£12,500",
    cadence: "/ year",
    range: "Multi-school pricing is scoped to network size and rollout.",
    summary: "Cross-school governance, shared standards, analytics, community and central administration.",
  },
  organisation: {
    key: "organisation" as const,
    label: "Organisations",
    from: "£5,000",
    cadence: "/ year",
    range: "Programme and sponsored-access pricing is tailored to scope.",
    summary: "Verified challenges, opportunities and sponsored programmes without opening access to children.",
  },
} as const;

export const includedAccess = {
  alumni: "Free initially for members aged 16+",
  parentAlumni: "Included with the originating family or school relationship",
  schoolFamilyCore: "Core school-linked family access is included in the school licence — families are not charged twice for the same access.",
} as const;

export function familyPlanByKey(key: FamilyPlanKey): FamilyPlan {
  const plan = familyPlans.find((item) => item.key === key);
  if (!plan) throw new Error(`Unknown family plan: ${key}`);
  return plan;
}
