function get_all_trends(req, res) {
    try {
        req.trendDB.get_trend_entries(req.query.latitude, req.query.longitude, result => {
            req.http_responses.report_sucess_with_info(req, res, result);
        });
    } catch (error) {
        throw error;
        req.http_responses.report_not_found(req, res);
    }
}

module.exports = {
    get_all_trends: get_all_trends
}