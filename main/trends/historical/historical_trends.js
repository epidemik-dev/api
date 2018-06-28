function get_historical_trends(req, res) {
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;
    var disease_name = req.query.disease_name;
    req.trendDB.get_historical_trends(latitude, longitude, disease_name).then(result => {
        req.http_responses.report_sucess_with_info(req, res, result);
    }).catch(error => {
        throw error;
        req.http_responses.report_not_found(req, res);
    })
}

module.exports = {
    get_historical_trends: get_historical_trends
}