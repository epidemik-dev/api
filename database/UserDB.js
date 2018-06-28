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
const change_address_sql = `UPDATE USERS SET latitude = ?, longitude = ? WHERE username = ?`;

const get_user_salt_sql = `SELECT * FROM USERS WHERE username = ?`;
const user_exists_sql = `SELECT * FROM USERS WHERE username = ? AND password = ?`;
const get_indiv_user_sql = `SELECT * FROM USERS LEFT JOIN 
(DISEASE_POINTS LEFT JOIN DISSYM ON diseaseID = id)
ON USERS.username = DISEASE_POINTS.username
WHERE USERS.username = ? ORDER BY id`;
const get_all_users_sql =
    `SELECT USERS.username, latitude, longitude, dob, gender, date, disease_name, date_healthy, diseaseID, symID
FROM USERS LEFT JOIN 
(DISEASE_POINTS LEFT JOIN DISSYM ON diseaseID = id)
ON USERS.username = DISEASE_POINTS.username
WHERE NOT(USERS.username = 'admin')
ORDER BY USERS.username, id`
const get_user_current_sickness = 
`SELECT * FROM DISEASE_POINTS
WHERE date_healthy IS NULL
AND username = ?`

class UserDB {

    constructor(db_name) {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: db_name
        });
    }

    // String String -> Promise(String)
    // Checks this users login and if sucessful gives a auth token
    login_user(username, password) {
        var get_salt_query = mysql.format(get_user_salt_sql, [username]);
        var connection;
        var password;
        return this.pool.getConnection().then(con => {
            connection = con;
            return connection.query(get_salt_query);;
        }).then(result => {
            if(result.length == 0) {
                connection.release();
                throw new Error("User does not exist");
            }
            password = bcrypt.hashSync(password, result[0].salt);
            var user_exists_query = mysql.format(user_exists_sql, [username, password]);
            return connection.query(user_exists_query)
        }).then(result => {
            if(result.length > 0) {
                var token = jwt.sign({
                    data: {
                        username: username,
                        password_hash: password
                    }
                }, process.env.JWT_SECRET, {
                    expiresIn: '10d'
                });
                return token;
            } else {
                throw new Error("Incorrect password");
            }
        });
    }

    // String String String Number Number Date String -> Promise(String)
    // Adds a user based on this information to the database
    // Returns the users JWT when done
    add_user(deviceID, username, unencrypt_password, latitude, longitude, dob, gender) {
        latitude = latitude - latitude % process.env.ERR_RANGE + Number(process.env.ERR_RANGE);
        longitude = longitude - longitude % process.env.ERR_RANGE + Number(process.env.ERR_RANGE);
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
        return this.pool.getConnection().then(connection => {
            var res = Promise.all([connection.query(delete_symptom_query),
                connection.query(delete_disease_query),
                connection.query(delete_bus_query),
                connection.query(delete_user_query)
            ])
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

    // String Number Number -> Promise(Void)
    // Changes this users address to the given one
    change_address(userID, latitude, longitude) {
        latitude =  Math.ceil(latitude * 100)/100;
        longitude = Math.ceil(longitude * 100)/100;
        var change_address_query = mysql.format(change_address_sql, [latitude, longitude, userID]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(change_address_query);
            connection.release();
            return res;
        });
    }

    // String -> Promise(User)
    // Returns all info about this user
    get_specific_user_info(userID) {
        var get_user_query = mysql.format(get_indiv_user_sql, [userID]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(get_user_query);
            connection.release();
            return res;
        }).then(result => {
            var toReturn = {};
            var cur_disease = undefined;
            var last_id = undefined;
            if (result.length === 0) {
                throw new Error("User not found");
            }
            toReturn.latitude = Number(result[0].latitude);
            toReturn.longitude = Number(result[0].longitude);
            toReturn.date_of_birth = result[0].dob;
            toReturn.gender = result[0].gender;
            var diseases = []
            for (var i in result) {
                if (result[i].id !== last_id) {
                    if (last_id !== undefined) {
                        diseases.push(cur_disease);
                    }
                    last_id = result[i].id;
                    cur_disease = {
                        disease_name: result[i].disease_name,
                        date_sick: result[i].date,
                        date_healthy: result[i].date_healthy,
                        symptoms: []
                    };
                }
                cur_disease.symptoms.push({
                    symID: result[i].symID
                });
            }
            if (cur_disease !== undefined) {
                diseases.push(cur_disease);
            }
            toReturn.diseases = diseases;
            return toReturn;
        });
    }

    get_all_users() {
        return this.pool.getConnection().then(connection => {
            var res = connection.query(get_all_users_sql);
            connection.release();
            return res;
        }).then(result => {
            var toReturn = []
            var cur_user = undefined;
            var cur_disease = undefined;
            var last_user_id = undefined;
            var last_disease_id = undefined;
            for (var i in result) {
                if (result[i].diseaseID !== null && result[i].diseaseID !== last_disease_id) {
                    if (last_disease_id !== undefined) {
                        cur_user.diseases.push(cur_disease);
                    }
                    last_disease_id = result[i].diseaseID;
                    cur_disease = {
                        disease_name: result[i].disease_name,
                        date_sick: result[i].date,
                        date_healthy: result[i].date_healthy,
                        symptoms: []
                    };
                }
                if (result[i].username !== last_user_id) {
                    if (cur_user !== undefined) {
                        toReturn.push(cur_user);
                    }
                    last_user_id = result[i].username;
                    cur_user = {
                        latitude: Number(result[i].latitude),
                        longitude: Number(result[i].longitude),
                        date_of_birth: result[i].dob,
                        gender: result[i].gender,
                        diseases: []
                    }
                }
                if (cur_disease !== undefined && result[i].symID !== null) {
                    cur_disease.symptoms.push({
                        symID: result[i].symID
                    });
                }
            }
            if (cur_disease !== undefined) {
                cur_user.diseases.push(cur_disease);
            }
            if (cur_user !== undefined) {
                toReturn.push(cur_user);
            }
            return toReturn;
        });
    }
    
    // String -> Promise(Boolean)
    // Returns whether or not this user is sick
    // True if sick, false if healty
    is_user_sick(userID) {
        var is_sick_query = mysql.format(get_user_current_sickness, [userID]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(is_sick_query);
            connection.release();
            return res;
        }).then(result => {
            if(result.length === 0) {
                return false;
            } else {
                return true;
            }
        })
    }
}

module.exports = UserDB