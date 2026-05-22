create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'free',
  updated_at timestamptz default now()
);
