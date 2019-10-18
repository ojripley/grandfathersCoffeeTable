-- Drop and recreate results table (Example)

DROP TABLE IF EXISTS results CASCADE;
CREATE TABLE results (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  match_id INTEGER REFERENCES matches(id),
  score INTEGER NOT NULL,
  finished_position INTEGER NOT NULL
);
