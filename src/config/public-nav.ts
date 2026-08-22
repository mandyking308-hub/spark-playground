export interface PublicLink {
  label: string;
  to: string;
  description?: string;
}

export const productLinks: PublicLink[] = [
  { label: "See the dashboards", to: "/dashboard-demos", description: "Demo workspaces for every role, from child to education group." },
  { label: "Ideas & Resources", to: "/ideas-and-resources", description: "Project starters, family guides and educator brief templates." },
  { label: "Creator Studio", to: "/creator-studio", description: "Podcasts, shows, stories, art, film, games and inventions." },
  { label: "Challenges & Clubs", to: "/challenges-and-clubs", description: "Purposeful challenges and small, supervised clubs." },
  { label: "Achievement Passport", to: "/achievement-passport", description: "Verified evidence of skills, leadership and contribution." },
  { label: "AI & Children", to: "/ai-and-children", description: "Bounded, age-banded assistance with authorship labels." },
];

export const audienceLinks: PublicLink[] = [
  { label: "For Families", to: "/for-families", description: "Child creators, guardian approval and the parent layer." },
  { label: "For Schools", to: "/for-schools", description: "Briefs, review, verification and safeguarding workflows." },
  { label: "For Education Groups", to: "/for-education-groups", description: "A multi-school operating and governance layer." },
  { label: "For Organisations", to: "/for-organisations", description: "Challenges and opportunities through verified access." },
  { label: "Parent Community", to: "/parent-community", description: "Verified adult community and Parent Alumni continuity." },
  { label: "16+ Alumni", to: "/alumni-world", description: "A separate adult world for portfolio, work and mentoring." },
];

export const trustLinks: PublicLink[] = [
  { label: "Safety & Trust", to: "/safety-and-trust", description: "How protection is designed into the architecture." },
  { label: "Safeguarding & Reporting", to: "/safeguarding-and-reporting", description: "How to raise a concern and what happens next." },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Child-friendly Privacy Notice", to: "/privacy-for-children" },
  { label: "Data Protection for Schools", to: "/data-protection-for-schools" },
  { label: "Cookie & Storage Notice", to: "/cookie-notice" },
  { label: "Terms of Use", to: "/terms-of-use" },
  { label: "Community Standards", to: "/community-standards" },
];

export const companyLinks: PublicLink[] = [
  { label: "Pricing", to: "/pricing", description: "Family subscriptions and annual institutional licensing." },
  { label: "About Aurelia World", to: "/about", description: "Why this platform exists." },
  { label: "Contact & enquiries", to: "/contact", description: "Schools, groups, organisations and general questions." },
];

export const primaryNav = [
  { label: "Explore", links: productLinks },
  { label: "Audiences", links: audienceLinks },
  { label: "Trust", links: trustLinks },
  { label: "Company", links: companyLinks },
];
