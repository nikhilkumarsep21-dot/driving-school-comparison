# School Data Import Scripts

This directory contains scripts for importing and managing driving school data.

## Available Scripts

### Import School 4 Details
Imports all 7 license category details for Dubai Driving Center (DDC) into the Supabase database.

```bash
npm run import:school4
```

**What it does:**
- Parses CSV data containing course details, documents required, lecture information, and fees
- Validates JSON structures for all fields
- Inserts/updates records for all 7 license categories:
  1. Motorcycle
  2. Light Motor Vehicle
  3. Heavy Truck
  4. Light Bus
  5. Heavy Bus
  6. Light Forklift
  7. Heavy Forklift
- Uses upsert logic to prevent duplicates

### Test School 4 Details
Verifies that school 4 details were correctly imported and can be retrieved.

```bash
npm run test:school4
```

**What it does:**
- Fetches school 4 information from Supabase
- Retrieves all detail records with category information
- Displays summary statistics for each category
- Shows sample data to verify JSON structure integrity

## Data Structure

Each detail record contains:
- **documents_required**: Array of document requirements by student type (JSONB)
- **course_details**: Array of course information sections (JSONB)
- **lecture_details**: Array of lecture/training information (JSONB)
- **fees**: Object containing timings, course fees, and other fees (JSONB)

## Database Schema

The details table has a unique constraint on `(school_id, category_id)` to prevent duplicate entries for the same school-category combination.

## Import Status

✅ School 4 (Dubai Driving Center) - All 7 categories imported successfully
- Category 1: Motorcycle
- Category 2: Light Motor Vehicle
- Category 3: Heavy Truck
- Category 4: Light Bus
- Category 5: Heavy Bus
- Category 6: Light Forklift
- Category 7: Heavy Forklift

## Notes

- The import script uses PostgreSQL dollar-quoted strings (`$json$...$json$`) to properly handle JSON with nested quotes
- All JSON data is stored as JSONB for efficient querying and indexing
- The existing API endpoints automatically include details when fetching school information
