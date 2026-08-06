-- FurU Priority 1 marketplace flows. Apply after the core and auth migrations.

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('pet-photos','pet-photos',true,8388608,array['image/jpeg','image/png','image/webp','image/gif','image/avif'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists "Pet photos are public" on storage.objects;
create policy "Pet photos are public" on storage.objects for select to anon,authenticated using (bucket_id='pet-photos');
drop policy if exists "Guardians upload own pet photos" on storage.objects;
create policy "Guardians upload own pet photos" on storage.objects for insert to authenticated
with check (bucket_id='pet-photos' and (storage.foldername(name))[1]=(select auth.uid())::text and (public.has_role('guardian') or public.has_role('welfare_org')));
drop policy if exists "Guardians update own pet photos" on storage.objects;
create policy "Guardians update own pet photos" on storage.objects for update to authenticated
using (bucket_id='pet-photos' and owner_id=(select auth.uid()::text)) with check (bucket_id='pet-photos' and owner_id=(select auth.uid()::text));
drop policy if exists "Guardians delete own pet photos" on storage.objects;
create policy "Guardians delete own pet photos" on storage.objects for delete to authenticated
using (bucket_id='pet-photos' and owner_id=(select auth.uid()::text));

alter table public.conversations
  add column if not exists guardian_contact_consent boolean not null default false,
  add column if not exists adopter_contact_consent boolean not null default false;

alter table public.monitoring_checkins
  add column if not exists photo_url text;

alter table public.reviews
  add column if not exists application_id uuid references public.adoption_applications(id) on delete set null,
  add column if not exists moderation_status text not null default 'Pending'
    check (moderation_status in ('Pending','Approved','Hidden')),
  add column if not exists moderation_note text;

create unique index if not exists one_review_per_application_reviewer
  on public.reviews(application_id, reviewer_id) where application_id is not null;

create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  criteria jsonb not null default '{}'::jsonb,
  alerts_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meet_and_greets (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  proposed_by uuid not null references public.profiles(id) on delete cascade,
  starts_at timestamptz not null,
  venue_name text not null,
  venue_address text not null,
  notes text not null default '',
  status text not null default 'Proposed' check (status in ('Proposed','Confirmed','Declined','Cancelled','Completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.monitoring_escalations (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.adoption_applications(id) on delete cascade,
  checkin_id uuid references public.monitoring_checkins(id) on delete set null,
  reported_by uuid not null references public.profiles(id) on delete cascade,
  severity text not null check (severity in ('Support','Urgent')),
  status text not null default 'Open' check (status in ('Open','Reviewing','Resolved')),
  assigned_to uuid references public.profiles(id) on delete set null,
  resolution_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Delivery workers consume these jobs with a service-role key. Browser clients
-- never receive provider credentials or direct access to the queue.
create table if not exists public.notification_jobs (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.adoption_applications(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  channel text not null check (channel in ('in_app','email','sms')),
  template_key text not null,
  scheduled_for timestamptz not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'Queued' check (status in ('Queued','Sent','Failed','Cancelled')),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.saved_searches enable row level security;
alter table public.meet_and_greets enable row level security;
alter table public.monitoring_escalations enable row level security;
alter table public.notification_jobs enable row level security;

drop policy if exists "Recipients view in app reminders" on public.notification_jobs;
create policy "Recipients view in app reminders" on public.notification_jobs for select to authenticated
using (recipient_id=(select auth.uid()) and channel='in_app');

drop policy if exists "Users manage own saved searches" on public.saved_searches;
create policy "Users manage own saved searches" on public.saved_searches for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "Participants view meet and greets" on public.meet_and_greets;
create policy "Participants view meet and greets" on public.meet_and_greets for select to authenticated
  using (exists(select 1 from public.conversations c where c.id=conversation_id and (select auth.uid()) in (c.guardian_id,c.adopter_id)));
drop policy if exists "Participants create meet and greets" on public.meet_and_greets;
create policy "Participants create meet and greets" on public.meet_and_greets for insert to authenticated
  with check (proposed_by=(select auth.uid()) and exists(select 1 from public.conversations c where c.id=conversation_id and (select auth.uid()) in (c.guardian_id,c.adopter_id)));
drop policy if exists "Participants update meet and greets" on public.meet_and_greets;
create policy "Participants update meet and greets" on public.meet_and_greets for update to authenticated
  using (exists(select 1 from public.conversations c where c.id=conversation_id and (select auth.uid()) in (c.guardian_id,c.adopter_id)))
  with check (exists(select 1 from public.conversations c where c.id=conversation_id and (select auth.uid()) in (c.guardian_id,c.adopter_id)));
revoke update on public.meet_and_greets from authenticated;
grant update(status,updated_at) on public.meet_and_greets to authenticated;
drop policy if exists "Participants view own escalations" on public.monitoring_escalations;
create policy "Participants view own escalations" on public.monitoring_escalations for select to authenticated
  using (exists(select 1 from public.adoption_applications a join public.pet_listings l on l.id=a.listing_id where a.id=application_id and (select auth.uid()) in (a.applicant_id,l.owner_id)));
drop policy if exists "Participants create own escalations" on public.monitoring_escalations;
create policy "Participants create own escalations" on public.monitoring_escalations for insert to authenticated
  with check (reported_by=(select auth.uid()) and exists(select 1 from public.adoption_applications a join public.pet_listings l on l.id=a.listing_id where a.id=application_id and a.status='Monitoring' and (select auth.uid()) in (a.applicant_id,l.owner_id)));

create or replace function public.set_contact_consent(target_conversation uuid, consent_value boolean)
returns void language plpgsql security definer set search_path=public as $$
begin
  update public.conversations set
    guardian_contact_consent = case when guardian_id=(select auth.uid()) then consent_value else guardian_contact_consent end,
    adopter_contact_consent = case when adopter_id=(select auth.uid()) then consent_value else adopter_contact_consent end
  where id=target_conversation and (select auth.uid()) in (guardian_id,adopter_id);
  if not found then raise exception 'Conversation unavailable'; end if;
end; $$;
revoke all on function public.set_contact_consent(uuid,boolean) from public,anon;
grant execute on function public.set_contact_consent(uuid,boolean) to authenticated;

create or replace function public.block_private_contact_details()
returns trigger language plpgsql security definer set search_path=public as $$
declare sharing_allowed boolean;
begin
  select guardian_contact_consent and adopter_contact_consent into sharing_allowed
  from public.conversations where id=new.conversation_id;
  if not coalesce(sharing_allowed,false) and (
    new.body ~* '[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}' or
    new.body ~ '(\+?63|0)[0-9 ()-]{9,}'
  ) then raise exception 'contact details require mutual consent'; end if;
  return new;
end; $$;
drop trigger if exists protect_message_contact_details on public.messages;
create trigger protect_message_contact_details before insert or update of body on public.messages
for each row execute function public.block_private_contact_details();

drop policy if exists "Users create own reviews" on public.reviews;
drop policy if exists "Reviews are public" on public.reviews;
drop policy if exists "Approved reviews are public" on public.reviews;
create policy "Approved reviews are public" on public.reviews for select to anon,authenticated
using (moderation_status='Approved' or reviewer_id=(select auth.uid()) or reviewed_user_id=(select auth.uid()));
drop policy if exists "Completed participants create reviews" on public.reviews;
create policy "Completed participants create reviews" on public.reviews for insert to authenticated
with check (
  reviewer_id=(select auth.uid()) and application_id is not null and
  exists(select 1 from public.adoption_applications a join public.pet_listings l on l.id=a.listing_id
    where a.id=application_id and a.status='Completed'
      and (select auth.uid()) in (a.applicant_id,l.owner_id)
      and reviewed_user_id=case when (select auth.uid())=a.applicant_id then l.owner_id else a.applicant_id end)
);

-- Only approved feedback contributes to the public Trust Score.
create or replace view public.trust_scores with (security_invoker=true) as
select reviewed_user_id,
  round(avg((accuracy+communication+care+handover)::numeric/4),2) as score,
  round(avg(accuracy),2) as accuracy,
  round(avg(communication),2) as communication,
  round(avg(care),2) as care,
  round(avg(handover),2) as handover,
  count(*) as review_count
from public.reviews where verified=true and moderation_status='Approved' and reviewed_user_id is not null
group by reviewed_user_id;
grant select on public.trust_scores to anon,authenticated;

create or replace function public.queue_monitoring_reminders()
returns trigger language plpgsql security definer set search_path=public as $$
declare d integer; ch text;
begin
  if new.status='Monitoring' and old.status is distinct from 'Monitoring' then
    foreach d in array array[2,7,14,30] loop
      foreach ch in array array['in_app','email','sms'] loop
        insert into public.notification_jobs(application_id,recipient_id,channel,template_key,scheduled_for,payload)
        values(new.id,new.applicant_id,ch,'monitoring_day_'||d,new.updated_at+(d||' days')::interval,jsonb_build_object('pet_name',new.pet_name,'day',d));
      end loop;
    end loop;
  end if;
  return new;
end; $$;
drop trigger if exists queue_application_monitoring_reminders on public.adoption_applications;
create trigger queue_application_monitoring_reminders after update of status on public.adoption_applications
for each row execute function public.queue_monitoring_reminders();

-- Replace the earlier RPC with explicit state transitions and listing updates.
create or replace function public.set_application_status(target_application uuid,next_status text)
returns public.adoption_applications language plpgsql security definer set search_path=public as $$
declare current_row public.adoption_applications; current_listing uuid;
begin
  select a.* into current_row from public.adoption_applications a
  join public.pet_listings l on l.id=a.listing_id
  where a.id=target_application and l.owner_id=(select auth.uid())
    and (public.has_role('guardian') or public.has_role('welfare_org')) for update;
  if not found then raise exception 'Application not found'; end if;
  current_listing := current_row.listing_id;
  if not ((current_row.status='Under review' and next_status in ('Monitoring','Declined')) or (current_row.status='Monitoring' and next_status='Completed')) then
    raise exception 'Invalid application transition';
  end if;
  update public.adoption_applications set status=next_status,updated_at=now() where id=target_application returning * into current_row;
  if next_status='Monitoring' then
    update public.adoption_applications set status='Declined',updated_at=now() where listing_id=current_listing and id<>target_application and status='Under review';
    update public.pet_listings set status='Paused',updated_at=now() where id=current_listing;
  elsif next_status='Completed' then
    update public.pet_listings set status='Rehomed',updated_at=now() where id=current_listing;
  end if;
  return current_row;
end; $$;
revoke all on function public.set_application_status(uuid,text) from public,anon;
grant execute on function public.set_application_status(uuid,text) to authenticated;
