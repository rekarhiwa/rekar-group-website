-- Projects CMS enhancements
ALTER TABLE public.project_categories
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS subtitle TEXT,
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT,
  ADD COLUMN IF NOT EXISTS og_image TEXT;

ALTER TABLE public.project_images
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Prefer Kurdish category labels (editable in admin)
UPDATE public.project_categories SET name = 'ئەپەکان', description = 'Apps' WHERE slug = 'apps';
UPDATE public.project_categories SET name = 'وێبسایتەکان', description = 'Websites' WHERE slug = 'websites';
UPDATE public.project_categories SET name = 'سیستەمەکان', description = 'Systems' WHERE slug = 'systems';

CREATE TABLE IF NOT EXISTS public.project_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS project_features_project_id_idx ON public.project_features (project_id);
CREATE INDEX IF NOT EXISTS project_features_sort_order_idx ON public.project_features (sort_order);

ALTER TABLE public.project_features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read project_features for published projects" ON public.project_features;
CREATE POLICY "Public read project_features for published projects"
  ON public.project_features FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id
        AND p.status = 'published'
        AND p.deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "Staff manage project_features" ON public.project_features;
CREATE POLICY "Staff manage project_features"
  ON public.project_features FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Storage bucket for project media
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-media', 'project-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read project-media" ON storage.objects;
CREATE POLICY "Public read project-media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'project-media');

DROP POLICY IF EXISTS "Staff upload project-media" ON storage.objects;
CREATE POLICY "Staff upload project-media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-media' AND public.is_staff());

DROP POLICY IF EXISTS "Staff update project-media" ON storage.objects;
CREATE POLICY "Staff update project-media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-media' AND public.is_staff());

DROP POLICY IF EXISTS "Staff delete project-media" ON storage.objects;
CREATE POLICY "Staff delete project-media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-media' AND public.is_staff());
