-- =============================================================================
-- COLLABORATIVE MANUAL EDITING SYSTEM — Database Schema
-- Run this in Supabase SQL Editor to set up manual editing tables
-- =============================================================================

-- =============================================================================
-- TABLES
-- =============================================================================

-- Manuals — the four teaching manuals
CREATE TABLE public.manuals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Manual Blocks — individual content blocks within a manual for a specific language
CREATE TABLE public.manual_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manual_id UUID NOT NULL REFERENCES public.manuals(id) ON DELETE CASCADE,
  language TEXT NOT NULL DEFAULT 'en',
  block_type TEXT NOT NULL CHECK (block_type IN ('heading', 'text', 'image', 'divider', 'page-break')),
  content JSONB NOT NULL DEFAULT '{}',
  position INTEGER NOT NULL DEFAULT 0,
  updated_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_manuals_slug ON public.manuals(slug);
CREATE INDEX idx_manual_blocks_manual_lang ON public.manual_blocks(manual_id, language);
CREATE INDEX idx_manual_blocks_position ON public.manual_blocks(manual_id, language, position);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Auto-update updated_at for manuals
CREATE TRIGGER update_manuals_updated_at
  BEFORE UPDATE ON public.manuals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update updated_at for manual_blocks
CREATE TRIGGER update_manual_blocks_updated_at
  BEFORE UPDATE ON public.manual_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.manuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_blocks ENABLE ROW LEVEL SECURITY;

-- Manuals are readable by anyone (PIN auth happens at app level)
CREATE POLICY "Manuals are publicly readable"
  ON public.manuals FOR SELECT
  USING (true);

-- Manual blocks are readable by anyone (PIN auth happens at app level)
CREATE POLICY "Manual blocks are publicly readable"
  ON public.manual_blocks FOR SELECT
  USING (true);

-- Allow inserts/updates/deletes via service role or anon key
-- (PIN-based auth is enforced at the API layer, not RLS)
CREATE POLICY "Manual blocks are writable"
  ON public.manual_blocks FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Manuals are writable"
  ON public.manuals FOR ALL
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- SEED DATA — The four starting manuals
-- =============================================================================

INSERT INTO public.manuals (slug, title, description, cover_image, sort_order) VALUES
  ('rose-meditation-level-1', 'Rose Meditation Level 1', 'The essential practices that form the foundation of all International Aura School work.', '/images/teaching/level-1/01-the-rose.jpeg', 1),
  ('rose-meditation-level-2', 'Rose Meditation Level 2', 'Advanced practices for subtle body awareness, emotional alchemy, and relational coherence.', '/images/teaching/level-2/01-physical-space.jpeg', 2),
  ('rose-meditation-level-3', 'Rose Meditation Level 3', 'Practices and principles for holding space, transmitting the work, and serving as a guardian of the lineage.', '/images/teaching/level-3/01-analyzer.jpeg', 3),
  ('aura-level-1', 'Aura Level 1', 'Introduction to aura reading and energetic perception.', '/images/teaching/level-1/05-aura-exercise.jpeg', 4)
ON CONFLICT (slug) DO NOTHING;

-- Seed PIN settings (editor: 1234, teacher: 5678)
INSERT INTO public.settings (key, value, description) VALUES
  ('manual_editor_pin', '"1234"', 'PIN code for manual editors (collaborators who can edit content)'),
  ('manual_teacher_pin', '"5678"', 'PIN code for teachers (read-only access to manuals)')
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- STORAGE — Manual images bucket
-- =============================================================================

-- Create manual-images bucket (run in Supabase dashboard if needed)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('manual-images', 'manual-images', true);

-- Storage policies for manual images
-- CREATE POLICY "Public manual image access"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'manual-images');

-- CREATE POLICY "Anyone can upload manual images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'manual-images');
