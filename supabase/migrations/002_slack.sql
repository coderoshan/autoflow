-- Slack tasks table
create table slack_tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  slack_user_id text not null,
  slack_team_id text not null,
  slack_channel_id text,
  slack_message_ts text,
  raw_text text not null,
  task text not null,
  assignee text,
  deadline timestamp with time zone,
  priority text default 'medium' check (priority in ('high', 'medium', 'low')),
  category text,
  status text default 'pending' check (status in ('pending', 'completed', 'snoozed', 'delegated')),
  source text default 'slack',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS
create policy "Users own Slack tasks" on slack_tasks for all using (auth.uid() = user_id);
