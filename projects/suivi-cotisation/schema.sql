-- Run this once in the Supabase SQL editor for the production project.
-- Every authenticated admin owns an isolated roster and ledger.
begin;

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 100 and name !~ '[[:cntrl:]]'),
  photo_path text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint participants_photo_owned_path check (photo_path like owner_id::text || '/%')
);
create unique index if not exists participants_owner_name_unique
  on public.participants(owner_id, lower(trim(name)));
create index if not exists participants_owner_active_idx
  on public.participants(owner_id, active, created_at);

alter table public.participants enable row level security;
revoke all on public.participants from anon, public, authenticated;
grant select on public.participants to authenticated;
grant insert (owner_id, name, photo_path, active) on public.participants to authenticated;
grant update (active) on public.participants to authenticated;
create policy participants_select_own on public.participants
  for select to authenticated using (owner_id = (select auth.uid()));
create policy participants_insert_own on public.participants
  for insert to authenticated with check (owner_id = (select auth.uid()));
create policy participants_update_own on public.participants
  for update to authenticated using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create table if not exists public.workspace_states (
  owner_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  state jsonb not null default '{"balances":{},"payments":[],"weeklyAllocations":[],"fines":[],"withdrawals":[],"weeklyRules":{}}'::jsonb,
  version bigint not null default 0 check (version >= 0),
  updated_at timestamptz not null default now(),
  constraint workspace_state_is_object check (jsonb_typeof(state) = 'object')
);
alter table public.workspace_states enable row level security;
revoke all on public.workspace_states from anon, public, authenticated;
grant select on public.workspace_states to authenticated;
create policy workspace_state_select_own on public.workspace_states
  for select to authenticated using (owner_id = (select auth.uid()));

create table if not exists public.workspace_state_backups (
  owner_id uuid not null references auth.users(id) on delete cascade,
  version bigint not null,
  state jsonb not null check (jsonb_typeof(state) = 'object'),
  created_at timestamptz not null default now(),
  primary key (owner_id, version)
);
alter table public.workspace_state_backups enable row level security;
revoke all on public.workspace_state_backups from anon, public, authenticated;
grant select on public.workspace_state_backups to authenticated;
create policy workspace_backups_select_own on public.workspace_state_backups
  for select to authenticated using (owner_id = (select auth.uid()));

create or replace function public.save_workspace_state(p_state jsonb, p_expected_version bigint)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner uuid := auth.uid();
  v_current_version bigint;
  v_current_state jsonb;
  v_new_version bigint;
begin
  if v_owner is null then
    raise exception using errcode = '28000', message = 'Authentication required';
  end if;
  if p_expected_version is null or p_expected_version < 0
     or jsonb_typeof(p_state) is distinct from 'object'
     or coalesce(pg_column_size(p_state), 0) > 4194304
     or jsonb_typeof(p_state -> 'payments') is distinct from 'array'
     or jsonb_typeof(p_state -> 'balances') is distinct from 'object' then
    raise exception using errcode = '22023', message = 'Invalid workspace state';
  end if;

  select ws.version, ws.state into v_current_version, v_current_state
  from public.workspace_states as ws
  where ws.owner_id = v_owner
  for update;

  if not found then
    if p_expected_version <> 0 then
      raise exception using errcode = '40001', message = 'Workspace changed; reload before saving';
    end if;
    insert into public.workspace_states(owner_id, state, version, updated_at)
      values (v_owner, p_state, 1, now())
      on conflict (owner_id) do nothing
      returning version into v_new_version;
    if v_new_version is null then
      raise exception using errcode = '40001', message = 'Workspace changed; reload before saving';
    end if;
  else
    if v_current_version <> p_expected_version then
      raise exception using errcode = '40001', message = 'Workspace changed; reload before saving';
    end if;
    insert into public.workspace_state_backups(owner_id, version, state)
      values (v_owner, v_current_version, v_current_state)
      on conflict do nothing;
    v_new_version := v_current_version + 1;
    update public.workspace_states
      set state = p_state, version = v_new_version, updated_at = now()
      where owner_id = v_owner;
  end if;
  return v_new_version;
end;
$$;
revoke all on function public.save_workspace_state(jsonb, bigint) from public, anon;
grant execute on function public.save_workspace_state(jsonb, bigint) to authenticated;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('participant-photos', 'participant-photos', false, 5242880, array['image/jpeg'])
on conflict (id) do update set public = false, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg'];

create policy participant_photos_select_own on storage.objects
  for select to authenticated using (
    bucket_id = 'participant-photos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
create policy participant_photos_insert_own on storage.objects
  for insert to authenticated with check (
    bucket_id = 'participant-photos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
create policy participant_photos_update_own on storage.objects
  for update to authenticated using (
    bucket_id = 'participant-photos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  ) with check (
    bucket_id = 'participant-photos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
create policy participant_photos_delete_own on storage.objects
  for delete to authenticated using (
    bucket_id = 'participant-photos'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

commit;
