-- ═══════════════════════════════════════════════════════════════════════════
-- Migration 003: Profiles + Invitation RLS Fix
-- ═══════════════════════════════════════════════════════════════════════════
-- 1. Create a public.profiles table synced from auth.users via trigger.
-- 2. Add RLS policy so invited users can accept their own invitation.
-- 3. Backfill profiles for existing users.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. PROFILES TABLE ───────────────────────────────────────────────────────
create table if not exists public.profiles (
    id          uuid primary key references auth.users(id) on delete cascade,
    full_name   text,
    email       text,
    created_at  timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, email)
    values (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.email
    );
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();

-- ── 2. RLS for PROFILES ─────────────────────────────────────────────────────
alter table public.profiles enable row_level_security;

-- Users can view profiles of members in their organisation
create policy "Users can view profiles in their organisation"
    on public.profiles for select
    using (exists (
        select 1 from public.memberships m1
        join public.memberships m2 on m1.organization_id = m2.organization_id
        where m1.user_id = auth.uid()
          and m2.user_id = profiles.id
    ));

-- Users can update their own profile
create policy "Users can update their own profile"
    on public.profiles for update
    using (id = auth.uid())
    with check (id = auth.uid());

-- ── 3. INVITATION ACCEPTANCE RLS FIX ────────────────────────────────────────
-- The existing "Admins can manage invitations" policy covers all crud but
-- requires admin/owner role. Invited users need a narrow policy to flip
-- their own invitation to "accepted".
create policy "Invited users can accept their own invitation"
    on public.invitations for update
    using (email = auth.email())
    with check (status = 'accepted');

-- ── 4. BACKFILL EXISTING USERS ──────────────────────────────────────────────
insert into public.profiles (id, full_name, email)
select
    id,
    raw_user_meta_data->>'full_name',
    email
from auth.users
on conflict (id) do nothing;
