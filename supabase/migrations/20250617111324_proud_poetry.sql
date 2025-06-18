/*
  # Fix user signup by creating profile trigger

  1. Database Functions
    - `handle_new_user()` - Creates a profile entry when a new user signs up
  
  2. Triggers
    - `on_auth_user_created` - Automatically executes after user creation in auth.users
  
  3. Security
    - Function runs with SECURITY DEFINER to ensure proper permissions
  
  This migration resolves the "Database error saving new user" issue by ensuring
  that every new user signup automatically creates an associated profile entry.
*/

-- Create the trigger function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger that fires after a new user is inserted into auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();