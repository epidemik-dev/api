require('dotenv').config();
const mysql = require('promise-mysql');

const get_all_disease_names_sql =
    `SELECT DISTINCT disease_name 
FROM DISEASE d, USER u 
WHERE u.username = d.username 
AND ? = u.latitude AND ? = u.longitude`
const get_number_of_users_on_dates_sql =
    `SELECT COUNT(*) as number,lod.date_reg as time
FROM 
(SELECT DISTINCT date_reg FROM USER ORDER BY date_reg) lod, 
USER u 
WHERE lod.date_reg >= u.date_reg 
AND ? = u.latitude 
AND ? = u.longitude 
GROUP BY lod.date_reg`
const get_number_of_infections_on_dates_sql =
    `SELECT COUNT(*) as number,lod.date as time
FROM (SELECT DISTINCT date FROM DISEASE WHERE disease_name = ? ORDER BY DATE) lod,
DISEASE d, USER u
WHERE lod.date >= d.date AND lod.date <= d.date_healthy
AND u.username = d.username 
AND d.disease_name = ?
AND ? = u.latitude AND ? = u.longitude
GROUP BY lod.date`
const get_user_cords =
    `SELECT latitude, longitude 
FROM USER 
WHERE username = ?`;

class TrendDB {

    constructor(db_name) {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: db_name
        });
    }

    // Number Number (List-of Trend] -> Void) -> Void
    // Returns the trend in this region
    // One for every disease
    get_trend_entries(lat, long, callback) {
        lat = Number(lat) - Number(lat % process.env.ERR_RANGE) + Number(process.env.ERR_RANGE);
        long = Number(long) - Number(long % process.env.ERR_RANGE) + Number(process.env.ERR_RANGE);
        this.pool.getConnection().then(connection => {
            get_trend_entries_help(lat, long, callback, connection);
        });
    }

    // String (List-of Trend] -> Void) -> Void
    // Returns the trend in this users region
    // One for every disease
    get_user_trend_entries(username, callback) {
        var connection;
        var get_cords_query = mysql.format(get_user_cords, [username]);
        this.pool.getConnection().then(con => {
            connection = con;
            return connection.query(get_cords_query)
        }).then(cords => {
            get_trend_entries_help(cords[0].latitude, cords[0].longitude, callback, connection);
        });
    }

    // String -> Promise([List-of {date: Date, percent: Number}])
    // Returns the percent of people infected with this disease over time
    get_historical_trends(lat, long, disease_name) {
        return this.pool.getConnection().then(connection => {
            var res = Promise.all([get_historical_number_of_users(lat, long, connection),
                get_historical_number_of_infections(lat, long, disease_name, connection)])
                connection.release();
            return res;
        }).then(([users, infections]) => {
            console.log(users, infections);
            return get_percent_infected(users, infections);
        })
    }
}

// Number Number (List-of Trend] -> Void) Connection -> Void
// Returns the trend in this region
// One for every disease
function get_trend_entries_help(lat, long, callback, connection) {
    var disease_names_query = mysql.format(get_all_disease_names_sql, [lat, long]);
    var toReturn = [];
    connection.query(disease_names_query).then(diseases => {
        if (diseases.length == 0) {
            callback([]);
        }
        for (var a in diseases) {
            (function (i) {
                var disease = diseases[i];
                Promise.all([get_historical_number_of_users(lat, long, connection),
                    get_historical_number_of_infections(lat, long, disease.disease_name, connection)
                ]).then(([users, infections]) => {
                    var percent_infected = get_percent_infected(users, infections, get_user_count_on);
                    var trend = calculate_trend(percent_infected);
                    toReturn.push({
                        latitude: Number(lat),
                        longitude: Number(long),
                        trend_weight: trend,
                        disease_name: disease.disease_name
                    });
                    if (i == diseases.length - 1) {
                        connection.release();
                        callback(toReturn);
                    }
                });
            })(a)
        }
    });
}

// Number Number Connection -> Promise([List-of {number: Number, time: Date}])
// Returns the number of users in an area over time
function get_historical_number_of_users(lat, long, connection) {
    var user_query = mysql.format(get_number_of_users_on_dates_sql, [lat, long]);
    return connection.query(user_query);
}

// Number Number String Connection -> Promise([List-of {number: Number, time: Date}])
// Returns the number of infections for a given disease
// in an area over time
function get_historical_number_of_infections(lat, long, disease_name, connection) {
    var infections_query = mysql.format(get_number_of_infections_on_dates_sql, [disease_name, disease_name, lat, long]);
    return connection.query(infections_query);
}

// [List-of {number: Number, time: Date}] [List-of {number: Number, time: Date}] -> [List-of Number]
// Returns a list of how many users are infected on dates
function get_percent_infected(users, infections) {
    var toReturn = [];
    for (let infection of infections) {
        let user_counts = get_user_count_on(users, infection.time);
        toReturn.push({
            percent: infection.number / user_counts,
            date: infection.time
        });
    }
    return toReturn;
}

// [List-of {number: Number, time: Date}] Date -> Int
// Returns the number of users in the area on the given date
function get_user_count_on(user_counts, date) {
    for (var i = 0; i < user_counts.length - 1; i++) {
        if (date > user_counts[i].time && date < user_counts[i + 1].time) {
            return user_counts[i].number
        }
    }
    return 1;
}

// [List-of Number] -> Number
// Returns the trend weight for the given disease
// in the currnet location
function calculate_trend(percent_infected) {
    var average_infection = 0;
    for (let percent of percent_infected) {
        average_infection += percent.percent;
    }
    average_infection /= percent_infected.length;
    average_infection *= 5 / 8;
    var weight = 1;
    for (let percent of percent_infected) {
        let dif = percent.percent - average_infection;
        if (dif >= 0) {
            weight = Math.min(weight + Math.pow(weight, dif), 100);
        } else {
            weight = Math.max(weight - Math.pow(weight, -dif), 1);
        }
    }
    return weight;
}

module.exports = TrendDB