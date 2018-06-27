function delete_user(req, res) {
    req.userDB.delete_user(req.params.userID).then(() => {
        req.http_responses.report_sucess_no_info(req, res);
    }).catch(error => {
        throw error;
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

module.exports = {
    delete_user: delete_user,
    change_password: change_password
}