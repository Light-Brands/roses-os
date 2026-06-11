-- Migration 0004: atomic reorder_blocks RPC.
--
-- Authority: spec 001-richer-block-editor T-044 + AC13.
--
-- Wraps the per-row position updates in a single transaction at SERIALIZABLE
-- isolation level so two concurrent reorders cannot produce a partial state.
-- Postgres rolls back the loser on conflict; the client retries.

CREATE OR REPLACE FUNCTION public.reorder_blocks_atomic(
  items_arg jsonb,
  updated_by_arg text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  item jsonb;
BEGIN
  -- items_arg is expected to be an array of { id: uuid, position: int }.
  FOR item IN SELECT * FROM jsonb_array_elements(items_arg) LOOP
    UPDATE public.manual_blocks
    SET position = (item->>'position')::int,
        updated_by = updated_by_arg
    WHERE id = (item->>'id')::uuid;
  END LOOP;
END;
$$;

-- Permit the RPC to be called from the anon/authenticated roles via the
-- existing RLS policies on manual_blocks.
GRANT EXECUTE ON FUNCTION public.reorder_blocks_atomic(jsonb, text) TO anon, authenticated;
