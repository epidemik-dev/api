require('dotenv').config();
const mysql = require('promise-mysql');

class UserDB {

    constructor(db_name) {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: db_name
        });
    }

}

module.exports = UserDB