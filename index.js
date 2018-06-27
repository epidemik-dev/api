/******************************LOAD REQUIRED FILES****************************/
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const path = require('path');
const UserDB = require('./database/UserDB.js');
const DiseaseDB = require('./database/DiseaseDB.js');
const AuthDB = require('./database/AuthDB.js');
const TrendDB = require('./database/TrendDB.js');
const ResetDB = require('./database/ResetDB.js');
const http_responses = require('./helpers/http-responses.js'); // The file that handles sending the actual info 
const main_router = require('./routers/main_router.js'); // The main router file that delegates to every sub URL

/******************************CREATE THE DATABASES****************************/
// The database used to authenticate transactions
const authDB = new AuthDB('EPIDEMIK_TEST');
// The db used to change stuff related to users
const userDB = new UserDB('EPIDEMIK_TEST');
// The db used to change stuf related to diseases
const diseaseDB = new DiseaseDB('EPIDEMIK_TEST');
// The db used to change stuf related to trends
const trendDB = new TrendDB("EPIDEMIK_TEST");
// The db used to reset the app
const resetDB = new ResetDB("EPIDEMIK_TEST")
/****************************BEGIN DOING STUFF TO THE EXPRESS APP***************************/
const app = express();


// Sets the path or something (???)
app.use(express.static(path.join(__dirname, 'public')));

// Gives express the ability to parse JSON
app.use(bodyParser.json());

// Gives the ability to read cookies (for auth_token from browser)
app.use(cookieParser())

// Gives express the ability to parse query parameters
app.use(bodyParser.urlencoded({
    extended: true
}));

// Loads all the DB/helpers to the Req
app.use(function (req, res, next) {
    req.userDB = userDB;
    req.diseaseDB = diseaseDB;
    req.trendDB = trendDB;
    req.authDB = authDB;
    req.http_responses = http_responses;
    next();
})

app.use('/', main_router);

app.listen(3000, () => console.log('WHAM listening on port 3000!'));

/************************STUFF FOR TESTING PURPOSES**********************************/

// Void -> Promise(Void)
function reset() {
    return resetDB.reset_db();
}

module.exports = {
    app: app,
    reset: reset
}; // for testing with chai