function add_disease(req, res) {
    var date_sick = req.body.date_sick;
    var date_healthy = req.body.date_healthy;
    var username = req.params.userID;
    var symptoms = req.body.symptoms;
    var disease_name = null;
    if(req.body.disease_name != undefined) {
        disease_name = req.body.disease_name;
    }
    req.diseaseDB.add_disease(disease_name, date_sick, date_healthy, username, symptoms).then(result => {
        for(var i in result) {
            result[i].disease_name = result[i].disease_name.replace("-", " ");
        }
        req.http_responses.report_success_with_info(req, res, result);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    });
}

function mark_healthy(req, res) {
    req.diseaseDB.mark_healthy(req.query.date_healthy, req.params.userID).then(result => {
        req.http_responses.report_success_no_info(req, res);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    })
}

function get_all_disease(req, res) {
    req.diseaseDB.get_all_disease_for(req.params.userID).then(result => {
        req.http_responses.report_success_with_info(req, res, result);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    })
}

function delete_healthy(req, res) {
    req.diseaseDB.delete_healthy_diseases(req.params.userID).then(result => {
        req.http_responses.report_success_no_info(req, res);
    }).catch(error => {
        throw error;
        req.http_responses.report_not_found(req, res);
    })
}

module.exports = {
    add_disease: add_disease,
    mark_healthy: mark_healthy,
    get_all_disease: get_all_disease,
    delete_healthy: delete_healthy
}