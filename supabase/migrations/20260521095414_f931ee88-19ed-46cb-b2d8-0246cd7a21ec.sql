
CREATE TABLE public.card_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'waiting',
  state jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_card_rooms_code ON public.card_rooms(code);

ALTER TABLE public.card_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read rooms" ON public.card_rooms FOR SELECT USING (true);
CREATE POLICY "anyone can create rooms" ON public.card_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone can update rooms" ON public.card_rooms FOR UPDATE USING (true);
CREATE POLICY "anyone can delete rooms" ON public.card_rooms FOR DELETE USING (true);

ALTER TABLE public.card_rooms REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.card_rooms;

CREATE OR REPLACE FUNCTION public.touch_card_rooms_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_card_rooms_updated_at
BEFORE UPDATE ON public.card_rooms
FOR EACH ROW EXECUTE FUNCTION public.touch_card_rooms_updated_at();
