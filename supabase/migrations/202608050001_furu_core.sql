create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username varchar(15) not null check (char_length(trim(username)) between 4 and 15),
  phone text not null default '',
  location text not null default '',
  purpose text not null default 'Both' check (purpose in ('Rehome a pet','Adopt a pet','Both')),
  bio varchar(280) not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pet_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  animal_type text not null,
  breed text not null,
  age text not null,
  location text not null,
  reason text not null,
  status text not null default 'Published' check (status in ('Published','Paused','Rehomed')),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists pet_listings_owner_id_idx on public.pet_listings(owner_id);

create table if not exists public.adoption_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid references public.pet_listings(id) on delete set null,
  pet_key text not null,
  pet_name text not null,
  status text not null default 'Under review' check (status in ('Under review','Monitoring','Completed','Declined','Withdrawn')),
  answers jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists adoption_applications_applicant_idx on public.adoption_applications(applicant_id);
create unique index if not exists one_active_adoption_per_user on public.adoption_applications(applicant_id) where status in ('Under review','Monitoring');

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewed_user_id uuid references public.profiles(id) on delete cascade,
  listing_id uuid references public.pet_listings(id) on delete set null,
  pet_key text,
  rating numeric(2,1) not null check (rating between 1 and 5 and rating * 2 = trunc(rating * 2)),
  review text not null check (char_length(review) between 20 and 2000),
  accuracy smallint not null check (accuracy between 1 and 5),
  communication smallint not null check (communication between 1 and 5),
  care smallint not null check (care between 1 and 5),
  handover smallint not null check (handover between 1 and 5),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  check (reviewed_user_id is null or reviewer_id <> reviewed_user_id)
);
create index if not exists reviews_reviewed_user_idx on public.reviews(reviewed_user_id);
create index if not exists reviews_pet_key_idx on public.reviews(pet_key);

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  pet_key text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, pet_key)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.pet_listings(id) on delete set null,
  guardian_id uuid not null references public.profiles(id) on delete cascade,
  adopter_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (listing_id, guardian_id, adopter_id)
);
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists messages_conversation_idx on public.messages(conversation_id,created_at);

create table if not exists public.monitoring_checkins (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.adoption_applications(id) on delete cascade,
  submitted_by uuid not null references public.profiles(id) on delete cascade,
  day_number smallint not null check (day_number in (2,7,14,30)),
  notes text not null,
  welfare_status text not null default 'Doing well' check (welfare_status in ('Doing well','Needs support','Urgent concern')),
  created_at timestamptz not null default now(),
  unique(application_id,day_number,submitted_by)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid references public.pet_listings(id) on delete set null,
  pet_key text,
  reason text not null,
  details text not null,
  status text not null default 'Open' check (status in ('Open','Investigating','Closed')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.profiles(id,username,phone,location,purpose)
  values(new.id,coalesce(new.raw_user_meta_data->>'username','FurU user'),coalesce(new.raw_user_meta_data->>'phone',''),coalesce(new.raw_user_meta_data->>'location',''),coalesce(new.raw_user_meta_data->>'purpose','Both'));
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.pet_listings enable row level security;
alter table public.adoption_applications enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.monitoring_checkins enable row level security;
alter table public.reports enable row level security;

create policy "Users view own profile" on public.profiles for select to authenticated using ((select auth.uid())=id);
create policy "Users update own profile" on public.profiles for update to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
create policy "Listings are public" on public.pet_listings for select to anon,authenticated using (status in ('Published','Rehomed') or owner_id=(select auth.uid()));
create policy "Owners create listings" on public.pet_listings for insert to authenticated with check (owner_id=(select auth.uid()));
create policy "Owners update listings" on public.pet_listings for update to authenticated using (owner_id=(select auth.uid())) with check (owner_id=(select auth.uid()));
create policy "Owners delete listings" on public.pet_listings for delete to authenticated using (owner_id=(select auth.uid()));
create policy "Applicants and owners view applications" on public.adoption_applications for select to authenticated using (applicant_id=(select auth.uid()) or exists(select 1 from public.pet_listings l where l.id=listing_id and l.owner_id=(select auth.uid())));
create policy "Applicants create applications" on public.adoption_applications for insert to authenticated with check (applicant_id=(select auth.uid()));
create policy "Participants update applications" on public.adoption_applications for update to authenticated using (applicant_id=(select auth.uid()) or exists(select 1 from public.pet_listings l where l.id=listing_id and l.owner_id=(select auth.uid())));
create policy "Reviews are public" on public.reviews for select to anon,authenticated using (true);
create policy "Users create own reviews" on public.reviews for insert to authenticated with check (reviewer_id=(select auth.uid()) and (reviewed_user_id is null or reviewed_user_id<>(select auth.uid())));
create policy "Reviewers update reviews" on public.reviews for update to authenticated using (reviewer_id=(select auth.uid())) with check (reviewer_id=(select auth.uid()));
create policy "Reviewers delete reviews" on public.reviews for delete to authenticated using (reviewer_id=(select auth.uid()));
create policy "Users manage favorites" on public.favorites for all to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy "Participants view conversations" on public.conversations for select to authenticated using ((select auth.uid()) in (guardian_id,adopter_id));
create policy "Participants create conversations" on public.conversations for insert to authenticated with check ((select auth.uid()) in (guardian_id,adopter_id));
create policy "Participants view messages" on public.messages for select to authenticated using (exists(select 1 from public.conversations c where c.id=conversation_id and (select auth.uid()) in (c.guardian_id,c.adopter_id)));
create policy "Participants send messages" on public.messages for insert to authenticated with check (sender_id=(select auth.uid()) and exists(select 1 from public.conversations c where c.id=conversation_id and (select auth.uid()) in (c.guardian_id,c.adopter_id)));
create policy "Participants view checkins" on public.monitoring_checkins for select to authenticated using (exists(select 1 from public.adoption_applications a left join public.pet_listings l on l.id=a.listing_id where a.id=application_id and ((select auth.uid())=a.applicant_id or (select auth.uid())=l.owner_id)));
create policy "Participants create checkins" on public.monitoring_checkins for insert to authenticated with check (submitted_by=(select auth.uid()) and exists(select 1 from public.adoption_applications a left join public.pet_listings l on l.id=a.listing_id where a.id=application_id and ((select auth.uid())=a.applicant_id or (select auth.uid())=l.owner_id)));
create policy "Users create reports" on public.reports for insert to authenticated with check (reporter_id=(select auth.uid()));
create policy "Users view own reports" on public.reports for select to authenticated using (reporter_id=(select auth.uid()));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('avatars','avatars',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy "Avatar images are public" on storage.objects for select to anon,authenticated using (bucket_id='avatars');
create policy "Users upload own avatar" on storage.objects for insert to authenticated with check (bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Users update own avatar" on storage.objects for update to authenticated using (bucket_id='avatars' and owner_id=(select auth.uid()::text)) with check (bucket_id='avatars' and owner_id=(select auth.uid()::text));
create policy "Users delete own avatar" on storage.objects for delete to authenticated using (bucket_id='avatars' and owner_id=(select auth.uid()::text));
