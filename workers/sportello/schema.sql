-- Database D1 del portale di formazione: una tabella di documenti JSON (raccolta, id, dati).
CREATE TABLE IF NOT EXISTS docs (
  col  TEXT NOT NULL,
  id   TEXT NOT NULL,
  data TEXT NOT NULL,
  PRIMARY KEY (col, id)
);
