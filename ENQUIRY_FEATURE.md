# Enquiry Now Feature

This document describes the "Enquire Now" feature that has been implemented across the driving school comparison platform.

## Overview

The feature allows users to submit enquiries about driving schools. User information is stored in cookies to avoid repeated data entry, and enquiries are saved to the database for tracking.

## Components Created

### 1. EnquiryModal (`/components/enquiry-modal.tsx`)
A reusable modal component that collects user information and submits enquiries.

**Features:**
- Auto-fills user data from cookies if previously entered
- Form validation for name, email, and phone
- Optional message field
- Saves user details to cookies for future use
- Stores enquiry in database with school reference
- Beautiful UI with animations using Framer Motion

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: function - Callback when modal closes
- `schoolId`: string (optional) - ID of the school being enquired about
- `schoolName`: string (optional) - Name of the school

### 2. Database Migration
**File:** `/supabase/migrations/20251027_create_user_queries.sql`

**Table:** `user_queries`
- `id`: UUID (primary key)
- `name`: VARCHAR(255) - User's full name
- `email`: VARCHAR(255) - User's email
- `phone`: VARCHAR(50) - User's phone number
- `school_id`: UUID (foreign key to schools table)
- `school_name`: VARCHAR(255) - School name for reference
- `message`: TEXT - Optional message from user
- `status`: VARCHAR(50) - Status of enquiry (default: 'pending')
- `created_at`: TIMESTAMP - When enquiry was created
- `updated_at`: TIMESTAMP - Last update time

**Indexes:**
- `idx_user_queries_email` - For finding queries by email
- `idx_user_queries_created_at` - For sorting by date
- `idx_user_queries_status` - For filtering by status

**Security:**
- Row Level Security (RLS) enabled
- Public can insert (for enquiry submissions)
- Only authenticated users can view all queries (for admin panel)

## Integration Points

### 1. School Detail Page (`/app/school/[slug]/page.tsx`)
- Added "Enquire Now" button next to "Add to Compare" button in the hero section
- Opens EnquiryModal with school context pre-filled

### 2. School Card Component (`/components/school-card.tsx`)
- Added "Enquire Now" button below "View Details" button
- Each school card can trigger an enquiry for that specific school

### 3. Category Form Modal (`/components/category-form-modal.tsx`)
- Added "Enquire Now" button in Step 4 (package selection)
- Each school in the package grid can receive enquiries

## Cookie Storage

**Cookie Name:** `user_details`

**Data Structure:**
```typescript
{
  name: string;
  email: string;
  phone: string;
}
```

**Features:**
- 90-day expiration
- Automatically loads on modal open
- Only saves after successful enquiry submission
- Secure, SameSite=Lax

## User Flow

1. **User clicks "Enquire Now" button** (from school card, detail page, or category modal)
2. **Modal opens** and checks for saved user details in cookies
3. **Auto-fills form** if user details exist in cookies
4. **User fills/reviews information** and optionally adds a message
5. **Form validation** ensures all required fields are valid
6. **On submit:**
   - User details saved to cookies
   - Enquiry saved to database with school reference
   - Success toast notification shown
   - Modal closes
7. **Next time** user clicks "Enquire Now", their details are pre-filled

## Validation Rules

- **Name:** Required, minimum 2 characters
- **Email:** Required, valid email format
- **Phone:** Required, minimum 8 digits (accepts international format)
- **Message:** Optional, no validation

## Future Enhancements

1. **Admin Panel:**
   - View all enquiries
   - Filter by status, school, date
   - Mark as contacted/resolved
   - Export to CSV

2. **Email Notifications:**
   - Send email to school when enquiry received
   - Send confirmation email to user
   - Send follow-up reminders

3. **Enhanced Tracking:**
   - Track enquiry source (which page/button)
   - Add UTM parameters
   - Conversion tracking

4. **User Dashboard:**
   - View submitted enquiries
   - Track responses
   - Edit/cancel enquiries

## Running the Migration

To apply the database migration:

```bash
# If using Supabase CLI locally
npx supabase db reset

# Or apply migration directly
npx supabase db push
```

## Testing Checklist

- [ ] Enquiry modal opens from school card
- [ ] Enquiry modal opens from school detail page
- [ ] Enquiry modal opens from category form modal
- [ ] Form validation works correctly
- [ ] User details save to cookies
- [ ] Saved details auto-fill on next open
- [ ] Enquiry saves to database with correct school reference
- [ ] Success/error toast notifications display
- [ ] Modal closes after successful submission
- [ ] Works across different browsers
- [ ] Mobile responsive design

## Database Query Examples

### Get all enquiries for a school
```sql
SELECT * FROM user_queries 
WHERE school_id = 'your-school-id' 
ORDER BY created_at DESC;
```

### Get pending enquiries
```sql
SELECT * FROM user_queries 
WHERE status = 'pending' 
ORDER BY created_at DESC;
```

### Get enquiries by email
```sql
SELECT * FROM user_queries 
WHERE email = 'user@example.com' 
ORDER BY created_at DESC;
```

### Update enquiry status
```sql
UPDATE user_queries 
SET status = 'contacted', updated_at = NOW() 
WHERE id = 'enquiry-id';
```
