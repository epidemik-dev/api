function is_user_sick(req, res) {
    req.userDB.is_user_sick(req.params.userID).then(result => {
        if(result) {
            req.http_responses.report_sucess_with_info(req, res, true);
        } else {
            req.http_responses.report_sucess_with_info(req, res, false);
        }
    }).catch(error => {
        req.http_responses.report_not_authorized(req, res);
    })
}

module.exports = {
    is_user_sick: is_user_sick
}