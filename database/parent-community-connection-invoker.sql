-- Keep the application RPC shape while making RLS, not elevated privileges, authoritative.

create or replace function public.respond_adult_connection(
  p_connection_id uuid,
  p_response text
) returns public.adult_connections
language plpgsql
security invoker
set search_path = public
as $$
declare
  updated public.adult_connections;
begin
  if p_response not in ('accepted', 'declined', 'blocked') then
    raise exception 'Invalid connection response';
  end if;

  update public.adult_connections
  set status = p_response,
      responded_at = now()
  where id = p_connection_id
    and status = 'pending'
  returning * into updated;

  if updated.id is null then
    raise exception 'Connection request not available';
  end if;

  return updated;
end;
$$;

revoke execute on function public.respond_adult_connection(uuid, text) from public;
revoke execute on function public.respond_adult_connection(uuid, text) from anon;
grant execute on function public.respond_adult_connection(uuid, text) to authenticated;
