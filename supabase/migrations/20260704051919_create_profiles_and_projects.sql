/*
# Create profiles and projects tables for AI Startup Builder

## Overview
Converts the app from localStorage mock data to Supabase-backed persistence.
Users authenticate via Supabase Auth (email/password). Each user has a profile
row (name, avatar, subscription tier, bio) and zero or more startup projects
created via the wizard.

## 1. New Tables

### profiles
- `id` (uuid, primary key) — references `auth.users.id`, one row per user
- `name` (text) — display name
- `avatar_url` (text) — profile image URL
- `role` (text, default 'user') — 'user' or 'admin'
- `subscription` (text, default 'free') — 'free', 'pro', or 'enterprise'
- `bio` (text) — user bio
- `created_at` (timestamptz, default now())

### projects
- `id` (uuid, primary key, default gen_random_uuid())
- `user_id` (uuid, not null, default auth.uid()) — owner, references auth.users
- `name` (text, not null) — startup name
- `industry` (text) — selected industry
- `status` (text, default 'draft') — 'draft' or 'published'
- `wizard_data` (jsonb) — full wizard form data
- `created_at` (timestamptz, default now())

## 2. Security (RLS)

### profiles
- Enable RLS.
- Users can read their own profile (SELECT, authenticated).
- Users can insert their own profile (INSERT, authenticated, WITH CHECK auth.uid() = id).
- Users can update their own profile (UPDATE, authenticated).
- No DELETE (profiles are managed via auth).

### projects
- Enable RLS.
- Users can CRUD only their own projects (owner-scoped via user_id = auth.uid()).
- user_id defaults to auth.uid() so inserts omitting user_id succeed.

## 3. Important Notes
- The `user_id` column on projects has `DEFAULT auth.uid()` so frontend
  inserts like `.insert({ name, industry, wizard_data })` work without
  explicitly passing user_id.
- Profiles are created client-side on first sign-up via the AuthContext.
- Email confirmation stays OFF (Supabase default for this project).
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'user',
  subscription text NOT NULL DEFAULT 'free',
  bio text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  industry text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  wizard_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_projects" ON projects;
CREATE POLICY "select_own_projects" ON projects
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_projects" ON projects;
CREATE POLICY "insert_own_projects" ON projects
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_projects" ON projects;
CREATE POLICY "update_own_projects" ON projects
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_projects" ON projects;
CREATE POLICY "delete_own_projects" ON projects
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Index for faster queries by user
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
