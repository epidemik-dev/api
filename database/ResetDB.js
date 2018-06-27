require('dotenv').config();
const mysql = require('promise-mysql');
var fs = require('fs');

class DBReseter {

    constructor(dbName) {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: dbName,
            multipleStatements: true
        });
    }

    // Void -> Promise(Void)
    // Sets the DB schema to the most current one and clears the data
    reset_db() {
        var sql = fs.readFileSync(__dirname + '/schema.sql').toString();
        var patientDB = this.patientDB;
        return this.pool.getConnection().then(function (connection) {
            var res = connection.query(sql);
            connection.release();
            return res;
        });
    }
}

module.exports = DBReseter;
