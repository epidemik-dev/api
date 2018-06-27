require('dotenv').config();
const mysql = require('promise-mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

const add_user_sql = `INSERT INTO USERS (deviceID, latitude, longitude, username, password, salt, date_reg, dob, gender)
                                  VALUES(?,        ?,        ?,        ?,         ?,        ?,    ?,        ?,   ?     )`

class UserDB {

    constructor(db_name) {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: db_name
        });
    }

    // String String String Number Number Date String -> Promise(Void)
    // Adds a user based on this information to the database
    add_user(deviceID, username, unencrypt_password, latitude, longitude, dob, gender) {
        var salt = bcrypt.genSaltSync(saltRounds);
        var password = bcrypt.hashSync(unencrypt_password, salt);
        var add_user_query = mysql.format(add_user_sql, [deviceID, latitude, longitude, username, password, salt, new Date(), dob, gender]);

        return this.pool.getConnection().then(connection => {
            var res = connection.query(add_user_query);
            connection.release();
            return res;
        }).then(result => {
            var token = jwt.sign({
                data: {
                    username: username,
                    password_hash: password
                }
            }, process.env.JWT_SECRET, {
                expiresIn: '10d'
            });
            return token
        });
    }

}

module.exports = UserDB