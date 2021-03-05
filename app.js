const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const coffeeRoutes = require("./routes/coffees");
const brandRoutes = require("./routes/brands");
const ExpressError = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.use(authenticateJWT);
app.use("/users", userRoutes);
app.use("/coffees", coffeeRoutes);
app.use("/brands", brandRoutes);
app.use("/", authRoutes);

/** 404 catch --- passes to next handler. */

app.use(function (req, res, next) {
  const err = new ExpressError("Not found!", 404);
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;

  // set the status and alert the user
  return res.status(status).json({
    error: {
      message: err.message,
      status: status
    }
  });
});


module.exports = app;
