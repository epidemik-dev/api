require('dotenv').config();
const mysql = require('promise-mysql');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
var Password = require("node-php-password");
var child = require("child_process");
var exec = child.exec;


const add_user_sql = `INSERT INTO USER (deviceID, latitude, longitude, username, password, salt, date_reg, dob, gender, weight, height, does_smoke, has_hypertension, has_diabetes, has_high_cholesterol)
                                  VALUES(?,        ?,        ?,        ?,         ?,        ?,    ?,        ?,   ?    , ?     , ?     , ?         , ?               , ?           , ?)`
const delete_user_sym_sql = `DELETE DISEASE_SYMPTOM FROM DISEASE_SYMPTOM, DISEASE WHERE diseaseID = id AND username = ?`
const delete_user_diseases_sql = `DELETE FROM DISEASE WHERE username = ?`
const delete_user_sql = `DELETE FROM USER where username = ?`

const change_password_sql = `UPDATE USER SET password = ?, salt = ? WHERE username = ?`
const change_address_sql = `UPDATE USER SET latitude = ?, longitude = ? WHERE username = ?`;

const get_user_salt_sql = `SELECT * FROM USER WHERE username = ?`;
const user_exists_sql = `SELECT * FROM USER WHERE username = ? AND password = ?`;
const get_indiv_user_sql = `SELECT * FROM USER LEFT JOIN 
(DISEASE LEFT JOIN DISEASE_SYMPTOM ON diseaseID = id)
ON USER.username = DISEASE.username
WHERE USER.username = ? ORDER BY id`;
const get_all_users_sql =
    `SELECT USER.username, latitude, longitude, dob, gender, date, disease_name, date_healthy, diseaseID, symID
FROM USER LEFT JOIN 
(DISEASE LEFT JOIN DISEASE_SYMPTOM ON diseaseID = id)
ON USER.username = DISEASE.username
WHERE NOT(USER.username = 'admin')
ORDER BY USER.username, id`
const get_user_current_sickness =
    `SELECT * FROM DISEASE
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

    // String String (String -> Void) -> Void
    // Checks this users login and if successful gives a auth token
    login_user(username, password, callback) {
        var get_salt_query = mysql.format(get_user_salt_sql, [username]);
        var connection;
        var password;
        this.pool.getConnection().then(con => {
            connection = con;
            return connection.query(get_salt_query);;
        }).then(result => {
            if (result == undefined || result.length == 0) {
                connection.release();
                callback(false);
                return;
            }
            var password1 = bcrypt.hashSync(password, result[0].salt);
            var directory = __dirname + "/login_helper.php";
            directory = directory.split(' ').join('\\ ');
            exec("php " + directory + " " + password, (error, stdout, stderr) => {
                var password2 = stdout;
                var user_exists_query = mysql.format(user_exists_sql, [username, password1]);
                connection.query(user_exists_query).then(result => {
                    if (result.length > 0) {
                        connection.release();
                        var token = jwt.sign({
                            data: {
                                username: username,
                                password_hash: password1
                            }
                        }, process.env.JWT_SECRET, {
                            expiresIn: '10d'
                        });
                        callback(token);
                    } else {
                        var user_exists_query = mysql.format(user_exists_sql, [username, password2]);
                        connection.query(user_exists_query).then(result => {
                            connection.release();
                            if (result.length > 0) {
                                var token = jwt.sign({
                                    data: {
                                        username: username,
                                        password_hash: password2
                                    }
                                }, process.env.JWT_SECRET, {
                                    expiresIn: '10d'
                                });
                                callback(token);
                            } else {
                                callback(false);
                            }
                        });
                    }
                });
            });
        });
    }

    // String String String Number Number Date String -> Promise(String)
    // Adds a user based on this information to the database
    // Returns the users JWT when done
    add_user(deviceID, username, unencrypt_password, latitude, longitude, dob, gender, weight, height, does_smoke, has_hypertension, has_diabetes, has_high_cholesterol) {
        latitude = latitude - latitude % process.env.ERR_RANGE + Number(process.env.ERR_RANGE);
        longitude = longitude - longitude % process.env.ERR_RANGE + Number(process.env.ERR_RANGE);
        var salt = bcrypt.genSaltSync(saltRounds);
        var password = bcrypt.hashSync(unencrypt_password, salt);
        var add_user_query = mysql.format(add_user_sql, [deviceID, latitude, longitude, username, password, salt, new Date(), dob, gender, weight, height, does_smoke, has_hypertension, has_diabetes, has_high_cholesterol]);

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
        var delete_user_query = mysql.format(delete_user_sql, [username])
        var connection;
        return this.pool.getConnection().then(con => {
            connection = con;
            return connection.query(delete_symptom_query);
        }).then(result => {
            return connection.query(delete_disease_query);
        }).then(result => {
            var res = connection.query(delete_user_query);
            connection.release();
            return res;
        });
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
        latitude = Math.ceil(latitude * 100) / 100;
        longitude = Math.ceil(longitude * 100) / 100;
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
    // True if sick, false if healthy
    is_user_sick(userID) {
        var is_sick_query = mysql.format(get_user_current_sickness, [userID]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(is_sick_query);
            connection.release();
            return res;
        }).then(result => {
            if (result.length === 0) {
                return false;
            } else {
                return true;
            }
        })
    }
}

module.exports = UserDB