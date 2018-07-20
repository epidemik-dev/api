const express = require('express');

const login = require("../main/login/login.js")
const all_users = require("../main/users/all_users.js")

const user_router = require('../routers/user_router.js');
const disease_router = require('../routers/disease_router.js');
const trend_router = require('../routers/trend_router.js');

const main_route = express.Router();

const auth_helpers = require('../helpers/auth_helpers.js');

main_route.use(auth_helpers.verifyVersion);
// Logs this patient
// Will give back the users authentication token
main_route.post('/login',login.login_user);

// Adds a user to the database
main_route.post("/users", all_users.add_user);

// Sets the router for /users
main_route.use('/users',user_router);

// Sets the router for /diseases
main_route.use('/diseases', disease_router);

// Sets the router for /trends
main_route.use('/trends', trend_router);


module.exports = main_route;