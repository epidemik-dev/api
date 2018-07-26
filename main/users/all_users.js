function add_user(req, res) {
    var deviceID = req.body.deviceID;
    var username = req.body.username;
    var unencrypt_password = req.body.password;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var gender = req.body.gender;
    var dob = req.body.date_of_birth;
    var weight = req.body.weight
    var height = req.body.height
    var does_smoke =  req.body.does_smoke
    var has_hypertension = req.body.has_hypertension
    var has_diabetes = req.body.has_diabetes
    var has_high_cholesterol = req.body.has_high_cholesterol
    if(unencrypt_password === 'password' || unencrypt_password.length < 6 || unencrypt_password.includes(" ") || username.includes(" ") || username.includes("/")) {
        req.http_responses.report_fail_with_message(req, res, "Bad password/username");
        return;
    }
    req.userDB.add_user(deviceID, username, unencrypt_password, latitude, longitude, dob, gender, weight, height, does_smoke, has_hypertension, has_diabetes, has_high_cholesterol).then(token => {
        req.http_responses.report_creation_successful(req, res, token);
    }).catch(error => {
        req.http_responses.report_fail_with_message(req, res, "Username already used");
    })
}

function get_all_users(req, res) {
    req.userDB.get_all_users().then(result => {
        req.http_responses.report_success_with_info(req, res, result);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    })
}

module.exports = {
    add_user: add_user,
    get_all_users: get_all_users
}