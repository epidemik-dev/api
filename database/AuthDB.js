require('dotenv').config();
const mysql = require('promise-mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

/********************SQL STATEMENTS*******************/
const get_user_salt_sql = "SELECT salt FROM USER T WHERE T.username = ?";
const verify_user_password_sql = "SELECT * FROM USER T where T.username = ? AND T.password = ?";

const get_user_sql = "SELECT * FROM USER";

const get_disease_sql = "SELECT * FROM DISEASE WHERE username = ? AND id = ?";

class AuthDB {

    constructor(db_name) {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: db_name
        });
    }

    // String -> Promise(String)
    // Verifies this jwt and checks if the hash matches the patient id
    // Gives the username if valid
    verifyJWT(req) {
        var token;
        if (req.query !== undefined && req.query.auth_token !== undefined) {
            token = req.query.auth_token;
        } else if (req.cookies !== undefined) {
            token = req.cookies.auth_token;
        }
        var decoded;
        return this.pool.getConnection().then(connection => {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            var query = mysql.format(verify_user_password_sql, [decoded.data.username, decoded.data.password_hash]);
            var res = connection.query(query);
            connection.release();
            return res;
        }).then(result => {
            if (result.length == 0) {
                throw new Error("Bad password");
            } else {
                return decoded.data.username;
            }
        });
    }

    // String String -> Promise(Void)
    // Checks if this user has the permission for this disease
    can_view_disease(userID, diseaseID) {
        var can_view_query = mysql.format(get_disease_sql, [userID, diseaseID]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(can_view_query);
            connection.release();
            return res;
        }).then(users => {
            if(users.length == 0) {
                throw new Error("Cannot view");
            } else {
                return;
            }
        });
    }

}

module.exports = AuthDB