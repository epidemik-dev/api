require('dotenv').config();
const mysql = require('promise-mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

const add_user_sql = `INSERT INTO USERS (deviceID, latitude, longitude, username, password, salt, date_reg, dob, gender)
                                  VALUES(?,        ?,        ?,        ?,         ?,        ?,    ?,        ?,   ?     )`
const delete_user_sym_sql = `DELETE DS FROM DISSYM DS, DISEASE_POINTS DP WHERE DS.diseaseID = DP.id AND DP.username = ?`
const delete_user_diseases_sql = `DELETE DP FROM DISEASE_POINTS DP WHERE DP.username = ?`
const delete_bus_user_sql = `DELETE FROM BUSUSER WHERE uName = ? OR bName=  ?`;
const delete_user_sql = `DELETE FROM USERS where username = ?`

const change_password_sql = `UPDATE USERS SET password = ?, salt = ? WHERE username = ?`


class UserDB {

    constructor(db_name) {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: db_name
        });
    }

    // String String String Number Number Date String -> Promise(String)
    // Adds a user based on this information to the database
    // Returns the users JWT when done
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

    // String -> Promise(Void)
    // Deletes this user and all associated information from the DB
    delete_user(username) {
        var delete_symptom_query = mysql.format(delete_user_sym_sql, [username]);
        var delete_disease_query = mysql.format(delete_user_diseases_sql, [username])
        var delete_bus_query = mysql.format(delete_bus_user_sql, [username, username])
        var delete_user_query = mysql.format(delete_user_sql, [username])
        console.log(delete_disease_query);
        return this.pool.getConnection().then(connection => {
            var res = Promise.all([connection.query(delete_symptom_query),
                connection.query(delete_disease_query),
                connection.query(delete_bus_query),
                connection.query(delete_user_query)])
            connection.release();
            return res;
        })
    }

    // String String -> Promise(Void)
    // Updates this users password to the new one
    change_password(username, new_password) {
        var salt = bcrypt.genSaltSync(saltRounds);
        var password = bcrypt.hashSync(new_password, salt);
        var change_password_query = mysql.format(change_password_sql, [password, salt, username]);

        return this.pool.getConnection().then(connection => {
            var res = connection.query(change_password_query);
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