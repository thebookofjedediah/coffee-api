const db = require("../db");
const bcrypt = require("bcrypt");
const ExpressError = require("../expressError");


// const { BCRYPT_WORK_FACTOR } = require("../config.js");


class User {
    constructor(username, password){
        this.username = username;
        this.password = password;
    }

    static async findAll() {
        const results = await db.query(
            `SELECT username 
            FROM users`
        )
        return results.rows;
    }

}

module.exports = User;