require('dotenv').config();
const mysql = require('promise-mysql');

const add_disease_sql = "INSERT INTO DISEASE_POINTS (disease_name, date, date_healthy, username) VALUES (?, ?, ?, ?)";
const add_symptom_sql = "INSERT INTO DISSYM VALUES (?, ?)";

const delete_disease_sym_sql = "DELETE FROM DISSYM WHERE diseaseID = ?";
const delete_disease_sql = "DELETE FROM DISEASE_POINTS WHERE id = ?";

const am_healthy_sql = "UPDATE DISEASE_POINTS SET date_healthy = ? WHERE date_healthy IS NULL AND username = ?";

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
                var add_sym_query = mysql.format(add_symptom_sql, [disID, symptom])
                connection.query(add_sym_query);
            }
            connection.release();
        });
    }

    // Number -> Promise(Void)
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
    mark_healthy(date_healthy, username) {
        var am_healthy_query = mysql.format(am_healthy_sql, [date_healthy, username]);
        return this.pool.getConnection().then(connection => {
            var res = connection.query(am_healthy_query);
            connection.release();
            return res;
        });
    }

}

module.exports = DiseaseDB