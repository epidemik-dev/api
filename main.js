function get_app(db_name, should_start) {

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
    const authDB = new AuthDB(db_name);
    // The db used to change stuff related to users
    const userDB = new UserDB(db_name);
    // The db used to change stuf related to diseases
    const diseaseDB = new DiseaseDB(db_name);
    // The db used to change stuf related to trends
    const trendDB = new TrendDB(db_name);
    // The db used to reset the app
    const resetDB = new ResetDB(db_name, userDB)
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

    if(should_start) {
        app.listen(3000, () => console.log('Epidemik listening on port 3000' + " with Database " + db_name));
    }
    /************************STUFF FOR TESTING PURPOSES**********************************/

    // Void -> Promise(Void)
    function reset() {
        return resetDB.reset_db();
    }

    // Void -> Promise(Void)
    // Adds all the disease to the database used for diagnosis
    function add_diagnosis_diseases() {
        return diseaseDB.add_diagnosis_diseases();
    }

    return [app, reset, add_diagnosis_diseases];
}


module.exports = {
    get_app: get_app
}; // for testing with chai