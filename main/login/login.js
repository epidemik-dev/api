function login_user(req, res) {
    try {
        req.userDB.login_user(req.query.username, req.query.password, function (token) {
            if(token === false) {
                req.http_responses.report_not_authorized(req, res);
            } else {
                req.http_responses.report_sucess_with_info(req, res, token);
            }
        });
    } catch {
        req.http_responses.report_not_authorized(req, res);
    }
}
module.exports = {
    login_user: login_user
};