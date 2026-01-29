# Migration Plan: MongoDB to Supabase

## 1. Database Schema (Supabase/PostgreSQL)

We need to create two tables in Supabase: `individuals` and `businesses`.

### Table: `individuals`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary Key, Default: gen_random_uuid() |
| full_name | text | |
| email | text | |
| reason | text | |
| source | text | |
| created_at | timestamptz | Default: now() |

### Table: `businesses`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary Key, Default: gen_random_uuid() |
| full_name | text | |
| email | text | |
| business_name | text | |
| team_size | text | |
| country | text | |
| website | text | |
| reason | text | |
| source | text | |
| created_at | timestamptz | Default: now() |

## 2. Dependencies
- Remove `mongoose`
- Add `@supabase/supabase-js`

## 3. Environment Variables
- Remove `MONGODB_URI`
- Add `SUPABASE_URL`
- Add `SUPABASE_ANON_KEY`

## 4. Code Changes
- Initialize Supabase client in `index.js`.
- Replace Mongoose model calls with Supabase query builder calls.
- Update field names to match PostgreSQL snake_case convention (optional but recommended) or keep camelCase if preferred. I will use snake_case for the database columns but map them in the code.

## 5. SQL for Supabase
```sql
-- Create individuals table
CREATE TABLE individuals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  reason TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create businesses table
CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_name TEXT,
  team_size TEXT,
  country TEXT,
  website TEXT,
  reason TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```
