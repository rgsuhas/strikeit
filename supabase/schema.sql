create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  list_key text not null,
  text text not null,
  completed boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists tasks_list_key_idx on tasks(list_key);
create index if not exists tasks_position_idx on tasks(list_key, position);

-- Enable realtime
alter publication supabase_realtime add table tasks;
