-- Delegation events
create table delegation_events (
  id uuid default gen_random_uuid() primary key,
  team_id uuid not null,
  user_id uuid references auth.users,
  event_type text not null,
  role text,
  ai_confidence decimal(3,2),
  status text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Materialized view
create materialized view team_analytics_summary as
select
  team_id,
  date_trunc('day', created_at) as day,
  event_type,
  count(*) as event_count
from delegation_events
group by team_id, date_trunc('day', created_at), event_type;
