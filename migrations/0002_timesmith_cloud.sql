create table if not exists timesmith_progress (
  user_id text primary key,
  save_json jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists timesmith_runs (
  id text primary key,
  user_id text not null,
  display_name text not null,
  subject text not null check (subject in ('arithmetic', 'algebra')),
  mode text not null check (mode in ('sprint', 'streak', 'practice')),
  score integer not null check (score >= 0 and score <= 250000),
  accuracy integer not null check (accuracy >= 0 and accuracy <= 100),
  duration_ms integer not null check (duration_ms >= 1000 and duration_ms <= 3600000),
  week_start date not null default (date_trunc('week', current_timestamp at time zone 'UTC'))::date,
  created_at timestamptz not null default now()
);

create index if not exists timesmith_runs_week_rank_idx
  on timesmith_runs (week_start desc, subject, mode, score desc, accuracy desc, duration_ms asc);

create index if not exists timesmith_runs_user_idx
  on timesmith_runs (user_id, created_at desc);
