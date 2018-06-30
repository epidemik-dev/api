function add_user(req, res) {
    console.log(req);
    var deviceID = req.body.deviceID;
    var username = req.body.username;
    var unencrypt_password = req.body.password;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var gender = req.body.gender;
    var dob = req.body.date_of_birth;
    if(unencrypt_password === 'password' || unencrypt_password.length < 8 || unencrypt_password.includes(" ") || username.includes(" ") || username.includes("/")) {
        req.http_responses.report_fail_with_message(req, res, "Bad password/username");
        return;
    }
    req.userDB.add_user(deviceID, username, unencrypt_password, latitude, longitude, dob, gender).then(token => {
        req.authDB.addUserRoles(username, username)
        req.authDB.allow(username, username, '*') // this user can do anything to themselves they want
        req.http_responses.report_creation_sucessful(req, res, {
            token: token
        })
    }).catch(error => {
        req.http_responses.report_fail_with_message(req, res, "Username already used");
    })
}

function get_all_users(req, res) {
    req.userDB.get_all_users().then(result => {
        req.http_responses.report_sucess_with_info(req, res, result);
    }).catch(error => {
        throw error;
        req.http_responses.report_not_found(req, res);
    })
}

module.exports = {
    add_user: add_user,
    get_all_users: get_all_users
}