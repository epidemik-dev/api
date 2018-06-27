require('dotenv').config();
const mysql = require('promise-mysql');
var fs = require('fs');

class ResetDB {

    constructor(dbName, userDB) {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: dbName,
            multipleStatements: true
        });

        this.userDB = userDB;
    }

    // Void -> Promise(Void)
    // Sets the DB schema to the most current one and clears the data
    reset_db() {
        var sql = fs.readFileSync(__dirname + '/schema.sql').toString();
        var patientDB = this.patientDB;
        var userDB = this.userDB;
        return this.pool.getConnection().then(function (connection) {
            var res = connection.query(sql);
            connection.release();
            return res;
        }).then(result => {
            return userDB.add_user("", "admin", process.env.ADMIN_PASSWORD, 1, 1, "1800/01/01", "Female").then(token => {
                return token;
            })
        })
    }
}

module.exports = ResetDB;
