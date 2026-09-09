-- Rekar Group CMS — Initial Supabase Schema
-- Migration: 001_initial_schema.sql

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'editor');

CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived', 'scheduled');

CREATE TYPE public.homepage_section_type AS ENUM (
  'hero',
  'project_marquee',
  'services',
  'featured_projects',
  'stats',
  'process',
  'clients',
  'posts',
  'testimonials',
  'cta',
  'custom_content'
);

CREATE TYPE public.page_block_type AS ENUM (
  'heading',
  'text',
  'rich_text',
  'image',
  'image_text',
  'gallery',
  'button',
  'cta',
  'faq',
  'stats',
  'features',
  'video',
  'spacer',
  'custom_html'
);

CREATE TYPE public.navigation_item_type AS ENUM ('link', 'page', 'external');

-- ---------------------------------------------------------------------------
-- Utility functions
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    'editor'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.profiles
  WHERE id = auth.uid()
    AND is_active = TRUE;
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role() IN ('editor', 'admin', 'super_admin');
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_above()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role() IN ('admin', 'super_admin');
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_role() = 'super_admin';
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- Profiles (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role public.user_role NOT NULL DEFAULT 'editor',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX profiles_role_idx ON public.profiles (role);
CREATE INDEX profiles_is_active_idx ON public.profiles (is_active);

-- Site settings (singleton row expected)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL DEFAULT '',
  company_name_en TEXT NOT NULL DEFAULT '',
  tagline TEXT,
  logo_url TEXT,
  logo_mark_url TEXT,
  favicon_url TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  whatsapp TEXT,
  website_url TEXT,
  default_seo_title TEXT,
  default_seo_description TEXT,
  og_image_url TEXT,
  google_maps_url TEXT,
  footer_description TEXT,
  copyright_text TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Theme settings (singleton row expected)
CREATE TABLE public.theme_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_color TEXT NOT NULL DEFAULT '#7B00C8',
  secondary_color TEXT NOT NULL DEFAULT '#190026',
  accent_color TEXT NOT NULL DEFAULT '#9A24F0',
  background_color TEXT NOT NULL DEFAULT '#100018',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Navigation
CREATE TABLE public.navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  type public.navigation_item_type NOT NULL DEFAULT 'link',
  parent_id UUID REFERENCES public.navigation_items (id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  open_in_new_tab BOOLEAN NOT NULL DEFAULT FALSE,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX navigation_items_parent_id_idx ON public.navigation_items (parent_id);
CREATE INDEX navigation_items_sort_order_idx ON public.navigation_items (sort_order);
CREATE INDEX navigation_items_visible_idx ON public.navigation_items (visible);

-- Social links
CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX social_links_enabled_idx ON public.social_links (enabled);
CREATE INDEX social_links_sort_order_idx ON public.social_links (sort_order);

-- Homepage sections
CREATE TABLE public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.homepage_section_type NOT NULL,
  name TEXT NOT NULL,
  heading TEXT,
  subtitle TEXT,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  settings JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX homepage_sections_type_idx ON public.homepage_sections (type);
CREATE INDEX homepage_sections_enabled_idx ON public.homepage_sections (enabled);
CREATE INDEX homepage_sections_sort_order_idx ON public.homepage_sections (sort_order);

-- Hero settings (singleton row expected)
CREATE TABLE public.hero_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge TEXT,
  heading TEXT NOT NULL DEFAULT '',
  highlighted_heading TEXT,
  description TEXT,
  primary_button_label TEXT,
  primary_button_url TEXT,
  secondary_button_label TEXT,
  secondary_button_url TEXT,
  visual_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  stats_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stats
CREATE TABLE public.stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  show_in_hero BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX stats_visible_idx ON public.stats (visible);
CREATE INDEX stats_sort_order_idx ON public.stats (sort_order);

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  icon TEXT,
  cover_image TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'draft',
  seo_title TEXT,
  seo_description TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX services_slug_unique_idx ON public.services (slug) WHERE deleted_at IS NULL;
CREATE INDEX services_status_idx ON public.services (status);
CREATE INDEX services_deleted_at_idx ON public.services (deleted_at);
CREATE INDEX services_sort_order_idx ON public.services (sort_order);

-- Project categories
CREATE TABLE public.project_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX project_categories_sort_order_idx ON public.project_categories (sort_order);

-- Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  category_id UUID REFERENCES public.project_categories (id) ON DELETE SET NULL,
  short_description TEXT,
  full_description TEXT,
  icon TEXT,
  cover_image TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  show_in_marquee BOOLEAN NOT NULL DEFAULT FALSE,
  status public.content_status NOT NULL DEFAULT 'draft',
  client_name TEXT,
  completion_date DATE,
  website_url TEXT,
  play_store_url TEXT,
  app_store_url TEXT,
  github_url TEXT,
  challenge TEXT,
  solution TEXT,
  result TEXT,
  case_study TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  platforms TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX projects_slug_unique_idx ON public.projects (slug) WHERE deleted_at IS NULL;
CREATE INDEX projects_status_idx ON public.projects (status);
CREATE INDEX projects_deleted_at_idx ON public.projects (deleted_at);
CREATE INDEX projects_category_id_idx ON public.projects (category_id);
CREATE INDEX projects_featured_idx ON public.projects (featured);
CREATE INDEX projects_show_in_marquee_idx ON public.projects (show_in_marquee);
CREATE INDEX projects_sort_order_idx ON public.projects (sort_order);

-- Technologies
CREATE TABLE public.technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- Project technologies (junction)
CREATE TABLE public.project_technologies (
  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  technology_id UUID NOT NULL REFERENCES public.technologies (id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, technology_id)
);

CREATE INDEX project_technologies_technology_id_idx ON public.project_technologies (technology_id);

-- Project images
CREATE TABLE public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX project_images_project_id_idx ON public.project_images (project_id);
CREATE INDEX project_images_sort_order_idx ON public.project_images (sort_order);

-- Post categories
CREATE TABLE public.post_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- Posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category_id UUID REFERENCES public.post_categories (id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  status public.content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX posts_slug_unique_idx ON public.posts (slug) WHERE deleted_at IS NULL;
CREATE INDEX posts_status_idx ON public.posts (status);
CREATE INDEX posts_deleted_at_idx ON public.posts (deleted_at);
CREATE INDEX posts_category_id_idx ON public.posts (category_id);
CREATE INDEX posts_author_id_idx ON public.posts (author_id);
CREATE INDEX posts_featured_idx ON public.posts (featured);
CREATE INDEX posts_published_at_idx ON public.posts (published_at);

-- Full-text search index for posts
CREATE INDEX posts_search_idx ON public.posts
  USING gin (
    to_tsvector(
      'simple',
      COALESCE(title, '') || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, '')
    )
  );

-- Tags
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

-- Post tags (junction)
CREATE TABLE public.post_tags (
  post_id UUID NOT NULL REFERENCES public.posts (id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags (id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX post_tags_tag_id_idx ON public.post_tags (tag_id);

-- Pages
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  status public.content_status NOT NULL DEFAULT 'draft',
  seo_title TEXT,
  seo_description TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX pages_slug_unique_idx ON public.pages (slug) WHERE deleted_at IS NULL;
CREATE INDEX pages_status_idx ON public.pages (status);
CREATE INDEX pages_deleted_at_idx ON public.pages (deleted_at);

-- Full-text search index for pages
CREATE INDEX pages_search_idx ON public.pages
  USING gin (to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(seo_description, '')));

-- Page blocks
CREATE TABLE public.page_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.pages (id) ON DELETE CASCADE,
  type public.page_block_type NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::JSONB,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX page_blocks_page_id_idx ON public.page_blocks (page_id);
CREATE INDEX page_blocks_sort_order_idx ON public.page_blocks (sort_order);

-- Clients
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT,
  website TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX clients_visible_idx ON public.clients (visible);
CREATE INDEX clients_sort_order_idx ON public.clients (sort_order);

-- Testimonials
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  job_title TEXT,
  company TEXT,
  avatar TEXT,
  testimonial TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX testimonials_visible_idx ON public.testimonials (visible);
CREATE INDEX testimonials_featured_idx ON public.testimonials (featured);
CREATE INDEX testimonials_sort_order_idx ON public.testimonials (sort_order);

-- Process steps
CREATE TABLE public.process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX process_steps_visible_idx ON public.process_steps (visible);
CREATE INDEX process_steps_sort_order_idx ON public.process_steps (sort_order);

-- Contact messages
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  company TEXT,
  project_type TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  is_important BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX contact_messages_is_read_idx ON public.contact_messages (is_read);
CREATE INDEX contact_messages_is_archived_idx ON public.contact_messages (is_archived);
CREATE INDEX contact_messages_created_at_idx ON public.contact_messages (created_at DESC);

-- Media library
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  size BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  alt_text TEXT,
  uploaded_by UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX media_uploaded_by_idx ON public.media (uploaded_by);
CREATE INDEX media_created_at_idx ON public.media (created_at DESC);

-- Audit logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  user_name TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  entity_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX audit_logs_user_id_idx ON public.audit_logs (user_id);
CREATE INDEX audit_logs_entity_idx ON public.audit_logs (entity);
CREATE INDEX audit_logs_created_at_idx ON public.audit_logs (created_at DESC);

-- Full-text search index for projects
CREATE INDEX projects_search_idx ON public.projects
  USING gin (
    to_tsvector(
      'simple',
      COALESCE(name, '') || ' ' || COALESCE(short_description, '') || ' ' || COALESCE(full_description, '')
    )
  );

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_theme_settings_updated_at
  BEFORE UPDATE ON public.theme_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_navigation_items_updated_at
  BEFORE UPDATE ON public.navigation_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_homepage_sections_updated_at
  BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_hero_settings_updated_at
  BEFORE UPDATE ON public.hero_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auth trigger: auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Public profiles are not readable"
  ON public.profiles FOR SELECT
  TO anon
  USING (FALSE);

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Staff can read all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Users can update own profile (non-role fields enforced in app)"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Super admins manage profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Site & theme settings (public read, admin write)
CREATE POLICY "Public read site_settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins manage site_settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin_or_above())
  WITH CHECK (public.is_admin_or_above());

CREATE POLICY "Public read theme_settings"
  ON public.theme_settings FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins manage theme_settings"
  ON public.theme_settings FOR ALL
  TO authenticated
  USING (public.is_admin_or_above())
  WITH CHECK (public.is_admin_or_above());

-- Navigation (public read visible, staff manage)
CREATE POLICY "Public read visible navigation_items"
  ON public.navigation_items FOR SELECT
  TO anon, authenticated
  USING (visible = TRUE);

CREATE POLICY "Staff manage navigation_items"
  ON public.navigation_items FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Social links (public read enabled, staff manage)
CREATE POLICY "Public read enabled social_links"
  ON public.social_links FOR SELECT
  TO anon, authenticated
  USING (enabled = TRUE);

CREATE POLICY "Staff manage social_links"
  ON public.social_links FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Homepage sections (public read enabled, staff manage)
CREATE POLICY "Public read enabled homepage_sections"
  ON public.homepage_sections FOR SELECT
  TO anon, authenticated
  USING (enabled = TRUE);

CREATE POLICY "Staff manage homepage_sections"
  ON public.homepage_sections FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Hero settings (public read, staff manage)
CREATE POLICY "Public read hero_settings"
  ON public.hero_settings FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Staff manage hero_settings"
  ON public.hero_settings FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Stats (public read visible, staff manage)
CREATE POLICY "Public read visible stats"
  ON public.stats FOR SELECT
  TO anon, authenticated
  USING (visible = TRUE);

CREATE POLICY "Staff manage stats"
  ON public.stats FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Services (public read published & not deleted, staff manage all)
CREATE POLICY "Public read published services"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Staff manage services"
  ON public.services FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Project categories (public read, staff manage)
CREATE POLICY "Public read project_categories"
  ON public.project_categories FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Staff manage project_categories"
  ON public.project_categories FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Projects (public read published & not deleted, staff manage all)
CREATE POLICY "Public read published projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Staff manage projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Technologies (public read, staff manage)
CREATE POLICY "Public read technologies"
  ON public.technologies FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Staff manage technologies"
  ON public.technologies FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Project technologies (public read for published projects, staff manage)
CREATE POLICY "Public read project_technologies for published projects"
  ON public.project_technologies FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id
        AND p.status = 'published'
        AND p.deleted_at IS NULL
    )
  );

CREATE POLICY "Staff manage project_technologies"
  ON public.project_technologies FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Project images (public read for published projects, staff manage)
CREATE POLICY "Public read project_images for published projects"
  ON public.project_images FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id
        AND p.status = 'published'
        AND p.deleted_at IS NULL
    )
  );

CREATE POLICY "Staff manage project_images"
  ON public.project_images FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Post categories (public read, staff manage)
CREATE POLICY "Public read post_categories"
  ON public.post_categories FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Staff manage post_categories"
  ON public.post_categories FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Posts (public read published & not deleted, staff manage all)
CREATE POLICY "Public read published posts"
  ON public.posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Staff manage posts"
  ON public.posts FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Tags (public read, staff manage)
CREATE POLICY "Public read tags"
  ON public.tags FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Staff manage tags"
  ON public.tags FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Post tags (public read for published posts, staff manage)
CREATE POLICY "Public read post_tags for published posts"
  ON public.post_tags FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.posts po
      WHERE po.id = post_id
        AND po.status = 'published'
        AND po.deleted_at IS NULL
    )
  );

CREATE POLICY "Staff manage post_tags"
  ON public.post_tags FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Pages (public read published & not deleted, staff manage all)
CREATE POLICY "Public read published pages"
  ON public.pages FOR SELECT
  TO anon, authenticated
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Staff manage pages"
  ON public.pages FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Page blocks (public read for published pages, staff manage)
CREATE POLICY "Public read page_blocks for published pages"
  ON public.page_blocks FOR SELECT
  TO anon, authenticated
  USING (
    visible = TRUE
    AND EXISTS (
      SELECT 1 FROM public.pages pg
      WHERE pg.id = page_id
        AND pg.status = 'published'
        AND pg.deleted_at IS NULL
    )
  );

CREATE POLICY "Staff manage page_blocks"
  ON public.page_blocks FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Clients (public read visible, staff manage)
CREATE POLICY "Public read visible clients"
  ON public.clients FOR SELECT
  TO anon, authenticated
  USING (visible = TRUE);

CREATE POLICY "Staff manage clients"
  ON public.clients FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Testimonials (public read visible, staff manage)
CREATE POLICY "Public read visible testimonials"
  ON public.testimonials FOR SELECT
  TO anon, authenticated
  USING (visible = TRUE);

CREATE POLICY "Staff manage testimonials"
  ON public.testimonials FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Process steps (public read visible, staff manage)
CREATE POLICY "Public read visible process_steps"
  ON public.process_steps FOR SELECT
  TO anon, authenticated
  USING (visible = TRUE);

CREATE POLICY "Staff manage process_steps"
  ON public.process_steps FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Contact messages (public insert, staff read/manage)
CREATE POLICY "Public insert contact_messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

CREATE POLICY "Staff read contact_messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Staff update contact_messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Admins delete contact_messages"
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (public.is_admin_or_above());

-- Media (staff only)
CREATE POLICY "Staff read media"
  ON public.media FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Staff insert media"
  ON public.media FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "Staff update media"
  ON public.media FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Staff delete media"
  ON public.media FOR DELETE
  TO authenticated
  USING (public.is_staff());

-- Audit logs (staff read, staff insert via app)
CREATE POLICY "Staff read audit_logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "Staff insert audit_logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

-- ---------------------------------------------------------------------------
-- Storage bucket: media
-- Public read, authenticated write (staff enforced at app layer + RLS on media table)
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  TRUE,
  10485760, -- 10 MB
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS policies for the 'media' bucket
-- Anyone can read files (bucket is public)
CREATE POLICY "Public read media bucket"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media');

-- Authenticated staff can upload to media bucket
CREATE POLICY "Staff upload media bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'media'
    AND public.is_staff()
  );

-- Authenticated staff can update their uploads
CREATE POLICY "Staff update media bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_staff())
  WITH CHECK (bucket_id = 'media' AND public.is_staff());

-- Authenticated staff can delete from media bucket
CREATE POLICY "Staff delete media bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_staff());

-- ---------------------------------------------------------------------------
-- Media storage policy notes (for application developers)
-- ---------------------------------------------------------------------------
-- 1. Upload path convention: media/{uuid}/{filename}
-- 2. After storage upload, insert a row into public.media with the public URL
-- 3. Use Supabase Storage getPublicUrl() for public bucket URLs
-- 4. Service role key bypasses RLS — use only in trusted server-side code
-- 5. Validate file type and size client-side AND rely on bucket allowed_mime_types
-- 6. Only editor/admin/super_admin roles (is_staff) may upload via storage policies
