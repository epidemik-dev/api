function login_user(req, res) {
    req.userDB.login_user(req.query.username, req.query.password).then(token => {
        req.http_responses.report_sucess_with_info(req, res, token);
    }).catch(error => {
        req.http_responses.report_not_authorized(req, res);
    });
}

module.exports = {
    login_user: login_user
};