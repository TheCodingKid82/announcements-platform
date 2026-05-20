-- Phone-OTP auth (hand-rolled, no Better Auth).

CREATE TABLE IF NOT EXISTS "user" (
  id text PRIMARY KEY,
  phone_number text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "session" (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  expires_at timestamp NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS phone_otp (
  phone_number text PRIMARY KEY,
  code_hash text NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  expires_at timestamp NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS session_user_id_idx ON "session" (user_id);
CREATE INDEX IF NOT EXISTS session_expires_at_idx ON "session" (expires_at);
CREATE INDEX IF NOT EXISTS phone_otp_expires_at_idx ON phone_otp (expires_at);
