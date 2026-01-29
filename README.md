# VOAI Waitlist Application (Supabase Version)

A professional, Vercel-friendly waitlist application for VOAI built with Express.js and Supabase.

## Features
- **Black & White Theme**: Sleek, modern design.
- **Theme Switcher**: Toggle between light and dark modes.
- **Dual Waitlist Forms**: Dedicated forms for Individual and Business users.
- **Supabase Integration**: Permanent data storage using Supabase/PostgreSQL.
- **Vercel Ready**: Pre-configured with `vercel.json` for instant deployment.

## Database Setup (Supabase)

1. Create a new project in [Supabase](https://supabase.com/).
2. Go to the **SQL Editor** and run the following commands to create the tables:

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

## Environment Variables

Create a `.env` file in the root directory (or set these in Vercel):

- `SUPABASE_URL`: Your Supabase project URL.
- `SUPABASE_ANON_KEY`: Your Supabase anonymous API key.
- `ADMIN_PASSWORD`: Password for the admin dashboard (default: `voai-admin-2026`).

## How to Run Locally
1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Open `http://localhost:3000` in your browser.

## Deployment to Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project root.
3. Add your environment variables in the Vercel dashboard.
