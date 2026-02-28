-- Sticky Notes Tablosu
create table public.sticky_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  content text not null,
  color text default 'yellow',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Aktifleştirme
alter table public.sticky_notes enable row level security;

-- RLS Politikaları
create policy "Users can manage own sticky notes" on public.sticky_notes for all using (auth.uid() = user_id);
