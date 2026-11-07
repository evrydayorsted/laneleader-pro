# LaneLeader Pro

Comprehensive swim coaching platform for prescribing workouts, managing swimmer rosters and invite codes, tracking splits, RPE exertion, and calendar training logs.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set up the backend (see below) and create a `.env.local` with your Supabase credentials.
3. Run the app:
   `npm run dev`

## Backend setup (Supabase)

The app uses [Supabase](https://supabase.com) (Postgres + Auth) for accounts and data, so coaches and swimmers can log in from any device.

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. In **Project Settings → Data API**, copy the **Project URL** and the **anon/public** key (not the `service_role` key).
3. Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` with those values.
4. In **Authentication → Sign In / Providers → Email**, turn **Confirm email** OFF, so new accounts can log in instantly after registering.
5. In the **SQL Editor**, paste and run the contents of `supabase/schema.sql` once to create the tables, security policies, and triggers.
6. For production (Netlify), set the same two `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` environment variables in the Netlify site's **Site configuration → Environment variables**, then trigger a new deploy.
