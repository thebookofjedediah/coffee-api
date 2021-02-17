const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require("../config");
const jwt = require("jsonwebtoken");
const { user } = require("../db");
// const { ensureLoggedIn } = require("../middleware/auth");

router.get('/', (req, res, next) => {
    res.send("APP IS WORKING")
})

router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if(!username || !password){
            throw new ExpressError("Username and Password Required", 400)
        }
        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        const results = await db.query(`
            INSERT INTO users (username, password)
            VALUES ($1, $2)
            RETURNING username`,
            [username, hashedPassword]);
        return res.json(results.rows[0]);
    } catch(e) {
        return next(e);
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if(!username || !password){
            throw new ExpressError("Username and Password Required", 400)
        }
        const results = await db.query(`
            SELECT username, password
            FROM users
            WHERE username = $1`,
            [username]);
        const user = results.rows[0];
        if(user){
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ username: username }, SECRET_KEY)
                return res.json({message: `logged in`, token})
            }
        }
        throw new ExpressError("Username not found", 400)
    } catch(e) {
        return next(e);
    }
})

// router.get('/secret', ensureLoggedIn, async (req, res, next) => {
//     try {
//         const token = req.body._token;

//         const payload = jwt.verify(token, SECRET_KEY);
//         return res.json({msg: "SIGNED IN"})
//     } catch(e) {
//         return next(e);
//     }
// }) 

module.exports = router;