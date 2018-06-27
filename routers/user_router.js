const express = require('express');

const auth_helpers = require('../helpers/auth_helpers.js')

const single_user = require('../main/users/id/single_user.js')

const user_route = express.Router();

user_route.use(auth_helpers.verifyJWT);

// If these params are present, these helpers should be run
user_route.param('userID', auth_helpers.canViewUser)

user_route.delete('/:userID', single_user.delete_user)

module.exports = user_route;