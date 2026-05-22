-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  created_at timestamptz default now()
);

-- Mistakes log: questions the user got wrong
create table public.mistakes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  question_text text not null,
  user_answer text,
  correct_answer text,
  section text not null,          -- 'Quantitative' | 'Verbal' | 'Data Insights'
  type text not null,             -- question type
  concept text not null,          -- micro-concept
  mistake_category text,          -- 'Knowledge Gap' | 'Misread' | etc.
  claude_analysis text,           -- AI analysis text
  drill_focus text,               -- what drills should target
  created_at timestamptz default now()
);

-- Drill attempts: every question the user has answered
create table public.drill_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  question jsonb not null,        -- full Question object snapshot
  user_answer text not null,
  correct_answer text not null,
  is_correct boolean not null,
  time_spent_seconds integer,
  section text not null,
  concept text not null,
  mistake_id uuid references public.mistakes(id) on delete set null,
  created_at timestamptz default now()
);

-- Spaced repetition queue
create table public.drill_queue (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  mistake_id uuid references public.mistakes(id) on delete cascade not null,
  section text not null,
  concept text not null,
  next_due_at timestamptz default now(),
  interval_days integer default 1,
  ease_factor real default 2.5,   -- SM-2 algorithm ease factor
  repetitions integer default 0,
  created_at timestamptz default now()
);

-- Row level security
alter table public.profiles enable row level security;
alter table public.mistakes enable row level security;
alter table public.drill_attempts enable row level security;
alter table public.drill_queue enable row level security;

create policy "Users can manage own profile"
  on public.profiles for all using (auth.uid() = id);

create policy "Users can manage own mistakes"
  on public.mistakes for all using (auth.uid() = user_id);

create policy "Users can manage own drill attempts"
  on public.drill_attempts for all using (auth.uid() = user_id);

create policy "Users can manage own drill queue"
  on public.drill_queue for all using (auth.uid() = user_id);

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
