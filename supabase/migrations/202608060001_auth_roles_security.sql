-- FurU authorization hardening: capability roles, verified welfare orgs, and
-- ownership-safe policies. Apply after 202608050001_furu_core.sql.

do $$ begin
  create type public.account_role as enum ('guardian', 'adopter', 'welfare_org');
exception
  when duplicate_object then null;
end $$;

alter table public.profiles
  add column if not exists roles public.account_role[],
  add column if not exists welfare_org_verified boolean not null default false,
  add column if not exists organization_name text;

update public.profiles
set roles = case purpose
  when 'Rehome a pet' then array['guardian']::public.account_role[]
  when 'Adopt a pet' then array['adopter']::public.account_role[]
  else array['guardian','adopter']::public.account_role[]
end
where roles is null or cardinality(roles) = 0;

alter table public.profiles
  alter column roles set default array['adopter']::public.account_role[],
  alter column roles set not null;

alter table public.profiles drop constraint if exists profiles_roles_valid;
alter table public.profiles add constraint profiles_roles_valid check (
  cardinality(roles) between 1 and 2
  and roles <@ array['guardian','adopter','welfare_org']::public.account_role[]
  and not ('welfare_org' = any(roles) and cardinality(roles) > 1)
);

create or replace function public.has_role(required_role public.account_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and required_role = any(p.roles)
      and (required_role <> 'welfare_org' or p.welfare_org_verified)
  );
$$;
revoke all on function public.has_role(public.account_role) from public, anon;
grant execute on function public.has_role(public.account_role) to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data->>'account_role', 'adopter');
  assigned_roles public.account_role[];
begin
  assigned_roles := case requested_role
    when 'guardian' then array['guardian']::public.account_role[]
    when 'guardian_adopter' then array['guardian','adopter']::public.account_role[]
    when 'welfare_org' then array['welfare_org']::public.account_role[]
    else array['adopter']::public.account_role[]
  end;

  insert into public.profiles(
    id, username, phone, location, purpose, roles, organization_name
  ) values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data->>'username'), ''), 'FurU user'),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'location', ''),
    coalesce(new.raw_user_meta_data->>'purpose', 'Adopt a pet'),
    assigned_roles,
    nullif(trim(new.raw_user_meta_data->>'organization_name'), '')
  );
  return new;
end;
$$;

-- Role and verification fields are administrative. A browser may update only
-- the profile fields explicitly listed here; RLS still restricts rows to self.
revoke update on public.profiles from authenticated;
grant update (username, phone, location, purpose, bio, avatar_url, updated_at)
  on public.profiles to authenticated;

drop policy if exists "Owners create listings" on public.pet_listings;
create policy "Authorized guardians create listings"
on public.pet_listings for insert to authenticated
with check (
  owner_id = (select auth.uid())
  and (
    public.has_role('guardian')
    or public.has_role('welfare_org')
  )
);

drop policy if exists "Applicants create applications" on public.adoption_applications;
create policy "Adopters create valid applications"
on public.adoption_applications for insert to authenticated
with check (
  applicant_id = (select auth.uid())
  and public.has_role('adopter')
  and status = 'Under review'
  and listing_id is not null
  and pet_key = listing_id::text
  and exists (
    select 1 from public.pet_listings listing
    where listing.id = listing_id
      and listing.status = 'Published'
      and listing.owner_id <> (select auth.uid())
  )
);

drop policy if exists "Participants update applications" on public.adoption_applications;
create policy "Applicants update own answers"
on public.adoption_applications for update to authenticated
using (applicant_id = (select auth.uid()) and public.has_role('adopter'))
with check (applicant_id = (select auth.uid()) and public.has_role('adopter'));

-- Direct clients cannot alter application ownership, target, or status.
revoke update on public.adoption_applications from authenticated;
grant update (answers, updated_at) on public.adoption_applications to authenticated;

create or replace function public.set_application_status(
  target_application uuid,
  next_status text
)
returns public.adoption_applications
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.adoption_applications;
begin
  if next_status not in ('Under review','Monitoring','Completed','Declined') then
    raise exception 'Invalid application status';
  end if;

  select application.* into current_row
  from public.adoption_applications application
  join public.pet_listings listing on listing.id = application.listing_id
  where application.id = target_application
    and listing.owner_id = (select auth.uid())
    and (public.has_role('guardian') or public.has_role('welfare_org'));

  if not found then
    raise exception 'Application not found';
  end if;

  update public.adoption_applications
  set status = next_status, updated_at = now()
  where id = target_application
  returning * into current_row;
  return current_row;
end;
$$;
revoke all on function public.set_application_status(uuid, text) from public, anon;
grant execute on function public.set_application_status(uuid, text) to authenticated;

drop policy if exists "Participants create conversations" on public.conversations;
create policy "Adopters start listing conversations"
on public.conversations for insert to authenticated
with check (
  adopter_id = (select auth.uid())
  and public.has_role('adopter')
  and guardian_id <> adopter_id
  and exists (
    select 1 from public.pet_listings listing
    where listing.id = listing_id
      and listing.owner_id = guardian_id
      and listing.status = 'Published'
  )
);

-- Stop applicants from forging the identity attached to monitoring records.
drop policy if exists "Participants create checkins" on public.monitoring_checkins;
create policy "Participants create own checkins"
on public.monitoring_checkins for insert to authenticated
with check (
  submitted_by = (select auth.uid())
  and exists (
    select 1
    from public.adoption_applications application
    join public.pet_listings listing on listing.id = application.listing_id
    where application.id = application_id
      and (select auth.uid()) in (application.applicant_id, listing.owner_id)
      and application.status = 'Monitoring'
  )
);
