-- Advanced posts publishing: view analytics
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unique_view_count INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.post_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts (id) ON DELETE CASCADE,
  viewer_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS post_views_post_id_idx ON public.post_views (post_id);
CREATE INDEX IF NOT EXISTS post_views_created_at_idx ON public.post_views (created_at);
CREATE UNIQUE INDEX IF NOT EXISTS post_views_unique_daily_idx
  ON public.post_views (post_id, viewer_hash, (created_at::date))
  WHERE viewer_hash IS NOT NULL;

ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS post_views_public_insert ON public.post_views;
CREATE POLICY post_views_public_insert
  ON public.post_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS post_views_staff_select ON public.post_views;
CREATE POLICY post_views_staff_select
  ON public.post_views FOR SELECT
  TO authenticated
  USING (public.is_staff());

-- Increment views helper (security definer)
CREATE OR REPLACE FUNCTION public.increment_post_views(
  p_post_id UUID,
  p_viewer_hash TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted BOOLEAN := false;
BEGIN
  -- Only track published (or due scheduled) posts that are not deleted
  IF NOT EXISTS (
    SELECT 1 FROM public.posts
    WHERE id = p_post_id
      AND deleted_at IS NULL
      AND (
        status = 'published'
        OR (status = 'scheduled' AND published_at IS NOT NULL AND published_at <= NOW())
      )
  ) THEN
    RETURN;
  END IF;

  IF p_viewer_hash IS NOT NULL THEN
    BEGIN
      INSERT INTO public.post_views (post_id, viewer_hash, user_agent)
      VALUES (p_post_id, p_viewer_hash, p_user_agent);
      inserted := true;
    EXCEPTION WHEN unique_violation THEN
      inserted := false;
    END;
  ELSE
    INSERT INTO public.post_views (post_id, viewer_hash, user_agent)
    VALUES (p_post_id, NULL, p_user_agent);
    inserted := true;
  END IF;

  UPDATE public.posts
  SET
    view_count = view_count + 1,
    unique_view_count = unique_view_count + CASE WHEN inserted AND p_viewer_hash IS NOT NULL THEN 1 ELSE 0 END,
    updated_at = updated_at
  WHERE id = p_post_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_post_views(UUID, TEXT, TEXT) TO anon, authenticated;

-- Auto-publish due scheduled posts
CREATE OR REPLACE FUNCTION public.publish_due_scheduled_posts()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.posts
  SET status = 'published', updated_at = NOW()
  WHERE status = 'scheduled'
    AND deleted_at IS NULL
    AND published_at IS NOT NULL
    AND published_at <= NOW();

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.publish_due_scheduled_posts() TO anon, authenticated, service_role;

-- Public read: include due scheduled posts as if published
DROP POLICY IF EXISTS posts_public_select ON public.posts;
CREATE POLICY posts_public_select
  ON public.posts FOR SELECT
  TO anon, authenticated
  USING (
    deleted_at IS NULL
    AND (
      status = 'published'
      OR (status = 'scheduled' AND published_at IS NOT NULL AND published_at <= NOW())
    )
  );
