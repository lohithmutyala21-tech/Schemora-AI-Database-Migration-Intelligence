-- Schemora — Aurora PostgreSQL schema
-- Run this against your Aurora PostgreSQL cluster to provision persistence.

CREATE TABLE IF NOT EXISTS projects (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analyses (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id      BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  source_sql      TEXT NOT NULL,
  tables          INTEGER NOT NULL DEFAULT 0,
  foreign_keys    INTEGER NOT NULL DEFAULT 0,
  indexes         INTEGER NOT NULL DEFAULT 0,
  triggers        INTEGER NOT NULL DEFAULT 0,
  complexity      INTEGER NOT NULL DEFAULT 0,
  aurora_fit      INTEGER NOT NULL DEFAULT 0,
  dynamo_fit      INTEGER NOT NULL DEFAULT 0,
  risk_score      INTEGER NOT NULL DEFAULT 0,
  recommendation  TEXT NOT NULL,
  confidence      INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'completed',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analyses_project ON analyses(project_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created ON analyses(created_at DESC);
