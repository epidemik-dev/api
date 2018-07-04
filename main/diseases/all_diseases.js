
function get_diseases(req, res) {
    if(req.query.region == undefined) {
        req.query.region = {
            lat_max: 600,
            lat_min: -600,
            long_max: 600,
            long_min: -600
        }
    } else if(typeof req.query.region !== "object") {
        req.query.region = JSON.parse(req.query.region);
    }
    req.diseaseDB.get_all_diseases(req.query.region.lat_min, req.query.region.lat_max, req.query.region.long_min, req.query.region.long_max).then(result => {
        req.http_responses.report_sucess_with_info(req, res, result);
    }).catch(error => {
        req.http_responses.report_not_found(req, res);
    })
}

module.exports = {
    get_diseases: get_diseases
}