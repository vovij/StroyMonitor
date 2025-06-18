/*
  # Clean Database Setup

  1. New Tables
    - `profiles` (simplified without roles)
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `budget` (numeric)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `cost_categories`
      - `id` (text, primary key)
      - `name` (text)
      - `icon` (text)
      - `color` (text)
      - `created_at` (timestamp)
    - `cost_entries`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `category_id` (text, references cost_categories)
      - `amount` (numeric)
      - `description` (text)
      - `created_by` (uuid, references profiles)
      - `date` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Simple policies for authenticated users (no role restrictions)
    - Users can manage their own profiles
    - All authenticated users can manage projects and cost entries

  3. Functions and Triggers
    - Auto-create profile on user registration
    - Auto-update updated_at timestamps
    - Insert default cost categories
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing policies if they exist
DO $$
BEGIN
  -- Drop policies for profiles
  DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
  
  -- Drop policies for projects
  DROP POLICY IF EXISTS "Authenticated users can read projects" ON projects;
  DROP POLICY IF EXISTS "Authenticated users can create projects" ON projects;
  DROP POLICY IF EXISTS "Authenticated users can update projects" ON projects;
  DROP POLICY IF EXISTS "Authenticated users can delete projects" ON projects;
  DROP POLICY IF EXISTS "Admins and managers can create projects" ON projects;
  DROP POLICY IF EXISTS "Admins and managers can update projects" ON projects;
  DROP POLICY IF EXISTS "Only admins can delete projects" ON projects;
  
  -- Drop policies for cost_categories
  DROP POLICY IF EXISTS "Authenticated users can read cost categories" ON cost_categories;
  
  -- Drop policies for cost_entries
  DROP POLICY IF EXISTS "Authenticated users can read cost entries" ON cost_entries;
  DROP POLICY IF EXISTS "Authenticated users can create cost entries" ON cost_entries;
  DROP POLICY IF EXISTS "Authenticated users can update cost entries" ON cost_entries;
  DROP POLICY IF EXISTS "Authenticated users can delete cost entries" ON cost_entries;
  DROP POLICY IF EXISTS "Admins and managers can delete cost entries" ON cost_entries;
  DROP POLICY IF EXISTS "Admins, managers, and accountants can create cost entries" ON cost_entries;
  DROP POLICY IF EXISTS "Admins, managers, and accountants can update cost entries" ON cost_entries;
EXCEPTION
  WHEN undefined_table THEN
    NULL; -- Table doesn't exist yet, continue
END $$;

-- Create profiles table (simplified - no roles)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  budget numeric DEFAULT 0,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cost categories table
CREATE TABLE IF NOT EXISTS cost_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create cost entries table
CREATE TABLE IF NOT EXISTS cost_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  category_id text REFERENCES cost_categories(id) ON DELETE RESTRICT,
  amount numeric DEFAULT 0,
  description text NOT NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_entries ENABLE ROW LEVEL SECURITY;

-- Simple policies for authenticated users (no role restrictions)
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- All authenticated users can manage projects
CREATE POLICY "Authenticated users can read projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (true);

-- All authenticated users can read cost categories
CREATE POLICY "Authenticated users can read cost categories"
  ON cost_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- All authenticated users can manage cost entries
CREATE POLICY "Authenticated users can read cost entries"
  ON cost_entries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create cost entries"
  ON cost_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update cost entries"
  ON cost_entries
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete cost entries"
  ON cost_entries
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default cost categories
INSERT INTO cost_categories (id, name, icon, color) VALUES
  ('materials', 'Материалы', 'Package', 'bg-blue-500'),
  ('labor', 'Рабочая сила', 'Users', 'bg-green-500'),
  ('equipment', 'Оборудование', 'Wrench', 'bg-orange-500'),
  ('transport', 'Транспорт', 'Truck', 'bg-purple-500'),
  ('permits', 'Разрешения', 'FileText', 'bg-red-500'),
  ('utilities', 'Коммунальные услуги', 'Zap', 'bg-yellow-500'),
  ('other', 'Прочее', 'MoreHorizontal', 'bg-gray-500')
ON CONFLICT (id) DO NOTHING;