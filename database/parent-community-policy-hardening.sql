-- Follow-up hardening for the parent-community live extension.
-- Keep membership visibility self-scoped to avoid recursive RLS evaluation.

drop policy if exists adult_memberships_member_select on public.adult_community_memberships;

create policy adult_memberships_self_select
on public.adult_community_memberships for select to authenticated
using (profile_id = public.current_profile_id());

-- A helper for policies on other tables. SECURITY DEFINER avoids recursive RLS
-- on adult_community_memberships while returning only a boolean membership fact.
create or replace function public.is_active_adult_community_member(p_community_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.adult_community_memberships membership
    where membership.community_id = p_community_id
      and membership.profile_id = public.current_profile_id()
      and membership.status = 'active'
  );
$$;

revoke all on function public.is_active_adult_community_member(uuid) from public;
grant execute on function public.is_active_adult_community_member(uuid) to authenticated;

drop policy if exists adult_posts_member_select on public.adult_community_posts;
create policy adult_posts_member_select
on public.adult_community_posts for select to authenticated
using (
  removed_at is null
  and public.is_active_adult_community_member(community_id)
);

drop policy if exists adult_posts_member_insert on public.adult_community_posts;
create policy adult_posts_member_insert
on public.adult_community_posts for insert to authenticated
with check (
  author_profile_id = public.current_profile_id()
  and removed_at is null
  and public.is_active_adult_community_member(community_id)
);
