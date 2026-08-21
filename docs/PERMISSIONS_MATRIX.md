# Permissions matrix

This is the product-level access model. Database RLS must enforce the same rules independently of the UI.

| Actor | Own profile | Own portfolio | Linked child | Unrelated child | Adult community | Child programmes | Safeguarding | Tenant admin |
|---|---|---|---|---|---|---|---|---|
| Child | Yes | Yes | N/A | Known peers only in controlled contexts | No | Yes | Report only | No |
| Parent | Yes | No | Own verified child only | No | Yes | Via own child / approved events | Report / linked-child visibility | No |
| Parent Alumni | Yes | No | No by alumni status alone | No | Yes | Adult volunteering route only | Report | No |
| Teacher | Yes | No | Authorised cohort only | No | Staff community only | Manage authorised classes/programmes | Scoped | No |
| School Admin | Yes | No | Authorised school scope | No | Staff/admin | Manage school programmes | School scope | School |
| Group Admin | Yes | No | Aggregate/authorised scope only | No | Group admin | Group programmes | Group scope | Education group |
| Approved Organisation | Yes | No | No direct child browsing | No | Partner/admin | Publish approved challenges/opportunities | No direct case access | Organisation |
| Alumni 16+ | Yes | Yes | No | No | Alumni community | No child DM; controlled volunteering only | Report | No |
| Mentor | Yes | No | No direct child access | No | Alumni/mentor community | Moderated programme workflow only | Report | No |
| Platform Admin | Yes | As required for support | Exceptional audited access | Exceptional audited access | Admin | Admin | Full audited safeguarding role | Platform |

## Hard-denied product capabilities

These capabilities do not exist as ordinary permissions:

- Public/browsable child directory
- Adult -> unrelated child DM
- Parent Alumni -> child profile access
- Alumni -> under-16 private area access
- Organisation -> child contact details
- Public child follower counts
- Unmoderated child livestreaming
- Anonymous chat targeting children

## Parent community rules

Current parents may:

- connect with verified adults in authorised school/group communities
- join interest and professional groups
- message other verified adults
- attend/create approved adult events where permissions allow
- volunteer through controlled school workflows

Parent Alumni may retain these adult-community relationships after their child leaves, subject to opt-in and community policy.

Parent community membership never expands child-data permissions.

## Child publication rule

Public or cross-community child-created content follows:

`Draft -> safety scan -> age/consent check -> parent approval where required -> moderation where required -> publish`

Removal, reporting and appeal actions must be auditable.

## AI rule

AI permissions are capability-based and age-banded. There is no general open-ended "AI chat" entitlement for children. Prohibited uses include AI companions, romantic/sexual roleplay, diagnosis, vulnerability exploitation and secret/dependency-forming interaction.
