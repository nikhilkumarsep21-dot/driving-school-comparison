# Fix RLS Policies for Dashboard

## Problem

The add functionality in all 4 sections (License Types, Course Levels, Shifts, Packages) was failing with "violates row level security policy" error because the tables only had SELECT policies for public users, but no INSERT/UPDATE/DELETE policies for authenticated users.

## Solution

Created migration file: `20260108_add_authenticated_policies.sql`

This migration adds INSERT, UPDATE, and DELETE policies for authenticated users on all tables:

- schools
- branch_locations
- license_types
- course_levels
- shifts
- packages
- user_queries

## How to Apply

### Option 1: Using Supabase CLI (Recommended)

```bash
# If you have Supabase CLI installed and linked to your project
supabase db push
```

### Option 2: Manual Application via Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the entire content of `supabase/migrations/20260108_add_authenticated_policies.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute

### Option 3: Using psql or any PostgreSQL client

```bash
psql postgresql://[your-connection-string] < supabase/migrations/20260108_add_authenticated_policies.sql
```

## Verification

After applying the migration, test by:

1. Login to the dashboard
2. Try adding a new License Type
3. Try adding a new Course Level
4. Try adding a new Shift
5. Try adding a new Package

All add operations should now work without RLS policy errors.

## What Changed

- Added INSERT policies for authenticated users on all tables
- Added UPDATE policies for authenticated users on all tables
- Added DELETE policies for authenticated users on all tables
- Public users (anon) can still read all data (SELECT)
- Authenticated users can now perform full CRUD operations
