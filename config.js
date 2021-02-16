const DB_URI = (process.env.NODE_ENV === "test")
  ? "postgresql:///coffee_app_test"
  : "postgresql:///coffee_app";

const SECRET_KEY = process.env.SECRET_KEY || "secret"

const BCRYPT_WORK_FACTOR = 12;

module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR
};