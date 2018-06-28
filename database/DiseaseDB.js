require('dotenv').config();
const mysql = require('promise-mysql');

const add_disease_sql = "INSERT INTO DISEASE_POINTS (disease_name, date, date_healthy, username) VALUES (?, ?, ?, ?)";
const add_symptom_sql = "INSERT INTO DISSYM VALUES (?, ?)";
const add_sym_sql = "INSERT INTO DISSYM SELECT id, ? FROM DISEASE_POINTS WHERE username = ? AND date_healthy IS NULL";

const delete_disease_sym_sql = "DELETE FROM DISSYM WHERE diseaseID = ?";
const delete_disease_sql = "DELETE FROM DISEASE_POINTS WHERE id = ?";
const delete_single_symptom_sql = "DELETE FROM DISSYM WHERE symID = ?";

const am_healthy_sql = "UPDATE DISEASE_POINTS SET date_healthy = ? WHERE date_healthy IS NULL AND username = ?";

const get_user_symptoms = "SELECT symID FROM DISSYM, DISEASE_POINTS WHERE id = diseaseID AND date_healthy IS NULL AND username = ?";
const get_disease_symptoms = "SELECT symID FROM DISSYM WHERE diseaseID = ?";
const get_disease_sql = "SELECT * FROM DISEASE_POINTS LEFT JOIN DISSYM ON diseaseID = id WHERE diseaseID = ? AND username = ?";
const get_user_disease_sql = "SELECT * FROM DISEASE_POINTS LEFT JOIN DISSYM ON diseaseID = id WHERE username = ? ORDER BY id";

const get_all_diseases_sql = 
`SELECT * FROM 
USERS JOIN (DISEASE_POINTS LEFT JOIN DISSYM ON diseaseID = id) 
ON USERS.username = DISEASE_POINTS.username
WHERE latitude >= ? 
AND latitude <=   ?
AND longitude >=  ?
AND longitude <=  ?
AND date_healthy IS NULL`

class DiseaseDB {

    constructor(db_name) {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: db_name
        });
    }

    // String Date [Null or Date] String [List-of Number] -> Promise(String)
    // Adds this disease to the database and returns the disease we think you have
    add_disease(disease_name, date_sick, date_healthy, username, symptoms) {
        var connection;
        var add_disease_query = mysql.format(add_disease_sql, [disease_name, date_sick, date_healthy, username]);
        return this.pool.getConnection().then(con => {
            connection = con;
            var res = connection.query(add_disease_query)
            return res;
        }).then(result => {
            var disID = result.insertId;
            for (var symptom in symptoms) {
                var add_sym_query = mysql.format(add_symptom_sql, [disID, symptoms[symptom]])
                connection.query(add_sym_query);
            }
            connection.release();
        });
    }

    // Number -> Promise(Void)
    // Removes this disease entry and all assocated informaiton
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
            if(result.length === 0) {
                throw new Error("Disease not found");
            }
            var toReturn = {};
            var syms = [];
            for(var i in result) {
                syms.push({symID: result[i].symID});
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
            for(var i in result) {
                if(result[i].id !== last_id) {
                    if(last_id !== undefined) {
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
                cur_disease.symptoms.push({symID: result[i].symID});
            }
            if(cur_disease !== undefined) {
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
            for(var i in result) {
                if(result[i].id !== last_id) {
                    if(last_id !== undefined) {
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
                cur_disease.symptoms.push({symID: result[i].symID});
            }
            if(cur_disease !== undefined) {
                toReturn.push(cur_disease);
            }
            return toReturn;
        });
    }
    

}

module.exports = DiseaseDB