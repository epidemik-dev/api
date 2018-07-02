function delete_user(req, res) {
    req.userDB.delete_user(req.params.userID).then(() => {
        req.http_responses.report_sucess_no_info(req, res);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    });
}

function change_password(req, res) {
    req.userDB.change_password(req.params.userID, req.query.new_password).then(token => {
        req.http_responses.report_accepted(req, res, {
            token: token
        });
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    })
}

function get_info(req, res) {
    req.userDB.get_specific_user_info(req.params.userID).then(result => {
        req.http_responses.report_sucess_with_info(req, res, result);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    })
}

function change_address(req, res) {
    req.userDB.change_address(req.params.userID, req.query.latitude, req.query.longitude).then(result => {
        req.http_responses.report_sucess_no_info(req, res);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    });
}

module.exports = {
    delete_user: delete_user,
    change_password: change_password,
    get_info: get_info,
    change_address: change_address
}