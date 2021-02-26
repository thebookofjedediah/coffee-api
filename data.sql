DROP DATABASE IF EXISTS coffee_app;

CREATE DATABASE coffee_app;

\c coffee_app;

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  profile_picture TEXT,
  is_admin BOOLEAN NULL DEFAULT FALSE
);

CREATE TABLE brands (
  handle VARCHAR(25) PRIMARY KEY CHECK (handle = lower(handle)),
  name TEXT UNIQUE NOT NULL,
  location TEXT,
  logo_url TEXT
);

-- photo(s) for coffees
CREATE TABLE coffees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand_handle TEXT
    REFERENCES brands ON DELETE CASCADE,
  roast_level TEXT 
    CHECK (roast_level IN ('City', 'City +', 'Full City', 'Full City +', 'Vienna', 'French', 'Italian/Spanish', 'Espresso', 'Light', 'Medium', 'Dark'))
);


CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  rating INTEGER CHECK (rating >= 0),
  message TEXT,
  username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  coffee_id INTEGER
    REFERENCES coffees ON DELETE CASCADE
);
