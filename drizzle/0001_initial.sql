CREATE TABLE IF NOT EXISTS organizations (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  owner_id text NOT NULL,
  plan text DEFAULT 'starter',
  sms_credits_included integer DEFAULT 300,
  sms_credits_used integer DEFAULT 0,
  billing_cycle_start timestamp,
  whop_company_id text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS org_members (
  id text PRIMARY KEY,
  org_id text REFERENCES organizations(id),
  user_id text NOT NULL,
  role text DEFAULT 'member',
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id text PRIMARY KEY,
  org_id text REFERENCES organizations(id),
  name text NOT NULL,
  key_hash text NOT NULL,
  key_prefix text NOT NULL,
  scopes text[],
  last_used_at timestamp,
  expires_at timestamp,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lists (
  id text PRIMARY KEY,
  org_id text REFERENCES organizations(id),
  name text NOT NULL,
  description text,
  subscriber_count integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscribers (
  id text PRIMARY KEY,
  org_id text REFERENCES organizations(id),
  phone_e164 text,
  email text,
  name text,
  metadata jsonb,
  channel_preferences jsonb,
  whop_user_id text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS list_subscribers (
  id text PRIMARY KEY,
  list_id text REFERENCES lists(id),
  subscriber_id text REFERENCES subscribers(id),
  subscribed_at timestamp DEFAULT now(),
  unsubscribed_at timestamp,
  UNIQUE (list_id, subscriber_id)
);

CREATE TABLE IF NOT EXISTS announcements (
  id text PRIMARY KEY,
  org_id text REFERENCES organizations(id),
  title text,
  content_html text,
  content_text text NOT NULL,
  channels text[],
  list_ids text[],
  status text DEFAULT 'draft',
  scheduled_for timestamp,
  sent_at timestamp,
  triggered_by text,
  total_recipients integer DEFAULT 0,
  total_delivered integer DEFAULT 0,
  total_opened integer DEFAULT 0,
  total_failed integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS deliveries (
  id text PRIMARY KEY,
  announcement_id text REFERENCES announcements(id),
  subscriber_id text REFERENCES subscribers(id),
  channel text NOT NULL,
  status text DEFAULT 'queued',
  external_id text,
  delivered_at timestamp,
  opened_at timestamp,
  failure_reason text,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sources (
  id text PRIMARY KEY,
  org_id text REFERENCES organizations(id),
  name text NOT NULL,
  type text NOT NULL,
  config jsonb NOT NULL,
  status text DEFAULT 'active',
  last_event_at timestamp,
  last_error text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS source_events (
  id text PRIMARY KEY,
  source_id text REFERENCES sources(id),
  payload jsonb NOT NULL,
  processed_at timestamp,
  agent_id text,
  announcement_id text,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS webhooks (
  id text PRIMARY KEY,
  org_id text REFERENCES organizations(id),
  source_id text REFERENCES sources(id),
  endpoint_path text NOT NULL UNIQUE,
  secret text NOT NULL,
  description text,
  last_received_at timestamp,
  total_received integer DEFAULT 0,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agents (
  id text PRIMARY KEY,
  org_id text REFERENCES organizations(id),
  name text NOT NULL,
  description text,
  status text DEFAULT 'active',
  processing_mode text NOT NULL,
  source_ids text[],
  trigger_type text,
  schedule text,
  timezone text DEFAULT 'America/New_York',
  template_text text,
  system_prompt text,
  user_prompt_template text,
  model text DEFAULT 'claude-sonnet-4-20250514',
  tools text[],
  max_tokens integer DEFAULT 500,
  default_list_ids text[],
  default_channels text[],
  total_runs integer DEFAULT 0,
  total_messages_sent integer DEFAULT 0,
  last_run_at timestamp,
  last_error text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_runs (
  id text PRIMARY KEY,
  agent_id text REFERENCES agents(id),
  source_event_id text,
  status text DEFAULT 'running',
  input jsonb,
  reasoning text,
  output text,
  announcement_id text,
  duration_ms integer,
  tokens_used integer,
  error text,
  created_at timestamp DEFAULT now()
);
