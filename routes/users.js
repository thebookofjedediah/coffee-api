const express = require("express");
const router = new express.Router();
// const ExpressError = require("../expressError");
const User = require("../models/user");

router.get("/", async function (req, res, next) {
    let users = await User.findAll();
    return res.json(users)
})

module.exports = router;