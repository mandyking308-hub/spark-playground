-- Remove the final SECURITY DEFINER RPC from the parent community.
-- The addressee can update a pending request directly; RLS is the authority.

create policy adult_connections_addressee_update
on public.adult_connections for update to authenticated
using (
  addressee_profile_id = public.current_profile_id()
  and status = 'pending'
)
with check (
  addressee_profile_id = public.current_profile_id()
  and status in ('accepted', 'declined', 'blocked')
);

drop function if exists public.respond_adult_connection(uuid, text);
