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

CREATE TABLE coffees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  roast_level TEXT
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