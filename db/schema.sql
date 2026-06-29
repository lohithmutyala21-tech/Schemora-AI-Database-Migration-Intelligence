-- Schemora — Aurora PostgreSQL schema
-- Run this against your Aurora PostgreSQL cluster to provision persistence.

CREATE TABLE IF NOT EXISTS projects (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Raw uploaded SQL associated with a project.
CREATE TABLE IF NOT EXISTS schemas (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id      BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  raw_sql         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Structural counts parsed out of a schema.
CREATE TABLE IF NOT EXISTS parsed_metadata (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  schema_id           BIGINT NOT NULL REFERENCES schemas(id) ON DELETE CASCADE,
  table_count         INTEGER NOT NULL DEFAULT 0,
  foreign_key_count   INTEGER NOT NULL DEFAULT 0,
  index_count         INTEGER NOT NULL DEFAULT 0,
  trigger_count       INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analyses (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id      BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  schema_id       BIGINT REFERENCES schemas(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_schemas_project ON schemas(project_id);
CREATE INDEX IF NOT EXISTS idx_parsed_metadata_schema ON parsed_metadata(schema_id);
CREATE INDEX IF NOT EXISTS idx_analyses_project ON analyses(project_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created ON analyses(created_at DESC);
