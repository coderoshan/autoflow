-- Enable RLS
alter table meetings enable row level security;

-- Meetings table
create table meetings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  meeting_id text not null,
  title text default 'Untitled Meeting',
  transcript text,
  summary text,
  tasks jsonb default '[]',
  decisions jsonb default '[]',
  questions jsonb default '[]',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS: Users can only see their own meetings
create policy "Users own meetings" on meetings for all using (auth.uid() = user_id);

-- Realtime
alter publication supabase_realtime add table meetings;
