-- ============================================================================
-- AEA Backend - Supabase Table Setup
-- Run this in the Supabase SQL Editor dashboard
-- ============================================================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── TABLES ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  facebook TEXT,
  instagram TEXT,
  twitter TEXT,
  linkedin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT UNIQUE NOT NULL,
  sections JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN (
    'International Livestock Production',
    'Domestic Livestock Production',
    'Natural Resources Development',
    'Rural Development'
  )),
  location TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TRIGGERS ───────────────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS set_updated_at_admins ON admins;
CREATE TRIGGER set_updated_at_admins
  BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_settings ON settings;
CREATE TRIGGER set_updated_at_settings
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_page_contents ON page_contents;
CREATE TRIGGER set_updated_at_page_contents
  BEFORE UPDATE ON page_contents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_staff_members ON staff_members;
CREATE TRIGGER set_updated_at_staff_members
  BEFORE UPDATE ON staff_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_projects ON projects;
CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_contact_submissions ON contact_submissions;
CREATE TRIGGER set_updated_at_contact_submissions
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── ROW LEVEL SECURITY ────────────────────────────────────────────────────────

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_admins" ON admins;
CREATE POLICY "service_role_all_admins" ON admins
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_settings" ON settings;
CREATE POLICY "service_role_all_settings" ON settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_page_contents" ON page_contents;
CREATE POLICY "service_role_all_page_contents" ON page_contents
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_staff_members" ON staff_members;
CREATE POLICY "service_role_all_staff_members" ON staff_members
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_projects" ON projects;
CREATE POLICY "service_role_all_projects" ON projects
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_contact_submissions" ON contact_submissions;
CREATE POLICY "service_role_all_contact_submissions" ON contact_submissions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ─── INDEXES ────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_page_contents_page_name ON page_contents(page_name);
CREATE INDEX IF NOT EXISTS idx_staff_members_display_order ON staff_members(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_category_display_order ON projects(category, display_order);
