// creating db schema

-- creators table
create table creators (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  username text unique not null,
  display_name text not null,
  bio text default 'Buy me a chai! ☕',
  avatar_url text,
  total_earnings integer default 0,
  supporter_count integer default 0,
  created_at timestamp default now()
);

-- supports table
create table supports (
  id uuid primary key default gen_random_uuid(),
  supporter_name text not null,
  message text,
  amount integer not null,
  creator_id uuid references creators(id),
  payment_id text unique,
  status text default 'completed',
  created_at timestamp default now()
);

-- Enable RLS
alter table creators enable row level security;
alter table supports enable row level security;

-- RLS Policies
create policy "Public creators are viewable by everyone" on creators for select using (true);
create policy "Users can update own creator profile" on creators for update using (auth.uid()::text = clerk_user_id);
create policy "Public supports are viewable by everyone" on supports for select using (true);
create policy "Anyone can insert supports" on supports for insert with check (true);