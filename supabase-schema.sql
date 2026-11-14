-- ==============================================================================
-- NERONOVA 2026 - Official Supabase PostgreSQL Schema & Security Configuration
-- ==============================================================================
-- Compatible with: NERONOVA 2026 Public Portal & Admin Dashboard
-- Architecture: Multi-Role RLS, Relational Integrity, Performance Indexed
-- ==============================================================================

-- 0. Enable Required Extensions
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 1. TEAMS TABLE
-- ==============================================================================
create table if not exists public.teams (
    id uuid primary key default uuid_generate_v4(),
    registration_id text unique not null,
    team_name text not null,
    college_type text not null check (college_type in ('Inter College', 'Intra College')),
    selected_domain text not null,
    project_title text,
    project_description text,
    is_paid boolean default false not null,
    payment_reference text default '',
    status text default 'Registered' not null check (status in ('Registered', 'Confirmed', 'Under Review', 'Selected', 'Rejected')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 2. TEAM MEMBERS TABLE (2 to 4 members per team)
-- ==============================================================================
create table if not exists public.team_members (
    id uuid primary key default uuid_generate_v4(),
    team_id uuid references public.teams(id) on delete cascade not null,
    is_leader boolean default false not null,
    name text not null,
    email text not null,
    phone text not null,
    college text not null,
    department text not null,
    year_of_study text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 3. CONTACT & ENQUIRIES TABLE
-- ==============================================================================
create table if not exists public.enquiries (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    email text not null,
    phone text not null,
    subject text not null,
    message text not null,
    status text default 'Pending' not null check (status in ('Pending', 'In Review', 'Resolved')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 4. ADMIN PROFILES & ROLE-BASED ACCESS CONTROL (RBAC)
-- ==============================================================================
create table if not exists public.admin_profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade unique not null,
    email text unique not null,
    full_name text not null,
    role text not null check (role in ('Main Admin', 'Organizing Team', 'Faculty Coordinator')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 5. PERFORMANCE INDEXES
-- ==============================================================================
create index if not exists idx_teams_registration_id on public.teams(registration_id);
create index if not exists idx_teams_team_name on public.teams(lower(team_name));
create index if not exists idx_teams_domain on public.teams(selected_domain);
create index if not exists idx_teams_college_type on public.teams(college_type);
create index if not exists idx_teams_is_paid on public.teams(is_paid);
create index if not exists idx_teams_created_at on public.teams(created_at desc);

create index if not exists idx_team_members_team_id on public.team_members(team_id);
create index if not exists idx_team_members_email on public.team_members(lower(email));
create index if not exists idx_team_members_phone on public.team_members(phone);

create index if not exists idx_enquiries_created_at on public.enquiries(created_at desc);
create index if not exists idx_admin_profiles_user_id on public.admin_profiles(user_id);
create index if not exists idx_admin_profiles_email on public.admin_profiles(lower(email));

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) ACTIVATION
-- ==============================================================================
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.enquiries enable row level security;
alter table public.admin_profiles enable row level security;

-- ==============================================================================
-- 7. RLS HELPER FUNCTION: Check if requesting user is an authorized admin
-- ==============================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 
    from public.admin_profiles 
    where user_id = auth.uid()
  );
$$;

create or replace function public.get_admin_role()
returns text
language sql
security definer
stable
as $$
  select role 
  from public.admin_profiles 
  where user_id = auth.uid()
  limit 1;
$$;

-- ==============================================================================
-- 8. RLS POLICIES FOR TEAMS
-- ==============================================================================
-- Anyone (public/unauthenticated) can register a new team
create policy "Public users can register team" 
    on public.teams 
    for insert 
    with check (true);

-- Anyone can read their own team data via registration_id lookup or duplicate check
create policy "Public users can lookup teams" 
    on public.teams 
    for select 
    using (true);

-- Authenticated admins have full update and management permissions
create policy "Admins can update teams" 
    on public.teams 
    for update 
    to authenticated 
    using (public.is_admin()) 
    with check (public.is_admin());

-- Only 'Main Admin' role can delete teams
create policy "Main Admins can delete teams" 
    on public.teams 
    for delete 
    to authenticated 
    using (public.get_admin_role() = 'Main Admin');

-- ==============================================================================
-- 9. RLS POLICIES FOR TEAM MEMBERS
-- ==============================================================================
-- Anyone can insert members during registration
create policy "Public users can insert team members" 
    on public.team_members 
    for insert 
    with check (true);

-- Anyone can read team members for confirmation or duplicate verification
create policy "Public users can read team members" 
    on public.team_members 
    for select 
    using (true);

-- Authenticated admins have full update permissions on team members
create policy "Admins can update team members" 
    on public.team_members 
    for update 
    to authenticated 
    using (public.is_admin()) 
    with check (public.is_admin());

-- Only 'Main Admin' can delete team members directly
create policy "Main Admins can delete team members" 
    on public.team_members 
    for delete 
    to authenticated 
    using (public.get_admin_role() = 'Main Admin');

-- ==============================================================================
-- 10. RLS POLICIES FOR ENQUIRIES
-- ==============================================================================
-- Public users can submit contact enquiries
create policy "Public users can submit enquiries" 
    on public.enquiries 
    for insert 
    with check (true);

-- Only authenticated admins can read enquiries
create policy "Admins can read enquiries" 
    on public.enquiries 
    for select 
    to authenticated 
    using (public.is_admin());

-- Only authenticated admins can update enquiry status
create policy "Admins can update enquiries" 
    on public.enquiries 
    for update 
    to authenticated 
    using (public.is_admin()) 
    with check (public.is_admin());

-- Only 'Main Admin' can delete enquiries
create policy "Main Admins can delete enquiries" 
    on public.enquiries 
    for delete 
    to authenticated 
    using (public.get_admin_role() = 'Main Admin');

-- ==============================================================================
-- 11. RLS POLICIES FOR ADMIN PROFILES
-- ==============================================================================
-- Authenticated admins can view all admin profiles
create policy "Admins can view admin profiles" 
    on public.admin_profiles 
    for select 
    to authenticated 
    using (public.is_admin() or auth.uid() = user_id);

-- Only Main Admin can insert or modify admin profiles
create policy "Main Admins can manage admin profiles" 
    on public.admin_profiles 
    for all 
    to authenticated 
    using (public.get_admin_role() = 'Main Admin') 
    with check (public.get_admin_role() = 'Main Admin');
