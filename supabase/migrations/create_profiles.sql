create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text not null unique,
    owned_colors jsonb not null default '[]'::jsonb,
    equipped_color text not null default 'gray',
    created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
