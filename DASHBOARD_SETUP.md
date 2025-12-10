# Dashboard Setup Guide

## Overview

A complete admin dashboard has been created for your driving school comparison application at `/dashboard`. The dashboard is fully authenticated using Supabase Auth and protected by middleware.

## What's Been Created

### 1. Authentication System

- **Login Page**: `/login` - Email/password authentication
- **Auth Callback**: `/auth/callback` - Handles OAuth redirects
- **Middleware**: Protects all `/dashboard/*` routes
- **SSR Support**: Full server-side rendering with Supabase

### 2. Supabase Auth Helpers

- `lib/supabase/client.ts` - Client-side Supabase client
- `lib/supabase/server.ts` - Server-side Supabase client
- `lib/supabase/middleware.ts` - Middleware authentication helper

### 3. Dashboard Pages

#### Overview (`/dashboard`)

- Total enquiries counter
- Pending enquiries counter
- Total schools counter
- Response rate percentage
- Recent enquiries list with quick view

#### Enquiries Management (`/dashboard/enquiries`)

- View all enquiries in a table
- Search by name, email, or phone
- Filter by status (pending, contacted, completed)
- Update enquiry status inline
- View detailed enquiry information in modal
- Real-time status updates

#### Schools Management (`/dashboard/schools`)

- List all schools with logo, contact info, rating
- Add new schools with dialog form
- Edit school details (`/dashboard/schools/[id]`)
- Delete schools with confirmation
- Search functionality

#### Courses Management (`/dashboard/courses`)

- Tabbed interface for:
  - Course Levels (linked to schools and license types)
  - Course Shifts (Regular, Night, Weekend)
  - Course Packages (pricing and details)
- Delete functionality for all types
- Add/Edit dialogs (ready to be implemented)

### 4. Components Created

- `components/dashboard/dashboard-nav.tsx` - Sidebar navigation (responsive)
- `components/dashboard/dashboard-header.tsx` - Header with user menu
- `components/dashboard/add-school-dialog.tsx` - Add school form
- `components/dashboard/enquiry-details-dialog.tsx` - View enquiry details

### 5. API Routes

All API routes are authenticated and use server-side Supabase client:

**Enquiries**:

- `GET /api/dashboard/enquiries` - List all enquiries
- `PATCH /api/dashboard/enquiries` - Update enquiry status

**Schools**:

- `GET /api/dashboard/schools` - List all schools
- `POST /api/dashboard/schools` - Create new school
- `GET /api/dashboard/schools/[id]` - Get single school
- `PATCH /api/dashboard/schools/[id]` - Update school
- `DELETE /api/dashboard/schools/[id]` - Delete school

**Courses**:

- `GET /api/dashboard/courses/levels` - List course levels
- `DELETE /api/dashboard/courses/levels/[id]` - Delete level
- `GET /api/dashboard/courses/shifts` - List course shifts
- `DELETE /api/dashboard/courses/shifts/[id]` - Delete shift
- `GET /api/dashboard/courses/packages` - List course packages
- `DELETE /api/dashboard/courses/packages/[id]` - Delete package

## Setup Instructions

### 1. Configure Supabase Authentication

1. Go to your Supabase Dashboard
2. Navigate to Authentication → Settings
3. Configure Site URL: `http://localhost:3000` (development)
4. Add Redirect URLs:
   - `http://localhost:3000/auth/callback`
   - Your production URL + `/auth/callback`

### 2. Create Admin User

**Option A: Via Supabase Dashboard (Recommended)**

1. Go to Authentication → Users
2. Click "Add User"
3. Enter email and password
4. Confirm the user
5. Save the credentials

**Option B: Via SQL (if you want role-based access)**

```sql
-- First, enable email auth and create user through Supabase Dashboard
-- Then, optionally add a role column to user metadata

-- Create a user_roles table (optional for future enhancement)
CREATE TABLE user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can read their own role"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);
```

### 3. Environment Variables

Make sure these are in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Update RLS Policies (if needed)

The existing RLS policies should work, but verify that authenticated users can:

- SELECT from all tables
- INSERT/UPDATE/DELETE schools, course_levels, course_shifts, course_packages
- UPDATE user_queries (for status changes)

Example policy for schools:

```sql
-- Allow authenticated users to manage schools
CREATE POLICY "Authenticated users can manage schools"
  ON schools FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

### 5. Start the Development Server

```bash
npm run dev
```

### 6. Access the Dashboard

1. Navigate to `http://localhost:3000/login`
2. Enter your admin credentials
3. You'll be redirected to `/dashboard`

## Features

### Security

- ✅ Middleware-protected routes
- ✅ Server-side authentication checks
- ✅ Row Level Security (RLS) on all tables
- ✅ Secure session management with Supabase Auth

### UI/UX

- ✅ Responsive design (mobile-friendly)
- ✅ Modern shadcn/ui components
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback
- ✅ Confirmation dialogs for destructive actions
- ✅ Search and filter functionality

### Data Management

- ✅ CRUD operations for schools
- ✅ Enquiry status management
- ✅ Real-time data updates
- ✅ Pagination-ready tables

## Architecture

### Authentication Flow

```
1. User visits /dashboard → Middleware intercepts
2. Middleware checks for valid session
3. If no session → Redirect to /login
4. User logs in → Supabase Auth creates session
5. Redirect to /dashboard → Middleware allows access
```

### Data Flow

```
Client Component
    ↓ (fetch)
API Route (/api/dashboard/*)
    ↓ (createClient from server.ts)
Supabase Server Client
    ↓ (authenticated query)
PostgreSQL Database (with RLS)
```

## Next Steps

### Enhancements to Consider

1. **Role-Based Access Control (RBAC)**

   - Add `user_roles` table
   - Implement super-admin vs regular admin
   - Restrict certain actions based on role

2. **Email Notifications**

   - Send email when new enquiry is received
   - Notify admins of pending enquiries
   - Use Supabase Edge Functions or Resend/SendGrid

3. **Export Functionality**

   - Export enquiries to CSV/Excel
   - Generate PDF reports
   - Schedule automated reports

4. **Advanced Analytics**

   - Enquiry conversion rates
   - Popular license types
   - Peak enquiry times
   - School performance metrics

5. **Audit Logging**

   - Track who made what changes
   - View change history
   - Compliance and security

6. **Course Management Enhancement**

   - Add/Edit forms for course levels
   - Bulk import course data
   - Course package templates

7. **File Uploads**

   - School logo uploads to Supabase Storage
   - Document attachments for enquiries
   - Certificate uploads

8. **Advanced Filters**
   - Date range filtering
   - Multi-select filters
   - Save filter presets

## Troubleshooting

### "User not authenticated" error

- Check that user exists in Supabase Auth
- Verify environment variables are set
- Clear browser cookies and try again

### Middleware redirect loop

- Ensure `/login` and `/auth/*` are excluded in middleware config
- Check that auth session is being set correctly

### RLS Policy errors

- Verify policies allow authenticated users to access data
- Check that `auth.role() = 'authenticated'` policies exist
- Test queries in Supabase SQL Editor

### Build warnings about Edge Runtime

- These are normal Supabase warnings
- They don't affect functionality
- Can be safely ignored in development

## Notes

- **No existing code was modified** - All dashboard code is completely separate
- **Existing public routes** remain unchanged (`/`, `/schools`, `/compare`, etc.)
- **Original Supabase client** (`lib/supabase.ts`) still works for public pages
- **New auth system** only applies to `/dashboard/*` routes

## Support

For issues or questions:

1. Check Supabase logs in the dashboard
2. Review browser console for errors
3. Verify RLS policies in Supabase
4. Check Next.js build output for warnings
