-- LaneLeader Pro — Supabase schema
-- Paste this whole file into the Supabase SQL Editor and run it once.

-- ========== profiles ==========

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  role text not null check (role in ('coach', 'swimmer')),
  coach_id uuid references public.profiles (id) on delete set null,
  club_name text,
  specialty text,
  avatar_color text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- SECURITY DEFINER helper so the "swimmer can see their coach" policy
-- doesn't recursively re-evaluate profiles RLS on itself.
create function public.current_coach_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select coach_id from public.profiles where id = auth.uid();
$$;

create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles_select_own_swimmers"
  on public.profiles for select
  using (coach_id = auth.uid());

create policy "profiles_select_own_coach"
  on public.profiles for select
  using (id = public.current_coach_id());

-- No insert/update/delete policies: rows are only ever created by the
-- handle_new_user trigger below (SECURITY DEFINER), never directly by clients.

-- ========== invites ==========

create table public.invites (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  coach_id uuid not null references public.profiles (id) on delete cascade,
  coach_name text not null,
  created_at timestamptz not null default now()
);

alter table public.invites enable row level security;

create policy "invites_select_own"
  on public.invites for select
  using (coach_id = auth.uid());

create policy "invites_insert_own"
  on public.invites for insert
  with check (coach_id = auth.uid());

create policy "invites_delete_own"
  on public.invites for delete
  using (coach_id = auth.uid());

-- ========== workouts ==========

create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  swimmer_id uuid not null references public.profiles (id) on delete cascade,
  coach_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  title text not null,
  description text,
  day_type text,
  pool_course text,
  sets jsonb not null default '[]'::jsonb,
  completed boolean not null default false,
  rpe int,
  feedback text,
  coach_review text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (swimmer_id, date)
);

alter table public.workouts enable row level security;

create policy "workouts_select_participant"
  on public.workouts for select
  using (coach_id = auth.uid() or swimmer_id = auth.uid());

create policy "workouts_insert_coach"
  on public.workouts for insert
  with check (
    coach_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = swimmer_id and coach_id = auth.uid()
    )
  );

-- Full-row update policy shared by coach and swimmer: both write into the
-- same `sets` jsonb blob (coach prescribes, swimmer logs results into it),
-- so this is not split by column. Deliberate simplification.
create policy "workouts_update_participant"
  on public.workouts for update
  using (coach_id = auth.uid() or swimmer_id = auth.uid())
  with check (coach_id = auth.uid() or swimmer_id = auth.uid());

create policy "workouts_delete_coach"
  on public.workouts for delete
  using (coach_id = auth.uid());

-- ========== invite redemption RPC ==========

-- Atomic, race-safe: deletes the code and returns the coach info in one
-- statement, so two swimmers can't both redeem the same code, and a
-- swimmer never needs SELECT access to the invites table.
create function public.redeem_invite_code(p_code text)
returns table (coach_id uuid, coach_name text)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    delete from public.invites
    where code = p_code
    returning invites.coach_id, invites.coach_name;
end;
$$;

grant execute on function public.redeem_invite_code(text) to anon, authenticated;

-- ========== new-user trigger ==========

-- Creates the profiles row automatically on signup, reading the extra
-- fields out of the metadata passed to supabase.auth.signUp({ options: { data: {...} } }).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role, coach_id, club_name, specialty)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'swimmer'),
    nullif(new.raw_user_meta_data ->> 'coach_id', '')::uuid,
    new.raw_user_meta_data ->> 'club_name',
    new.raw_user_meta_data ->> 'specialty'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
