-- Security hardening after Supabase advisor review.
-- The membership helper is unnecessary once membership SELECT is self-scoped,
-- so remove the SECURITY DEFINER RPC from the exposed public API surface.

drop policy if exists adult_posts_member_select on public.adult_community_posts;
drop policy if exists adult_posts_member_insert on public.adult_community_posts;

drop function if exists public.is_active_adult_community_member(uuid);

create policy adult_posts_member_select
on public.adult_community_posts for select to authenticated
using (
  removed_at is null
  and exists (
    select 1
    from public.adult_community_memberships mine
    where mine.community_id = adult_community_posts.community_id
      and mine.profile_id = public.current_profile_id()
      and mine.status = 'active'
  )
);

create policy adult_posts_member_insert
on public.adult_community_posts for insert to authenticated
with check (
  author_profile_id = public.current_profile_id()
  and removed_at is null
  and exists (
    select 1
    from public.adult_community_memberships mine
    where mine.community_id = adult_community_posts.community_id
      and mine.profile_id = public.current_profile_id()
      and mine.status = 'active'
  )
);

revoke execute on function public.respond_adult_connection(uuid, text) from public;
revoke execute on function public.respond_adult_connection(uuid, text) from anon;
grant execute on function public.respond_adult_connection(uuid, text) to authenticated;
