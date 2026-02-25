-- 1. Profiles Tablosu
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Categories Tablosu
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  color text not null,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Tasks Tablosu
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  category_id uuid references public.categories on delete set null,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  status text check (status in ('todo', 'in_progress', 'done', 'not_done')) default 'todo',
  image_url text,
  is_reminder_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS (Row Level Security) Aktifleştirme
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tasks enable row level security;

-- RLS Politikaları
-- Profiles: Herkes kendi profilini görebilir ve güncelleyebilir
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Categories: Herkes sadece kendi kategorilerini görebilir ve yönetebilir
create policy "Users can manage own categories" on public.categories for all using (auth.uid() = user_id);

-- Tasks: Herkes sadece kendi görevlerini görebilir ve yönetebilir
create policy "Users can manage own tasks" on public.tasks for all using (auth.uid() = user_id);

-- Auth.users tablosuna yeni kullanıcı eklendiğinde otomatik profile oluşturma tetikleyicisi
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
