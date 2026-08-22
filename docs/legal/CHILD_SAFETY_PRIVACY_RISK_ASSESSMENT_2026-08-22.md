# Aurelia World — Child Safety, Privacy and Online-Service Risk Assessment

**Operator:** Global Solutions Management LLC (GSM)  
**Product:** Aurelia World  
**Date:** 22 August 2026  
**Status:** Internal operational/counsel-review record. Update before significant feature changes and at least annually once live.

This document combines the product facts needed for a UK Children's Code/DPIA review and an initial online-safety risk record. It is not a substitute for any statutory form or regulator-specific assessment that counsel determines is required.

---

## 1. Service description

Aurelia World is an invitation-only creative, learning, achievement and supervised community platform designed for under-16 users, with a separate 16+ alumni environment.

Core user roles include:

- child;
- parent/guardian;
- parent alumni;
- teacher;
- school administrator;
- education-group administrator;
- approved organisation administrator;
- 16+ alumni; and
- internal platform administrator.

The platform intentionally serves children. The risk posture therefore assumes child-protection requirements apply rather than trying to classify the service as unlikely to be accessed by children.

---

## 2. Current safety architecture

### Identity and access

- no open child self-registration;
- under-16 accounts require a verified sponsored invitation;
- role-separated access;
- adult and child identities are separate;
- database row-level security and server-side privileged operations;
- no browser/service-role credential exposure.

### Child privacy

- child projects start private;
- parent/school sponsorship does not create unrestricted access to private drafts;
- guardian sees permission requests required for approval, not a general draft browser;
- no public child directory;
- no open adult-to-child direct messaging;
- no follower counts or virality mechanics for children;
- no child behavioural advertising.

### Sharing/publication

Current protected state model:

`draft → scan_pending → approval_pending → moderation_pending → published`

A child request does not itself publish. Guardian approval alone does not publish. Safety/moderation remains a required gate.

### Media

Private media upload is intentionally disabled until a genuine quarantine/scanning/storage pipeline is available.

### AI

- bounded creation/learning assistance;
- no secret-friend/romantic-companion positioning;
- no diagnosis or emergency-service positioning;
- AI assistance/authorship can be labelled;
- no child ad profiling;
- safety signals are not intended to be the sole basis for high-impact decisions.

### Reporting

- public safeguarding/reporting information;
- dedicated report-concern route;
- incident-response architecture;
- human review/appeal concept in Community Standards.

---

## 3. Data-processing map — children

### Data required for account/safety

- name/display name;
- age band;
- country/jurisdiction;
- verified guardian/school/organisation relationship;
- account/auth identifiers;
- permissions/consent decisions;
- security logs.

### Child-created data

- project metadata;
- child-entered text/descriptions;
- project state;
- submissions/feedback where feature-enabled;
- media only after the protected media pipeline is enabled.

### Safety data

- report details;
- moderation decisions;
- incident evidence;
- audit trail.

### Intentionally excluded/minimised

- no need for precise geolocation as a standard child feature;
- no child advertising profile;
- no open social graph/follower metric;
- no unrestricted contact information exposure;
- no biometric identity feature in current core design;
- no routine health-record collection.

---

# 4. Risk register

Risk ratings below are qualitative and should be revisited using the regulator/counsel-approved methodology.

## R1 — Adult grooming or unauthorised contact

**Inherent risk:** Critical  
**Controls:** no open adult-child messaging; role verification; no public child directory; age separation; approved pathways only; report tools; account suspension; audit logs.  
**Residual risk:** Low/Medium while these controls remain.  
**Change trigger:** any new messaging, mentoring, live events, comments or contact-sharing feature requires a new assessment before release.

## R2 — Child sexual exploitation / sexual content

**Inherent risk:** Critical  
**Controls:** prohibited by Community Standards; publication gating; moderation; media upload disabled; report/escalation pathway.  
**Residual risk:** Low while media/social sharing remains constrained.  
**Required before media:** malware/content scanning, quarantine, CSAM escalation policy, trained review path, evidence-preservation rules, provider escalation and jurisdiction-specific reporting obligations.

## R3 — Bullying, harassment, hate or humiliation

**Inherent risk:** High  
**Controls:** no open comments/follower pressure; small supervised community design; Community Standards; moderation/reporting; role controls.  
**Residual risk:** Low/Medium.  
**Change trigger:** public comments, peer messaging, leaderboards or popularity metrics.

## R4 — Self-harm, suicide, eating-disorder or other harmful content

**Inherent risk:** High for any child UGC service.  
**Controls:** moderation pathway; no recommender feed optimised for engagement; no unrestricted public posting; report route.  
**Residual risk:** Medium until formal content-classification/escalation procedure is approved.  
**Action:** counsel/safeguarding owner to approve harm taxonomy, urgent escalation and law-enforcement/emergency referral procedure before broad UGC publication.

## R5 — Inappropriate public disclosure of child identity/location

**Inherent risk:** Critical  
**Controls:** private by default; no public child directory; no unrestricted share links; guardian + safety/moderation gates; no standard precise geolocation feature; avoid contact details in public projections.  
**Residual risk:** Low while no public projection is enabled.  
**Action before public showcase:** publish only a reviewed projection/snapshot, not raw child `projects` rows; prohibit addresses, contact details, school location and precise location; use age-appropriate display identity.

## R6 — Parent/school over-surveillance of private child drafts

**Inherent risk:** Medium/High.  
**Controls:** child-owned project RLS; parent/school not granted generic draft access; guardian approvals use permission records rather than draft browsing.  
**Residual risk:** Low.  
**Product rule:** do not weaken this privacy boundary for convenience.

## R7 — Excessive data collection / indefinite retention

**Inherent risk:** High because children are involved.  
**Controls:** data-minimisation architecture; role-specific tables; deletion/data-rights functions; no advertising profile.  
**Residual risk:** Medium until a board/counsel-approved retention schedule is final.  
**Action:** finalise retention periods by data category and automate deletion where appropriate.

## R8 — Third-party processing / cross-border disclosure

**Inherent risk:** High.  
**Controls:** server-side secrets; EU-region Supabase production project; public translator excluded from private routes; translator now opt-in; payment provider should receive payer/billing data rather than child creative data.  
**Residual risk:** Medium until production Subprocessor register, contracts and transfer mechanisms are approved.  
**Action:** approve Subprocessor register + SCC/IDTA/other transfer mechanism as applicable.

## R9 — AI harmful or manipulative interaction

**Inherent risk:** High.  
**Controls:** bounded assistance; no companion positioning; no medical/diagnostic role; no behavioural advertising; authorship labels; age bands.  
**Residual risk:** Medium.  
**Action before wider AI:** red-team age-banded prompts, self-harm/sexual/grooming/manipulation scenarios, data-leakage prompts and attempts to bypass safety.

## R10 — Automated unfair decision about a child

**Inherent risk:** High if automation controls access/publication without review.  
**Controls:** guardian and human moderation steps; AI/safety scan not treated as final publication authority.  
**Residual risk:** Low/Medium.  
**Rule:** no solely automated legal/similarly significant decision about a child without counsel-approved basis and safeguards.

## R11 — Account takeover / child impersonation

**Inherent risk:** High.  
**Controls:** invitation-only onboarding; separate auth identities; server-side auth; password protection hardening planned; verified roles; audit.  
**Residual risk:** Medium until leaked-password protection and production email/auth reliability are hardened.  
**Tomorrow action:** enable Supabase leaked-password protection and review production auth recovery/notification flows.

## R12 — School/organisation receives more data than required

**Inherent risk:** High.  
**Controls:** least-privilege role navigation; no generic institution access to private child drafts; education-group data can be aggregate.  
**Residual risk:** Low/Medium.  
**Action:** institutional access tests must remain in release regression suite.

## R13 — Sponsor uses platform to market to or solicit children

**Inherent risk:** Critical.  
**Controls:** organisation role is separate; no child browsing/direct messaging; opportunities/challenges should be curated; Terms prohibit child commercial profiling/solicitation.  
**Residual risk:** Low while architecture stays constrained.  
**Action:** sponsored-programme MSA must prohibit off-platform solicitation and require approval of content/opportunities.

## R14 — Payment fraud / child enters payment relationship

**Inherent risk:** Medium/High.  
**Controls:** family billing belongs to verified adult; signed webhook is source of entitlement truth; browser return cannot activate account; no service-role key client-side.  
**Residual risk:** Low after Dodo proof.  
**Tomorrow action:** test signed payment, duplicate webhook, cancellation and failed/on-hold states.

## R15 — Legal/policy promises exceed actual product

**Inherent risk:** High.  
**Controls:** legal release audit; product claims tied to verified code; public demos labelled synthetic.  
**Residual risk:** Medium.  
**Rule:** never claim automated scanning/moderation/publication is live before it is genuinely operational.

---

# 5. Children's Code / best-interests mapping

## Best interests

Primary design principle: child creative autonomy and opportunity must not require surrendering unnecessary privacy or exposure to adult contact.

## DPIA

This document is a foundation, but counsel/privacy lead should approve a formal DPIA containing data flows, necessity/proportionality, risk scores, mitigations, owners and review dates.

## Age appropriate application

Current product uses age bands and separate under-16 vs 16+ environments. Confirm country-specific consent thresholds separately from product age bands.

## Transparency

Maintain child-friendly notice and in-context explanations at permission/sharing points.

## Detrimental use / profiling

No behavioural ads to children. Do not add engagement optimisation that encourages compulsive use or weakens privacy.

## Policies/community standards

Terms, Privacy, Child Privacy and Community Standards must match actual controls and be operationally enforced.

## Default settings

Private by default; publication requires active protected flow.

## Data minimisation

Collect only information required for the selected features and safety/account purposes.

## Data sharing

Institution/guardian relationship is not blanket disclosure authority.

## Geolocation

No standard child precise-location feature. Any future location feature must default off and receive separate review.

## Parental controls

Permission controls should be visible/understandable to the child and should not covertly turn into total private-draft surveillance.

## Nudge techniques

Do not pressure children to publish, disclose more information, weaken privacy or spend money.

## Online tools

Maintain prominent help/reporting tools and age-appropriate language.

---

# 6. Online Safety Act assessment foundation

Because the service is intentionally available to children, assume the child-access conclusion is **YES** for UK purposes if the service falls within an in-scope Part 3 service category.

Features counsel should classify:

- child UGC project creation;
- controlled sharing/publication;
- clubs/challenges;
- feedback;
- parent community (adult-only);
- 16+ alumni community;
- any future messaging/comments;
- search/discovery if introduced.

**Critical legal question:** whether and which Aurelia World surfaces are a regulated user-to-user service under the Online Safety Act, and which safety duties/codes apply at launch scale.

Maintain a written record of the legal conclusion and revisit before significant changes.

---

# 7. Incident-response priorities

## Priority 0 — imminent danger / suspected child sexual exploitation

- restrict access/preserve evidence;
- escalate immediately to trained safeguarding lead;
- do not conduct amateur investigation beyond necessary platform facts;
- follow legally required reporting/escalation for the relevant jurisdiction;
- prevent further contact/exposure;
- record decision and authority contacted.

## Priority 1 — grooming/contact attempt, serious threats, doxxing/location disclosure

- freeze relevant interaction;
- preserve logs;
- human review;
- guardian/institution notification where safe/lawful;
- determine regulator/law-enforcement/safeguarding referral.

## Priority 2 — bullying, policy violation, lower-severity inappropriate content

- review/remove/restrict as appropriate;
- explain to responsible adult where appropriate;
- allow human appeal where safe;
- identify repeated patterns.

---

# 8. Mandatory pre-feature-change review triggers

A new assessment is required before adding any of the following:

- child/adult direct messaging;
- public comments;
- follower counts, rankings or popularity metrics;
- live streaming;
- public profile search;
- unrestricted share links;
- location sharing;
- media upload;
- mentor-child contact;
- behavioural recommendation feeds;
- advertising/sponsorship targeted using child data;
- biometric age/identity features;
- generative AI companion/persona features;
- automated disciplinary/eligibility decisions;
- school access to private drafts.

---

# 9. Owners and review record

**Corporate owner:** Global Solutions Management LLC  
**Senior accountable child-safety/privacy owner:** TO BE FORMALLY NAMED BY GSM  
**Legal reviewer:** Gary / qualified counsel — confirm full name/firm internally  
**Next review:** before broad paid acquisition and before any significant child-social/media feature is enabled.

---

# 10. Outstanding controls for tomorrow/follow-up

- [ ] Supabase leaked-password protection enabled.
- [ ] Production auth email/recovery route hardened.
- [ ] Dodo test + one controlled live payment proof.
- [ ] Real cancellation path verified before broad recurring billing.
- [ ] Production Subprocessor list approved.
- [ ] Formal data-retention schedule approved.
- [ ] UK/EEA representative/legal-representative analysis completed.
- [ ] UK Online Safety Act scope memo approved.
- [ ] COPPA VPC/school authorisation method approved.
- [ ] Institutional DPA/MSA approved.
- [ ] Trademark clearance completed before material paid acquisition.
- [ ] DMCA agent/takedown process completed before externally published UGC is opened at scale.

---

## Official guidance used as review anchors

- ICO Children's Code standards: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/code-standards/
- Ofcom protection of children duties: https://www.ofcom.org.uk/online-safety/protecting-children/protection-of-children-duties-under-the-online-safety-act
- FTC COPPA FAQs: https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- US Department of Education FERPA vendor resources: https://studentprivacy.ed.gov/audience/education-technology-vendors
- EU DSA minors guidelines: https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-protection-minors
