require('dotenv').config();
const mysql = require('promise-mysql');

const add_disease_sql = "INSERT INTO DISEASE (disease_name, date, date_healthy, username) VALUES (?, ?, ?, ?)";
const add_symptom_sql = "INSERT INTO DISEASE_SYMPTOM VALUES (?, ?)";
const add_sym_sql = "INSERT INTO DISEASE_SYMPTOM SELECT id, ? FROM DISEASE WHERE username = ? AND date_healthy IS NULL";

const delete_disease_sym_sql = "DELETE FROM DISEASE_SYMPTOM WHERE diseaseID = ?";
const delete_disease_sql = "DELETE FROM DISEASE WHERE id = ?";
const delete_single_symptom_sql = "DELETE FROM DISEASE_SYMPTOM WHERE symID = ?";

const am_healthy_sql = "UPDATE DISEASE SET date_healthy = ? WHERE date_healthy IS NULL AND username = ?";

const get_user_symptoms = "SELECT symID FROM DISEASE_SYMPTOM, DISEASE WHERE id = diseaseID AND date_healthy IS NULL AND username = ?";
const get_disease_symptoms = "SELECT symID FROM DISEASE_SYMPTOM WHERE diseaseID = ?";
const get_disease_sql = "SELECT * FROM DISEASE LEFT JOIN DISEASE_SYMPTOM ON diseaseID = id WHERE diseaseID = ? AND username = ?";
const get_user_disease_sql = "SELECT * FROM USER JOIN (DISEASE LEFT JOIN DISEASE_SYMPTOM ON diseaseID = id) ON USER.username = DISEASE.username WHERE USER.username = ? ORDER BY id";
const get_all_diseases_sql =
    `SELECT * FROM 
USER JOIN (DISEASE LEFT JOIN DISEASE_SYMPTOM ON diseaseID = id) 
ON USER.username = DISEASE.username
WHERE latitude >= ? 
AND latitude <=   ?
AND longitude >=  ?
AND longitude <=  ?
AND date_healthy IS NULL`
const get_specific_disease_sql =
    `SELECT * FROM 
USER JOIN (DISEASE LEFT JOIN DISEASE_SYMPTOM ON diseaseID = id) 
ON USER.username = DISEASE.username
WHERE latitude >= ? 
AND latitude <=   ?
AND longitude >=  ?
AND longitude <=  ?
AND disease_name = ?`
const get_disease_name_symptoms =
    `SELECT diseaseID, symID
FROM DISEASE_SYMPTOM, DISEASE
WHERE diseaseID = id
AND disease_name = ?`;
const get_user_score_sql = 
`SELECT score.disease_name, score.c/symptoms.a as probability
FROM
(SELECT disease_name, COUNT(*) c
FROM DISEASE D2, DISEASE_SYMPTOM DS2,
(SELECT symID
FROM DISEASE D1, DISEASE_SYMPTOM DS1
WHERE ? = D1.username AND D1.id = DS1.diseaseID AND D1.date_healthy IS NULL) as S
WHERE D2.id = DS2.diseaseID AND S.symID = DS2.symID
GROUP BY disease_name) as score, 
(SELECT disease_name, COUNT(*) a 
FROM DISEASE, DISEASE_SYMPTOM 
WHERE diseaseID = id
GROUP BY disease_name) as symptoms
WHERE symptoms.disease_name = score.disease_name
AND symptoms.a != 0
ORDER BY score.c/symptoms.a DESC`

const update_disease_sql = 'UPDATE DISEASE SET disease_name = ? WHERE username = ? AND date_healthy IS NULL';

const remove_diag_disease_sql = `DELETE DISEASE_SYMPTOM FROM DISEASE_SYMPTOM JOIN DISEASE ON diseaseID = id WHERE username = 'admin';
                                 DELETE FROM DISEASE where username = 'admin';`;

class DiseaseDB {

    constructor(db_name) {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: db_name,
            multipleStatements: true
        });
    }

    // String Date [Null or Date] String [List-of Number] -> Promise([List-of Diagnosis])
    // A Diagnosis is a Object(probability: Number, disease_name: String)
    // Adds this disease to the database and returns the disease we think you have
    add_disease(disease_name, date_sick, date_healthy, username, symptoms) {
        return this.pool.getConnection().then(con => {
            return add_disease_with_connection(disease_name, date_sick, date_healthy, username, symptoms, true, con);
        });
    }

    // Number -> Promise(Void)
    // Removes this disease entry and all associated information
    delete_disease(diseaseID) {
        var delete_sym_query = mysql.format(delete_disease_sym_sql, [diseaseID]);
        var delete_disease_query = mysql.format(delete_disease_sql, [diseaseID]);
        return this.pool.getConnection().then(connection => {
            var res = Promise.all(
                [connection.query(delete_sym_query),
                    connection.query(delete_disease_query)
                ]);
            connection.release();
            return res;
        });
    }

    // Date String -> Promise(Void)
    // Marks this user as healthy
    mark_healthy(date_healthy, username) {
        var am_healthy_query = mysql.format(am_healthy_sql, [date_healthy, username]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(am_healthy_query);
            connection.release();
            return res;
        });
    }

    // String -> Promise(Void)
    // Deletes this symptom id from the users report
    delete_symptom(symID) {
        var delete_sym_query = mysql.format(delete_single_symptom_sql, [symID]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(delete_sym_query);
            connection.release();
            return res;
        })
    }

    // String String -> Promise(String)
    // Adds this symptom to the users current list of symptoms
    add_symptom(userID, symID) {
        var add_sym_query = mysql.format(add_sym_sql, [symID, userID]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(add_sym_query);
            connection.release();
            return res;
        }).then(result => {
            if (result.affectedRows === 0) {
                throw new Error("You must be sick");
            } else {
                return symID;
                s
            }
        })
    }

    // String -> Promise([List-of Symptom])
    // Returns every symptom this user has
    get_user_symptoms(userID) {
        var get_sym_query = mysql.format(get_user_symptoms, [userID]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(get_sym_query);
            connection.release();
            return res;
        });
    }

    // String -> Promise([List-of String])
    // Returns every symptom this disease has
    get_disease_symptoms(disID) {
        var get_sym_query = mysql.format(get_disease_symptoms, [disID]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(get_sym_query);
            connection.release();
            return res;
        });
    }

    // String String -> Promise(Disease)
    // Returns the information for this specific disease
    get_disease(userID, diseaseID) {
        var get_disease_query = mysql.format(get_disease_sql, [diseaseID, userID]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(get_disease_query);
            connection.release();
            return res;
        }).then(result => {
            if (result.length === 0) {
                throw new Error("Disease not found");
            }
            var toReturn = {};
            var syms = [];
            for (var i in result) {
                syms.push({
                    symID: result[i].symID
                });
            }
            toReturn.disease_name = result[0].disease_name;
            toReturn.date_sick = result[0].date;
            toReturn.date_healthy = result[0].date_healthy;
            toReturn.symptoms = syms;
            return toReturn;
        });
    }

    // String -> Promise([List-of Disease])
    // Returns every disease point that this person has experienced
    get_all_disease_for(userID) {
        var get_disease_query = mysql.format(get_user_disease_sql, [userID]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(get_disease_query);
            connection.release();
            return res;
        }).then(result => {
            var toReturn = [];
            var cur_disease = undefined;
            var last_id = undefined;
            for (var i in result) {
                if (result[i].id !== last_id) {
                    if (last_id !== undefined) {
                        toReturn.push(cur_disease);
                    }
                    last_id = result[i].id;
                    cur_disease = {
                        disease_name: result[i].disease_name,
                        date_sick: result[i].date,
                        date_healthy: result[i].date_healthy,
                        latitude: result[i].latitude,
                        longitude: result[i].longitude,
                        symptoms: []
                    };
                }
                cur_disease.symptoms.push({
                    symID: result[i].symID
                });
            }
            if (cur_disease !== undefined) {
                toReturn.push(cur_disease);
            }
            return toReturn;
        });
    }

    // Number Number Number Number -> Promise([List-of Disease])
    get_all_diseases(lat_min, lat_max, long_min, long_max) {
        var get_all_diseases_query = mysql.format(get_all_diseases_sql, [lat_min, lat_max, long_min, long_max]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(get_all_diseases_query);
            connection.release();
            return res;
        }).then(result => {
            var toReturn = [];
            var cur_disease = undefined;
            var last_id = undefined;
            for (var i in result) {
                if (result[i].id !== last_id) {
                    if (last_id !== undefined) {
                        toReturn.push(cur_disease);
                    }
                    last_id = result[i].id;
                    cur_disease = {
                        disease_name: result[i].disease_name,
                        date_sick: result[i].date,
                        date_healthy: result[i].date_healthy,
                        latitude: result[i].latitude,
                        longitude: result[i].longitude,
                        symptoms: []
                    };
                }
                cur_disease.symptoms.push({
                    symID: result[i].symID
                });
            }
            if (cur_disease !== undefined) {
                toReturn.push(cur_disease);
            }
            return toReturn;
        });
    }

    // Number Number Number Number -> Promise([List-of Disease])
    // Returns every disease where the name matches the given name
    get_diseases_for_name(lat_min, lat_max, long_min, long_max, disease_name) {
        var get_all_diseases_query = mysql.format(get_specific_disease_sql, [lat_min, lat_max, long_min, long_max, disease_name]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(get_all_diseases_query);
            connection.release();
            return res;
        }).then(result => {
            var toReturn = [];
            var cur_disease = undefined;
            var last_id = undefined;
            for (var i in result) {
                if (result[i].id !== last_id) {
                    if (last_id !== undefined) {
                        toReturn.push(cur_disease);
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
                toReturn.push(cur_disease);
            }
            return toReturn;
        });
    }

    // String -> Promise([List-of [List-of Symptom]])
    get_disease_name_symptoms(disease_name) {
        var get_all_symptoms_query = mysql.format(get_disease_name_symptoms, [disease_name]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(get_all_symptoms_query);
            connection.release();
            return res;
        }).then(result => {
            var all_symptoms = [];
            var cur_symptoms = undefined;
            var last_disease_id = undefined;
            for (var i in result) {
                if (result[i].diseaseID !== last_disease_id) {
                    last_disease_id = result[i].diseaseID;
                    if (last_disease_id !== undefined && cur_symptoms !== undefined) {
                        all_symptoms.push(cur_symptoms);
                    }
                    cur_symptoms = [];
                }
                cur_symptoms.push({
                    symID: result[i].symID
                });
            }
            if (cur_symptoms !== undefined) {
                all_symptoms.push(cur_symptoms);
            }
            return all_symptoms;
        });
    }

    // Void -> Promise(Void)
    // Adds all the diseases to the database that are used for diagnosis
    add_diagnosis_diseases() {
        var connection;
        return this.pool.getConnection().then(con => {
            connection = con;
            var res = connection.query(remove_diag_disease_sql);
            return res;
        }).then(result => {
            var num_to_add = 10;
            var promises = [];
            for(var i = 0; i < num_to_add; i++) {
                promises.push(add_disease_with_connection("Common-Cold", "1800-01-01", "1800-01-01", "admin", [1, 2, 3, 4, 5], false, connection));
            }
            for(var i = 0; i < num_to_add; i++) {
                promises.push(add_disease_with_connection("Influenza-(Flu)", "1800-01-01", "1800-01-01", "admin", [6, 2, 7, 8, 4], false, connection));
            }
            for(var i = 0; i < num_to_add; i++) {
                promises.push(add_disease_with_connection("Gastroenteritis-(Stomach-Flu)", "1800-01-01", "1800-01-01", "admin", [9, 10, 11, 12, 2], false, connection));
            }
            for(var i = 0; i < num_to_add; i++) {
                promises.push(add_disease_with_connection("Staph-Infection", "1800-01-01", "1800-01-01", "admin", [13, 14, 15, 2, 16], false, connection));
            }
            for(var i = 0; i < num_to_add; i++) {
                promises.push(add_disease_with_connection("Strep-Throat", "1800-01-01", "1800-01-01", "admin", [17, 13, 2, 18, 5], false, connection));
            }
            for(var i = 0; i < num_to_add; i++) {
                promises.push(add_disease_with_connection("Lyme-Disease", "1800-01-01", "1800-01-01", "admin", [19, 2, 5, 7, 18], false, connection));
            }
            for(var i = 0; i < num_to_add; i++) {
                promises.push(add_disease_with_connection("Tuberculosis", "1800-01-01", "1800-01-01", "admin", [20, 21, 6, 7, 22], false, connection));
            }
            for(var i = 0; i < num_to_add; i++) {
                promises.push(add_disease_with_connection("Pink-Eye", "1800-01-01", "1800-01-01", "admin", [23, 3, 24, 25, 26], false, connection));
            }
            for(var i = 0; i < num_to_add; i++) {
                promises.push(add_disease_with_connection("Hand-Foot-and-Mouth", "1800-01-01", "1800-01-01", "admin", [15, 16, 20, 5, 27], false, connection));
            }
            return Promise.all(promises);
        }).then(result => {
            connection.release();
            return;
        })
    }


}

// String Connection -> Promise(String)
// Returns the name of the disease we think this user has
// EFFECT: will release the connection at the end
function diagnose_user(username, connection) {
    var user_score_query = mysql.format(get_user_score_sql, [username]);
    return connection.query(user_score_query).then(result => {
        if(result.length > 0) {
            var update_query = mysql.format(update_disease_sql, [result[0].disease_name, username]);
            connection.query(update_query);
        }
        connection.release();
        return result;
    });
}

// String DateString DateString String [List-of Number] Boolean Connection -> Promise([List-of Diagnosis])
// Adds a disease to the database given a connection
// If should_diagnose is true it will return the diagnosis and release the connection
// EFFECT: will release the connection if should_diagnose is true
function add_disease_with_connection(disease_name, date_sick, date_healthy, username, symptoms, should_diagnose, connection) {
    var add_disease_query = mysql.format(add_disease_sql, [disease_name, date_sick, date_healthy, username]);
    return connection.query(add_disease_query).then(result => {
        var disID = result.insertId;
        var toPromise = [];
        for (var symptom in symptoms) {
            var add_sym_query = mysql.format(add_symptom_sql, [disID, symptoms[symptom]])
            toPromise.push(connection.query(add_sym_query));
        }
        return Promise.all(toPromise);
    }).then(res => {
        if(should_diagnose) {
            return diagnose_user(username, connection);
        } else {
            return [];
        }
    });
}

module.exports = DiseaseDB