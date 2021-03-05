require("dotenv").config();

const DB_URI = (process.env.NODE_ENV === "test")
  ? "postgresql:///coffee_app_test"
  : "postgresql:///coffee_app";

const SECRET_KEY = process.env.SECRET_KEY || "secret"

const PORT = +process.env.PORT || 3001

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const PICPURIFY_API_KEY = process.env.PICPURIFY_API_KEY || "6zyY8MEcJsUrqdd5mUbIhHQeIcyxB7SX";
const PICPURIFY_URL = process.env.PICPURIFY_URL || "https://www.picpurify.com/analyse/1.1";

module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  PORT,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
  PICPURIFY_API_KEY,
  PICPURIFY_URL
};