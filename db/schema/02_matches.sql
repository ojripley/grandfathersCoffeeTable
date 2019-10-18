-- Drop and recreate matches table (Example)

DROP TABLE IF EXISTS matches CASCADE;
CREATE TABLE matches (
  id SERIAL PRIMARY KEY NOT NULL,
  gametype INTEGER REFERENCES users(id),
  time_stamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
);
