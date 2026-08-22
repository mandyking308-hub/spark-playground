# Global Solutions Management LLC — Aurelia World global legal launch pack

**Date:** 22 August 2026  
**For:** Gary / qualified legal counsel review  
**Operator:** **Global Solutions Management LLC**, Delaware, USA ("GSM")  
**Brand / product:** **Aurelia World**  
**Domain:** **theaureliaworld.com**  
**Status:** Lawyer-ready launch draft. It is not a legal opinion and does not claim that one contract can eliminate all liability in every jurisdiction.

---

## Executive position

Aurelia World should launch commercially as a **GSM-operated product**, not as an unincorporated "Aurelia" undertaking.

The legal architecture should create several independent layers of protection rather than relying on a single disclaimer:

1. the correct contracting entity on every customer-facing document;
2. child-safety/privacy-by-design product controls;
3. clear family and institutional contracts;
4. a school/organisation DPA and jurisdiction schedules;
5. documented privacy and child-risk assessments;
6. payment/cancellation/refund controls that match consumer law;
7. content/IP takedown and moderation procedures;
8. vendor/subprocessor and international-transfer contracts;
9. insurance aligned to the actual risk profile; and
10. evidence that GSM follows its own published policies in practice.

**Core rule:** do not try to "contract out" of direct platform, privacy or child-safety duties. Terms can allocate commercial risk, but regulators will look at the service's actual design, records and operations.

---

# 1. Corporate and brand structure

## 1.1 Contracting entity

Every paid checkout, institutional order, invoice, Terms page, Privacy Policy and significant legal notice should identify:

> **Global Solutions Management LLC, a Delaware limited liability company**

Aurelia World is the product/brand. Avoid wording that suggests Aurelia World itself is a separate company unless/until a separate entity is formed.

## 1.2 Company information still needed from counsel/operations

Before final counsel sign-off, populate the canonical legal notice record with:

- GSM registered/legal notice address;
- Delaware entity/file number if counsel wants it disclosed;
- legal/privacy contact email;
- safeguarding contact route;
- DMCA agent information once registered;
- EU/EEA representative details if required;
- UK representative details if required under the law in force at launch;
- DSA legal representative/contact point if the service falls within the DSA and has no EU establishment;
- tax/VAT/sales-tax identifiers where legally required on invoices or checkout.

Do not invent or publish placeholder individuals as regulatory representatives.

## 1.3 Brand clearance

`theaureliaworld.com` is secured. The bare AURELIA name is crowded in education/software. Counsel should complete trademark clearance of **AURELIA WORLD** and agree the filing strategy before material paid acquisition, licensing expansion or relying on exclusivity.

Likely classes to assess include 9, 41 and 42, with 35 and other classes considered based on final specifications.

---

# 2. Contract stack

## Public / family

- `src/routes/terms-of-use.tsx` — global Terms with GSM as operator.
- `src/routes/privacy-policy.tsx` — global privacy notice and controller/processor role split.
- `src/routes/privacy-for-children.tsx` — child-friendly notice aligned with the actual private-draft model.
- `src/routes/cookie-notice.tsx` — browser storage, translation and payment notice.
- `src/routes/community-standards.tsx` — conduct/content restrictions.
- safeguarding/reporting pages and report route.

## Institutional

- `docs/legal/GSM_AURELIA_WORLD_DPA_TEMPLATE.md` — counsel-review DPA template.
- An institutional Master Services Agreement / order form should be approved before school/group contracts are signed. It should cover commercial terms, licences, implementation, authorised users, procurement, support, service levels if offered, data roles, insurance, IP, security, liability, termination and jurisdiction schedules.

## Sponsored organisations

Organisation/sponsored-programme contracts should additionally cover:

- prohibition on direct adult access to private child data;
- no lead-generation, child profiling or commercial solicitation through child accounts;
- challenge/opportunity approval and moderation rights;
- brand/sponsor use rules;
- safeguarding escalation;
- institution/guardian permissions; and
- cancellation/removal of opportunities where safety or reputation risk arises.

---

# 3. UK launch review

Aurelia World is plainly designed to be accessed by children, so UK child-data and online-safety rules require serious treatment even though GSM is a US company.

## 3.1 UK GDPR / Children's Code

ICO guidance says the Children's Code applies to information-society services likely to be accessed by children, including educational websites, and can apply to non-UK companies processing UK children's data.

Aurelia World's existing design aligns with major Code principles:

- high privacy by default;
- age-banded service design;
- data minimisation;
- no behavioural advertising to children;
- no open child directory;
- no unrestricted adult-child messaging;
- private-by-default drafts;
- guardian permission controls;
- prominent reporting routes;
- limited sharing; and
- safety/moderation gates.

**Counsel/operations evidence required:** retain a written DPIA and best-interests assessment, not just public claims.

## 3.2 UK Online Safety Act

Ofcom states that in-scope user-to-user/search services must complete a children's access assessment and, where likely to be accessed by children, a children's risk assessment and proportionate protections. Aurelia World is intentionally for children, so the legal strategy should not be built around arguing children are unlikely to access it.

**Action:** retain a written assessment tailored to actual features before/at UK launch, review it before significant feature changes, and maintain a senior accountable owner.

**Product position that reduces risk:**

- no open self-registration for children;
- no direct adult-to-child messaging;
- no anonymous public child directory;
- no follower/virality pressure;
- publication is gated;
- media upload is disabled until scanning/quarantine exists.

Gary should confirm whether Aurelia World is an in-scope user-to-user service, what specific Code measures apply, and whether any Ofcom registration/notification/categorisation duties are relevant at current scale.

## 3.3 UK consumer subscriptions

Before UK family subscriptions are broadly marketed:

- checkout must clearly show total recurring price and interval;
- renewal/cancellation mechanics must match the law in force at launch;
- any statutory cooling-off/cancellation rights must be preserved;
- no dark patterns or unreasonable cancellation friction;
- customer-support cancellation must exist even if a self-service portal is not yet available.

**Operational no-go:** do not rely on Terms saying "cancel" unless operations can actually process a cancellation promptly and evidence it.

---

# 4. EU/EEA launch review

## 4.1 EU GDPR

EU GDPR Article 8 rules for consent-based child processing vary by Member State between ages 13 and 16. Do not hard-code a single EU parental-consent age as a legal conclusion. Aurelia World's jurisdiction-policy architecture should support local thresholds.

Where GSM offers services to people in the EEA without an EEA establishment, counsel should assess Article 27 representative obligations and publish the representative where required.

## 4.2 Digital Services Act

If Aurelia World is an "intermediary service"/online platform within the DSA:

- Terms must clearly explain content restrictions and moderation tools;
- platform contact points may be required;
- non-EU providers offering in-scope services in the EU can be required to appoint an EU legal representative;
- Article 28/minor-protection obligations and the Commission's 2025 minors guidelines should be assessed against product design;
- complaint/appeal and moderation records should be retained as required.

The existing Community Standards and human-review appeal route provide a useful foundation, but counsel should decide whether a formal DSA internal complaint system is required at the service's size/status.

## 4.3 International transfers

Before institutional EEA deals, approve:

- actual production Subprocessor list;
- data locations;
- EU SCC modules and transfer impact assessment if required;
- UK IDTA/Addendum for UK transfers if required;
- data-processing schedules showing what is and is not sent to US providers.

Public-page GTranslate is now opt-in and does not load on private/sensitive routes, reducing unnecessary third-party exposure.

---

# 5. United States launch review

## 5.1 COPPA

For children under 13, the FTC COPPA framework requires appropriate notice and verifiable parental consent unless an exception applies. The amended COPPA Rule strengthens data-minimisation/retention and third-party disclosure controls; counsel should verify the exact provisions and compliance dates applicable on launch day.

For school-authorised educational use, current FTC guidance permits schools in defined circumstances to act as the parent's agent for education-only processing, but the operator must not shift COPPA responsibility to the school and cannot use the data for unrelated commercial purposes.

Aurelia World's strongest COPPA positions are:

- no child open signup;
- verified guardian/institution invitation model;
- no child behavioural advertising;
- no sale of child data;
- restricted sharing;
- data-minimisation architecture;
- deletion/data-rights workflows;
- no unrestricted media upload.

**Counsel decision:** approve the exact verifiable-parental-consent methods used for US direct-to-family onboarding and the school-authorisation notice used for US institutional onboarding.

## 5.2 FERPA / US schools

Where a US school discloses FERPA-protected records under the school-official exception, Department of Education guidance expects the contractor to perform an institutional function, be under the school's direct control regarding use/maintenance, limit use to the disclosed purpose and restrict redisclosure.

The DPA template contains this structure. Counsel should adapt it to district procurement language and state student-privacy addenda.

## 5.3 US state privacy / student privacy

Do not assume COPPA + FERPA completes US compliance. State laws may impose additional requirements on children's privacy, student data, biometrics, targeted advertising, data sales, age assurance, automatic renewal and consumer rights.

**Launch method:** maintain a jurisdiction matrix and add state schedules as material markets/school customers are targeted. Do not promise that a generic global Terms page overrides state statutes.

---

# 6. Content, copyright and platform liability

Aurelia World contains user-created work. Before externally published UGC is enabled at scale:

- maintain clear ownership/licence language;
- implement a copyright/IP complaint route;
- adopt a repeat-infringer policy;
- preserve takedown/appeal records;
- assess and register a US DMCA designated agent if GSM intends to rely on the relevant safe-harbour framework;
- never rely on general platform-liability protections as a substitute for child-safety or privacy compliance.

**Current risk reducer:** wider external publication is still technically gated and media upload remains disabled.

---

# 7. AI legal layer

Aurelia World's AI positioning should remain assistance rather than autonomous authority.

Maintain:

- no AI persona presented as a secret friend/romantic companion;
- no diagnosis, medical or legal advice claims;
- no automated child profiling for advertising;
- no solely automated high-impact decisions about a child;
- age-banded prompts/controls;
- authorship/AI-assistance labels where appropriate;
- human review for safety/moderation decisions that affect publication;
- vendor contract controls preventing child data from being reused for unrelated model training unless expressly lawful and approved.

Counsel should assess the EU AI Act and any national/state child-AI laws against each AI feature before expanding beyond bounded creation/learning assistance.

---

# 8. Payment and commercial protection

Dodo integration should identify **Global Solutions Management LLC / Aurelia World** consistently on checkout, receipts and customer support wherever configuration permits.

Before first broad paid launch:

- four product prices match site pricing;
- recurring interval is unambiguous;
- test and real webhook proof completed;
- cancellation path operational;
- refund policy operational;
- chargeback evidence retained;
- tax treatment reviewed by accounting/tax advisers;
- consumer emails/receipts use the correct legal entity;
- no browser redirect can grant entitlement without signed webhook evidence.

The current payment architecture already fails closed until Dodo secrets/product IDs are configured.

---

# 9. Insurance and corporate risk transfer

Gary should coordinate the contract limits with GSM's actual insurance rather than choosing liability numbers in isolation.

Review coverage for:

- technology E&O / professional indemnity;
- cyber/privacy breach;
- media/IP liability;
- child safeguarding/abuse-related exclusions and available cover;
- directors/officers where relevant;
- general/commercial liability; and
- international territorial limits.

The business liability cap in public Terms is a draft and should match negotiated institutional MSAs and available insurance limits.

---

# 10. Operational governance that protects GSM

Legal wording is useful only if the company can prove it follows it. Maintain:

- named senior owner for child safety/privacy;
- incident response record;
- safeguarding escalation procedure;
- regulator/law-enforcement request procedure;
- data-retention schedule;
- Subprocessor register;
- records of processing;
- DPIA/best-interests assessment;
- Online Safety child-risk assessment if applicable;
- consent/guardian-verification evidence;
- moderation and appeal logs;
- employee/contractor confidentiality and access controls;
- vendor security review;
- annual policy review and review before significant product changes.

---

# 11. Documents Gary should read in this order

1. `src/routes/terms-of-use.tsx`
2. `src/routes/privacy-policy.tsx`
3. `src/routes/privacy-for-children.tsx`
4. `src/routes/cookie-notice.tsx`
5. `src/routes/community-standards.tsx`
6. safeguarding/reporting public pages
7. `docs/legal/GSM_AURELIA_WORLD_DPA_TEMPLATE.md`
8. `docs/legal/CHILD_SAFETY_PRIVACY_RISK_ASSESSMENT_2026-08-22.md`
9. `docs/RELEASE_READINESS_2026-08-22.md`
10. this document

---

# 12. Counsel decisions required before broad global paid acquisition

## Corporate / IP
- [ ] Confirm exact GSM legal notice/address details.
- [ ] Clear **AURELIA WORLD** trademark and filing strategy.
- [ ] Confirm brand/IP ownership and any assignment/licence from developers/contractors.

## Privacy / children
- [ ] Approve controller/processor split.
- [ ] Approve retention schedule and ROPA/DPIA.
- [ ] Confirm UK representative position under law in force.
- [ ] Confirm EEA Article 27 representative if required.
- [ ] Confirm DSA legal representative/contact obligations if DSA applies.
- [ ] Approve US COPPA VPC methods and school notice.
- [ ] Approve FERPA/state student-privacy schedules.

## Online safety
- [ ] Confirm UK Online Safety Act scope and required assessment/codes.
- [ ] Confirm DSA online-platform/minor protection scope.
- [ ] Confirm escalation/appeals/reporting wording.

## Consumer / payments
- [ ] Approve family subscription cancellation/refund/cooling-off language by initial launch territories.
- [ ] Confirm auto-renewal notices/reminders required by target jurisdictions.
- [ ] Confirm Dodo merchant-of-record/payment-provider legal allocation if applicable.

## IP / UGC
- [ ] Register/designate DMCA agent before relying on US copyright safe harbour for public UGC.
- [ ] Approve copyright complaint/repeat-infringer process.

## Contracts / insurance
- [ ] Approve institutional MSA and DPA.
- [ ] Align liability caps and indemnities with insurance.
- [ ] Confirm tax/VAT/sales-tax invoice disclosures.

---

# 13. Recommended launch posture

**Tomorrow may proceed with:** final hardening, Dodo test configuration, payment proof, private/invitation-only customer testing and Liftor integration.

**Before broad global paid acquisition or large school procurement:** counsel should clear the representative/territorial issues, consumer subscription mechanics, trademark, institutional DPA/MSA and regulatory scope items above.

This is more protective than publishing a long disclaimer and hoping it works: it ties GSM's legal position to the actual architecture, safety controls, records and contracts.

---

## Primary official sources used for the review checklist

- UK ICO Children's Code / Age Appropriate Design Code: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/
- Ofcom protection of children duties: https://www.ofcom.org.uk/online-safety/protecting-children/protection-of-children-duties-under-the-online-safety-act
- FTC COPPA guidance: https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- US Department of Education student privacy / FERPA: https://studentprivacy.ed.gov/
- EU GDPR child safeguards: https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data/are-there-any-specific-safeguards-data-about-children_en
- EU Digital Services Act: https://eur-lex.europa.eu/eli/reg/2022/2065/oj
- European Commission DSA minors guidelines: https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-protection-minors
