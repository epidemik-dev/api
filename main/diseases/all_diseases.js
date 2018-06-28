
function get_diseases(req, res) {
    req.diseaseDB.get_all_diseases(req.query.region.latMin, req.query.region.latMax, req.query.region.longMin, req.query.region.longMax).then(result => {
        req.http_responses.report_sucess_with_info(req, res, result);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    })
}

module.exports = {
    get_diseases: get_diseases
}