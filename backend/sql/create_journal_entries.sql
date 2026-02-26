create extension if not exists "pgcrypto";

create table if not exists public.journal_entries (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null default 'Untitled Entry',
    content text not null,
    created_at timestamptz not null default now()
);

create index if not exists idx_journal_entries_user_created
on public.journal_entries (user_id, created_at desc);

notify pgrst, 'reload schema';
