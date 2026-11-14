-- ==============================================================================
-- NERONOVA 2026 - Production Hardened Supabase PostgreSQL Schema & Security
-- ==============================================================================
-- Version: 2.0 (Security Audited & RLS Hardened)
-- Compatible with: NERONOVA 2026 Public Portal & Admin Dashboard
-- Safe to Re-run: Fully Idempotent (No Duplicate Policy or Trigger Errors)
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
-- 5. PERFORMANCE & INTEGRITY INDEXES
-- ==============================================================================
create unique index if not exists idx_teams_unique_reg_id on public.teams(registration_id);
create unique index if not exists idx_teams_unique_name on public.teams(lower(trim(team_name)));
create index if not exists idx_teams_domain on public.teams(selected_domain);
create index if not exists idx_teams_college_type on public.teams(college_type);
create index if not exists idx_teams_is_paid on public.teams(is_paid);
create index if not exists idx_teams_created_at on public.teams(created_at desc);

create unique index if not exists idx_members_unique_email on public.team_members(lower(trim(email)));
create unique index if not exists idx_members_unique_phone on public.team_members(phone);
create index if not exists idx_team_members_team_id on public.team_members(team_id);

create index if not exists idx_enquiries_created_at on public.enquiries(created_at desc);

create unique index if not exists idx_admin_profiles_unique_user on public.admin_profiles(user_id);
create unique index if not exists idx_admin_profiles_unique_email on public.admin_profiles(lower(trim(email)));

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) ACTIVATION
-- ==============================================================================
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.enquiries enable row level security;
alter table public.admin_profiles enable row level security;

-- ==============================================================================
-- 7. SECURITY DEFINER HELPER FUNCTIONS (Fixed search_path to prevent hijacking)
-- ==============================================================================

-- Check if authenticated session user is an authorized admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select exists (
    select 1 
    from public.admin_profiles 
    where user_id = auth.uid()
  );
$$;

-- Get the exact role of the authenticated admin
create or replace function public.get_admin_role()
returns text
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select role 
  from public.admin_profiles 
  where user_id = auth.uid()
  limit 1;
$$;

-- Secure duplicate check function for public registration
-- Checks duplicates WITHOUT giving public users SELECT access to sensitive student records
create or replace function public.check_registration_duplicates(
    p_team_name text,
    p_email text,
    p_phone text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
stable
as $$
declare
    v_clean_phone text;
begin
    -- 1. Check Team Name (case-insensitive, trimmed)
    if exists (
        select 1 
        from public.teams 
        where lower(trim(team_name)) = lower(trim(p_team_name))
    ) then
        return jsonb_build_object(
            'duplicate', true,
            'field', 'team_name',
            'message', 'Team Name is already registered. Please choose a different team name.'
        );
    end if;

    -- 2. Check Member Email (case-insensitive, trimmed)
    if exists (
        select 1 
        from public.team_members 
        where lower(trim(email)) = lower(trim(p_email))
    ) then
        return jsonb_build_object(
            'duplicate', true,
            'field', 'email',
            'message', 'Email address is already registered with another team.'
        );
    end if;

    -- 3. Check Member Phone (digits only)
    v_clean_phone := regexp_replace(p_phone, '[^0-9]', '', 'g');
    if exists (
        select 1 
        from public.team_members 
        where phone = v_clean_phone
    ) then
        return jsonb_build_object(
            'duplicate', true,
            'field', 'phone',
            'message', 'Phone number is already registered with another team.'
        );
    end if;

    return jsonb_build_object('duplicate', false);
end;
$$;

-- Secure Bootstrap Function: Link an Auth user to Main Admin role in admin_profiles
create or replace function public.bootstrap_admin(
    admin_email text,
    admin_name text default 'Main Admin'
)
returns text
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
    v_user_id uuid;
begin
    -- Find user in auth.users by email
    select id into v_user_id
    from auth.users
    where email = lower(trim(admin_email))
    limit 1;

    if v_user_id is null then
        return 'Error: No user found in Supabase Auth with email ' || admin_email || '. Create the user in Auth -> Users first.';
    end if;

    -- Insert or update into admin_profiles
    insert into public.admin_profiles (user_id, email, full_name, role)
    values (v_user_id, lower(trim(admin_email)), admin_name, 'Main Admin')
    on conflict (user_id) 
    do update set role = 'Main Admin', full_name = admin_name, updated_at = now();

    return 'Success: ' || admin_email || ' assigned role "Main Admin" (UID: ' || v_user_id || ')';
end;
$$;

-- ==============================================================================
-- 8. RLS POLICIES FOR TEAMS (Idempotent: Drops existing policies before creating)
-- ==============================================================================
drop policy if exists "Public users can register team" on public.teams;
drop policy if exists "Public users can lookup teams" on public.teams;
drop policy if exists "Admins can update teams" on public.teams;
drop policy if exists "Main Admins can delete teams" on public.teams;
drop policy if exists "Allow full access for authenticated admins on teams" on public.teams;
drop policy if exists "Public can insert teams" on public.teams;
drop policy if exists "Admins can select teams" on public.teams;

-- 1. Public can insert new team during registration
create policy "Public can insert teams" 
    on public.teams 
    for insert 
    to anon, authenticated
    with check (true);

-- 2. ONLY authorized admins can read all teams (Prevents public harvesting)
create policy "Admins can select teams" 
    on public.teams 
    for select 
    to authenticated 
    using (public.is_admin());

-- 3. Authorized admins can update payment and review status
create policy "Admins can update teams" 
    on public.teams 
    for update 
    to authenticated 
    using (public.is_admin()) 
    with check (public.is_admin());

-- 4. Only 'Main Admin' role can delete teams
create policy "Main Admins can delete teams" 
    on public.teams 
    for delete 
    to authenticated 
    using (public.get_admin_role() = 'Main Admin');

-- ==============================================================================
-- 9. RLS POLICIES FOR TEAM MEMBERS (Idempotent)
-- ==============================================================================
drop policy if exists "Public users can insert team members" on public.team_members;
drop policy if exists "Public users can read team members" on public.team_members;
drop policy if exists "Admins can update team members" on public.team_members;
drop policy if exists "Main Admins can delete team members" on public.team_members;
drop policy if exists "Allow full access for authenticated admins on team_members" on public.team_members;
drop policy if exists "Public can insert team members" on public.team_members;
drop policy if exists "Admins can select team members" on public.team_members;

-- 1. Public can insert members during team registration
create policy "Public can insert team members" 
    on public.team_members 
    for insert 
    to anon, authenticated
    with check (true);

-- 2. ONLY authorized admins can select members (Protects personal email, phone & names)
create policy "Admins can select team members" 
    on public.team_members 
    for select 
    to authenticated 
    using (public.is_admin());

-- 3. Authorized admins can update team members
create policy "Admins can update team members" 
    on public.team_members 
    for update 
    to authenticated 
    using (public.is_admin()) 
    with check (public.is_admin());

-- 4. Only 'Main Admin' role can delete team members
create policy "Main Admins can delete team members" 
    on public.team_members 
    for delete 
    to authenticated 
    using (public.get_admin_role() = 'Main Admin');

-- ==============================================================================
-- 10. RLS POLICIES FOR ENQUIRIES (Idempotent)
-- ==============================================================================
drop policy if exists "Public users can submit enquiries" on public.enquiries;
drop policy if exists "Admins can read enquiries" on public.enquiries;
drop policy if exists "Admins can update enquiries" on public.enquiries;
drop policy if exists "Main Admins can delete enquiries" on public.enquiries;

-- 1. Public users can insert contact queries
create policy "Public users can submit enquiries" 
    on public.enquiries 
    for insert 
    to anon, authenticated
    with check (true);

-- 2. Only authenticated admins can read enquiries
create policy "Admins can read enquiries" 
    on public.enquiries 
    for select 
    to authenticated 
    using (public.is_admin());

-- 3. Authorized admins can update enquiry status
create policy "Admins can update enquiries" 
    on public.enquiries 
    for update 
    to authenticated 
    using (public.is_admin()) 
    with check (public.is_admin());

-- 4. Only 'Main Admin' can delete enquiries
create policy "Main Admins can delete enquiries" 
    on public.enquiries 
    for delete 
    to authenticated 
    using (public.get_admin_role() = 'Main Admin');

-- ==============================================================================
-- 11. RLS POLICIES FOR ADMIN PROFILES (Idempotent)
-- ==============================================================================
drop policy if exists "Admins can view admin profiles" on public.admin_profiles;
drop policy if exists "Main Admins can manage admin profiles" on public.admin_profiles;
drop policy if exists "Admins can view their own profile" on public.admin_profiles;
drop policy if exists "Allow bootstrap of first admin if table is empty" on public.admin_profiles;
drop policy if exists "Main Admins can insert admin profiles" on public.admin_profiles;
drop policy if exists "Main Admins can update admin profiles" on public.admin_profiles;
drop policy if exists "Main Admins can delete admin profiles" on public.admin_profiles;

-- 1. Authenticated admins can view their own profile or all profiles if admin
create policy "Admins can view their own profile" 
    on public.admin_profiles 
    for select 
    to authenticated 
    using (auth.uid() = user_id or public.is_admin());

-- 2. Bootstrap policy: If zero admin profiles exist, allow the first authenticated user to claim profile
create policy "Allow bootstrap of first admin if table is empty" 
    on public.admin_profiles 
    for insert 
    to authenticated 
    with check (
      not exists (select 1 from public.admin_profiles)
      and auth.uid() = user_id
    );

-- 3. Main Admin can add new admin profiles
create policy "Main Admins can insert admin profiles" 
    on public.admin_profiles 
    for insert 
    to authenticated 
    with check (public.get_admin_role() = 'Main Admin');

-- 4. Main Admin can update admin roles and profiles
create policy "Main Admins can update admin profiles" 
    on public.admin_profiles 
    for update 
    to authenticated 
    using (public.get_admin_role() = 'Main Admin') 
    with check (public.get_admin_role() = 'Main Admin');

-- 5. Main Admin can delete admin profiles
create policy "Main Admins can delete admin profiles" 
    on public.admin_profiles 
    for delete 
    to authenticated 
    using (public.get_admin_role() = 'Main Admin');

-- ==============================================================================
-- 12. PERMISSIONS GRANTS (Explicit anon/authenticated table permissions)
-- ==============================================================================
grant usage on schema public to anon, authenticated;
grant insert on table public.teams to anon, authenticated;
grant insert on table public.team_members to anon, authenticated;
grant insert on table public.enquiries to anon, authenticated;

grant select, update, delete on table public.teams to authenticated;
grant select, update, delete on table public.team_members to authenticated;
grant select, update, delete on table public.enquiries to authenticated;
grant select, insert, update, delete on table public.admin_profiles to authenticated;

grant execute on function public.check_registration_duplicates to anon, authenticated;
grant execute on function public.is_admin to authenticated;
grant execute on function public.get_admin_role to authenticated;
grant execute on function public.bootstrap_admin to authenticated;
