require('dotenv').config();
const mysql = require('promise-mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

var ACL = require('acl');

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

        this.acl = new ACL(new ACL.memoryBackend());
        this.acl.allow('admin', '*', '*') // the admin can do anything

        // Resets the ACL permissions based on the DB entries
        this.load_all_permissions();
    }

    // String String String -> Promise(User)
    // Tests whether the given login info is valid for the given table
    login(username, unencrypt_password) {
        var get_salt_insert = [username];
        var password;
        var connection;
        return this.pool.getConnection().then(con => {
            connection = con
            var get_salt_query = mysql.format(get_user_salt_sql, get_salt_insert);
            return connection.query(get_salt_query)
        }).then(results => {
            if (results.length == 0) {
                connection.release();
                throw new Error("User not found");
            } else {
                var salt = results[0].salt;
                password = bcrypt.hashSync(unencrypt_password, salt);
                var login_insert = [username, password];
                var login_query = mysql.format(verify_user_password_sql, login_insert);
                var res = connection.query(login_query);
                connection.release();
                return res;
            }
        }).then(results => {
            if (results.length == 0) {
                throw new Error("Bad password");
            } else {
                return {
                    token: jwt.sign({
                        data: {
                            username: username,
                            password_hash: password
                        }
                    }, process.env.JWT_SECRET, {
                        expiresIn: '10d'
                    })
                };
            }
        });
    }

    // Any Any Any -> Void
    // Adds these permissions to acl
    allow(user, stuff, able) {
        this.acl.allow(user, stuff, able);
    }

    // Any Any Any -> Void
    // removed these permissions from acl
    removeAllow(user, stuff, able) {
        this.acl.removeAllow(user, stuff, able);
    }

    // Any Any Any Callback -> Void
    // Passes to acl
    isAllowed(user, stuff, able, callback) {
        if (user === 'admin') {
            callback(null, true);
        } else {
            this.acl.isAllowed(user, stuff, able, callback);
        }
    }

    // Any Any -> Void
    // Adds this role
    addUserRoles(name, role) {
        this.acl.addUserRoles(name, role);
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

    // Void -> Promise(Void)
    // When the server is shut down, all permissions are cleared from ACL
    // This method loads them back in based on what is written in the DB
    load_all_permissions() {
        var acl = this.acl;
        return this.pool.getConnection().then(connection => {
            var res = connection.query(get_user_sql);
            connection.release();
            return res;
        }).then((users) => {
            for (var i = 0; i < users.length; i += 1) {
                acl.addUserRoles(users[i].username, users[i].username);
                acl.allow(users[i].username, users[i].username, '*')
            }
        });
    }

    // Resets the ACL storage
    // Void -> Void
    reset_self() {
        this.acl = new ACL(new ACL.memoryBackend());
        this.acl.allow('admin', '*', '*') // the admin can do anything
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