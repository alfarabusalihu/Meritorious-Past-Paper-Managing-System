-- MPPMS Database Seed Script
-- Includes: Profiles (RBAC), Papers, and Notifications

-- 1. Enable pgcrypto for password hashing if needed (Supabase usually has it)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('admin', 'staff')) DEFAULT 'staff',
  is_blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Papers Table
CREATE TABLE IF NOT EXISTS public.papers (
  paper_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL,
  part TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'English',
  pdf_url TEXT NOT NULL,
  added_by TEXT NOT NULL,
  added_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Papers are viewable by everyone" ON public.papers FOR SELECT USING (true);
CREATE POLICY "Staff can modify papers" ON public.papers FOR ALL USING (auth.role() = 'authenticated');

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  target_id UUID,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  read BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notifications viewable by everyone" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- 5. Trigger for auto-profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'staff'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Initial Admin Seeding (Optional - Manual instruction provided in SETUP.md)
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role) 
-- VALUES ('YOUR_UUID', 'admin@example.com', crypt('AdminPassword123', gen_salt('bf')), now(), 'authenticated');
-- INSERT INTO public.profiles (id, email, name, role) 
-- VALUES ('YOUR_UUID', 'admin@example.com', 'Admin', 'admin');
