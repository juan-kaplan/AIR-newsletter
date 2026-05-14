CREATE TABLE IF NOT EXISTS subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK(status IN ('active', 'unsubscribed')),
  unsubscribe_token_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  confirmed_at TEXT,
  unsubscribed_at TEXT,
  source TEXT
);

CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

CREATE TABLE IF NOT EXISTS issues (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  preheader TEXT,
  html TEXT,
  text TEXT,
  status TEXT NOT NULL CHECK(status IN ('draft', 'sent', 'failed')),
  created_at TEXT NOT NULL,
  sent_at TEXT
);

CREATE TABLE IF NOT EXISTS deliveries (
  id TEXT PRIMARY KEY,
  issue_slug TEXT NOT NULL,
  subscriber_id TEXT,
  subscriber_email_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('sent', 'skipped', 'failed')),
  provider_message_id TEXT,
  error TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  email_hash TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL
);
