-- Team members
create table team_members (
  id uuid default gen_random_uuid() primary key,
  team_id uuid not null,
  user_id uuid references auth.users not null,
  name text not null,
  role text not null,
  timezone text default 'UTC',
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(team_id, user_id)
);

-- Skill vectors
create table skill_vectors (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  team_id uuid not null,
  skill text not null,
  level decimal(3,2) default 0.5,
  verified boolean default false,
  last_used timestamp with time zone,
  task_count integer default 0,
  unique(user_id, skill)
);

-- Delegated tasks
create table delegated_tasks (
  id uuid default gen_random_uuid() primary key,
  original_task_id uuid references slack_tasks,
  team_id uuid not null,
  assignee_id uuid references auth.users not null,
  assigner_type text default 'ai',
  ai_confidence decimal(3,2),
  status text default 'assigned',
  auto_assigned boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
