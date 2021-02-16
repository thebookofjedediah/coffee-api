DROP DATABASE IF EXISTS coffee_app;

CREATE DATABASE coffee_app;

\c coffee_app;

DROP TABLE IF EXISTS users;

CREATE TABLE users
(
  username TEXT NOT NULL PRIMARY KEY,
  password TEXT NOT NULL
);

