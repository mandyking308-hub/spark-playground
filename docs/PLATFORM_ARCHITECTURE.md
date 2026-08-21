# Platform architecture

## Product model

The platform is a multi-tenant child-safe creation, learning, achievement and community system designed for education groups, schools, families and approved organisations.

It is intentionally **not** architected as open social media for children.

## Experience layers

### 1. Protected under-16 world

- Child dashboard
- Creator Studio: podcast, writing/books, art, video, projects
- Curated discovery by interest/topic, not a public child directory
- Challenges and competitions
- Clubs and closed cohorts
- Achievement Passport
- Controlled AI assistance
- Moderated publication and reporting

### 2. Adult family community

- Current parent profiles
- Verified parent-to-parent connections
- School communities
- Education-group communities
- Professional and interest groups
- Events, volunteering and fundraising
- Publishing/AI/privacy controls for linked children

Adults in this layer do **not** receive generic access to unrelated children.

### 3. Parent Alumni community

When a child leaves a participating school/group, the parent can opt to remain in the adult community as Parent Alumni.

Parent Alumni supports:

- alumni parent directory
- professional networking
- social/interest groups
- events and reunions
- volunteering
- philanthropy/fundraising
- expert talks and school support

A parent may be `current_and_alumni` where they have multiple children at different lifecycle stages.

### 4. 16+ Alumni environment

The 16+ environment is a separate product/security domain:

- approved portfolio transition
- university and apprenticeship pathways
- careers and internships
- entrepreneurship
- mentoring
- alumni networking
- employers and opportunity partners

Only explicitly approved portfolio items transition from the protected child environment.

### 5. Institutional layer

Hierarchy:

`Education Group -> School -> Cohort/Class -> Child`

Other institutional actors:

- teachers
- school administrators
- education group administrators
- approved organisations
- universities/employers in the adult/alumni environment

## Non-negotiable security boundaries

1. No browsable public directory of minors.
2. No unrestricted adult-to-child direct messaging.
3. Parents can access only verified linked children.
4. Teachers access only authorised school/cohort scopes.
5. School data is tenant-isolated.
6. Group admins see only schools within their group.
7. Approved organisations may publish controlled programmes/challenges but cannot browse or privately contact children.
8. Parent Alumni is adult-only and grants no child access.
9. Alumni is separated from under-16 access.
10. All public child-created content follows a safety/approval lifecycle.
11. AI is a bounded tool, never a child companion.
12. Child data must not be silently used for model training.

## Core domains

- Identity & authentication
- Roles & memberships
- Family/guardian relationships
- Tenant hierarchy
- Creator Studio
- Media and podcasts
- Challenges/submissions
- Clubs/cohorts
- Achievements & Passport
- Adult parent communities
- Parent Alumni
- Alumni 16+
- Organisations & opportunities
- Moderation & safeguarding
- Consent & permissions
- AI gateway & audit
- Notifications
- Billing/licensing
- Analytics
- Audit logs

## Build sequence

1. Identity, roles, lifecycle and tenancy
2. Database schema and RLS
3. Authentication and guardian linkage
4. Role-aware dashboards
5. Parent and Parent Alumni community foundation
6. Creator Studio
7. Achievement Passport
8. Challenges and clubs
9. Moderation/safeguarding workflows
10. Controlled AI gateway
11. Approved organisation layer
12. 16+ Alumni and opportunity layer
13. Billing/licensing
14. Security, accessibility and abuse testing
