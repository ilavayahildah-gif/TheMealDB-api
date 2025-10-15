create users and meals tables
CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
google_id TEXT UNIQUE,
email TEXT UNIQUE,
name TEXT,
created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE IF NOT EXISTS meals (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
name TEXT NOT NULL,
calories INTEGER,
notes TEXT,
created_at TIMESTAMP DEFAULT now()
);