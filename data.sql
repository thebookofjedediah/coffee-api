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
  is_admin BOOLEAN NULL DEFAULT FALSE
);

CREATE TABLE coffees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  roast_level TEXT
);

