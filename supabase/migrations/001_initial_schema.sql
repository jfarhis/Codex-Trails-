-- HAUL core schema. Run in Supabase SQL Editor or via `supabase db push`.
create extension if not exists vector;
create extension if not exists pgcrypto;

create type product_source as enum ('native','affiliate','shopify_import');
create type integration_type as enum ('native','shopify','affiliate','none');
create type swipe_action as enum ('left','right','save','bag');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  style_preferences jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create table public.brands (
  id uuid primary key default gen_random_uuid(), name text not null,
  integration_type integration_type not null default 'none', logo_url text,
  shopify_domain text, created_at timestamptz not null default now()
);
create table public.products (
  id uuid primary key default gen_random_uuid(), brand_id uuid references public.brands(id),
  title text not null, description text, price_cents integer not null check(price_cents >= 0),
  currency text not null default 'USD', images text[] not null default '{}', category text,
  source product_source not null, external_url text, external_id text, inventory jsonb default '{}',
  is_active boolean not null default true, created_at timestamptz not null default now()
);
create table public.posts (
  id uuid primary key default gen_random_uuid(), author_id uuid not null references public.users(id) on delete cascade,
  caption text, media_url text not null, media_type text not null default 'image', tagged_product_ids uuid[] default '{}',
  created_at timestamptz not null default now()
);
create table public.likes (
  user_id uuid not null references public.users(id) on delete cascade,
  target_type text not null check(target_type in ('post','product')), target_id uuid not null,
  created_at timestamptz not null default now(), primary key(user_id,target_type,target_id)
);
create table public.follows (
  follower_id uuid references public.users(id) on delete cascade,
  following_id uuid references public.users(id) on delete cascade,
  created_at timestamptz not null default now(), primary key(follower_id,following_id),
  check(follower_id <> following_id)
);
create table public.swipes (
  id bigint generated always as identity primary key, user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade, action swipe_action not null,
  created_at timestamptz not null default now()
);
create table public.style_dna (
  user_id uuid primary key references public.users(id) on delete cascade,
  embedding vector(1536), summary jsonb not null default '{}', updated_at timestamptz not null default now()
);
create table public.bag_items (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade, quantity integer not null default 1 check(quantity > 0),
  selected_variant jsonb default '{}', created_at timestamptz not null default now(), unique(user_id,product_id,selected_variant)
);
create table public.orders (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id),
  stripe_session_id text unique, status text not null default 'pending', total_cents integer not null,
  created_at timestamptz not null default now()
);
create table public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id), title_snapshot text not null, price_cents integer not null, quantity integer not null
);
create table public.dms (
  id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now()
);
create table public.dm_members (
  dm_id uuid references public.dms(id) on delete cascade, user_id uuid references public.users(id) on delete cascade,
  primary key(dm_id,user_id)
);
create table public.dm_messages (
  id uuid primary key default gen_random_uuid(), dm_id uuid not null references public.dms(id) on delete cascade,
  sender_id uuid not null references public.users(id), body text, product_id uuid references public.products(id),
  created_at timestamptz not null default now(), check(body is not null or product_id is not null)
);
create table public.catalog_imports (
  id uuid primary key default gen_random_uuid(), brand_id uuid references public.brands(id),
  source product_source not null, status text not null default 'queued', cursor jsonb default '{}',
  error text, started_at timestamptz, completed_at timestamptz, created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.follows enable row level security;
alter table public.swipes enable row level security;
alter table public.style_dna enable row level security;
alter table public.bag_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.dms enable row level security;
alter table public.dm_members enable row level security;
alter table public.dm_messages enable row level security;
alter table public.catalog_imports enable row level security;

create policy "public profiles are readable" on public.users for select using(true);
create policy "users update own profile" on public.users for update using(auth.uid()=id);
create policy "brands are readable" on public.brands for select using(true);
create policy "active products are readable" on public.products for select using(is_active);
create policy "posts are readable" on public.posts for select using(true);
create policy "users create own posts" on public.posts for insert with check(auth.uid()=author_id);
create policy "authors manage posts" on public.posts for all using(auth.uid()=author_id);
create policy "users manage own likes" on public.likes for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "follows readable" on public.follows for select using(true);
create policy "users manage own follows" on public.follows for all using(auth.uid()=follower_id) with check(auth.uid()=follower_id);
create policy "users manage own swipes" on public.swipes for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "users manage own dna" on public.style_dna for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "users manage own bag" on public.bag_items for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "users read own orders" on public.orders for select using(auth.uid()=user_id);
create policy "users read own order items" on public.order_items for select using(exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid()));
create policy "members read dm membership" on public.dm_members for select using(user_id=auth.uid());
create policy "members read dms" on public.dms for select using(exists(select 1 from public.dm_members m where m.dm_id=id and m.user_id=auth.uid()));
create policy "members read messages" on public.dm_messages for select using(exists(select 1 from public.dm_members m where m.dm_id=dm_id and m.user_id=auth.uid()));
create policy "members send messages" on public.dm_messages for insert with check(sender_id=auth.uid() and exists(select 1 from public.dm_members m where m.dm_id=dm_id and m.user_id=auth.uid()));

create index swipes_user_created_idx on public.swipes(user_id,created_at desc);
create index posts_created_idx on public.posts(created_at desc);
create index style_dna_vector_idx on public.style_dna using ivfflat(embedding vector_cosine_ops) with (lists=100);
