-- One scope-aware SELECT policy avoids evaluating three permissive policies per row.

drop policy if exists billing_accounts_family_self_select on public.billing_accounts;
drop policy if exists billing_accounts_school_admin_select on public.billing_accounts;
drop policy if exists billing_accounts_group_admin_select on public.billing_accounts;

create policy billing_accounts_scoped_select
on public.billing_accounts for select to authenticated
using (
  (account_type = 'family' and payer_profile_id = public.current_profile_id())
  or (
    account_type = 'school'
    and exists (
      select 1 from public.school_memberships sm
      where sm.school_id = billing_accounts.school_id
        and sm.profile_id = public.current_profile_id()
        and sm.role = 'school_admin'
        and sm.status = 'active'
    )
  )
  or (
    account_type = 'education_group'
    and exists (
      select 1 from public.group_memberships gm
      where gm.education_group_id = billing_accounts.education_group_id
        and gm.profile_id = public.current_profile_id()
        and gm.role in ('group_admin', 'platform_admin')
        and gm.status = 'active'
    )
  )
);
