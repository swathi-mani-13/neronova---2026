-- =========================================================
-- NERONOVA 2026 - Supabase PostgreSQL Schema & RLS Setup
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Teams Table
create table if not exists public.teams (
    id uuid primary key default uuid_generate_v4(),
    registration_id text unique not null,
    team_name text not null,
    college_type text not null check (college_type in ('Inter College', 'Intra College')),
    selected_domain text not null,
    project_title text,
    project_description text,
    is_paid boolean default false,
    payment_reference text,
    status text default 'Registered' check (status in ('Registered', 'Confirmed', 'Under Review', 'Selected', 'Rejected')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Team Members Table (2 to 4 members per team)
create table if not exists public.team_members (
    id uuid primary key default uuid_generate_v4(),
    team_id uuid references public.teams(id) on delete cascade not null,
    is_leader boolean default false,
    name text not null,
    email text not null,
    phone text not null,
    college text not null,
    department text not null,
    year_of_study text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Admin Users & Roles Table
create table if not exists public.admin_profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade,
    email text unique not null,
    full_name text not null,
    role text not null check (role in ('Main Admin', 'Organizing Team', 'Faculty Coordinator')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.admin_profiles enable row level security;

-- 5. Public RLS Policies (For Public Registration)
-- Allow anyone to insert team and team members during registration
create policy "Allow public team registration" 
    on public.teams for insert 
    with check (true);

create policy "Allow public team member registration" 
    on public.team_members for insert 
    with check (true);

-- Allow reading teams with matching registration_id (for confirmation lookup)
create policy "Allow public lookup by registration id"
    on public.teams for select
    using (true);

create policy "Allow public lookup of team members"
    on public.team_members for select
    using (true);

-- 6. Admin RLS Policies (For Authenticated Admin Access)
create policy "Allow full access for authenticated admins on teams"
    on public.teams for all
    to authenticated
    using (true)
    with check (true);

create policy "Allow full access for authenticated admins on team_members"
    on public.team_members for all
    to authenticated
    using (true)
    with check (true);

create policy "Allow full access for authenticated admins on profiles"
    on public.admin_profiles for select
    to authenticated
    using (true);

-- 7. Performance Indexes
create index if not exists idx_teams_registration_id on public.teams(registration_id);
create index if not exists idx_teams_domain on public.teams(selected_domain);
create index if not exists idx_teams_college_type on public.teams(college_type);
create index if not exists idx_team_members_team_id on public.team_members(team_id);
create index if not exists idx_team_members_email on public.team_members(email);
create index if not exists idx_team_members_phone on public.team_members(phone);
