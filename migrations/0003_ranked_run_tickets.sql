create table if not exists timesmith_run_tickets (
  id text primary key,
  user_id text not null,
  subject text not null check (subject in ('arithmetic', 'algebra')),
  mode text not null check (mode in ('sprint', 'streak', 'practice')),
  started_at timestamptz not null default now(),
  used_at timestamptz
);

create index if not exists timesmith_run_tickets_user_idx
  on timesmith_run_tickets (user_id, started_at desc);
