// A Helper class that every HTTP method should delegate its responses to 
// Created to give a single point of control for things like changing error messages and 
// response codes. 


// Req Res -> Void
// Sends the message to the user that their auth token
// is either a fake or expired (or some other reason that it couldn't be verified)
function report_bad_token(req, res) {
    report_status(res, 403)
    res.end(JSON.stringify("Bad Authorization Token"));
}

// Req Res -> Void
// Sends the message to the user that the content they 
// are trying to view does not exist
function report_not_found(req, res) {
    report_status(res, 403);
    res.end();
}

// Req Res -> Void
// Tells the user that the request is not supported
function report_request_not_supported(req, res) {
    report_status(res, 403);
    res.end(JSON.stringify("Request not supported"));
}

// Req Res -> Void
// Tells the user that their query succeeded 
// but we have nothing to give back
function report_success_no_info(req, res) {
    report_status(res, 204);
    res.end();
}

// Req Res Object -> Void
// Tells the user that their query succeeded 
// and we have something to give back
function report_success_with_info(req, res, info) {
    report_status(res, 200);
    res.end(JSON.stringify(info));
}

// Req Res String -> Void
// Gives error 403 with error: message
function report_fail_with_message(req, res, message) {
    report_status(res, 403);
    res.end(JSON.stringify(message));
}

function report_creation_successful(req, res, info) {
    report_status(res, 201);
    res.end(JSON.stringify(info));
}

function report_accepted(req, res, info) {
    report_status(res, 202);
    res.end(JSON.stringify(info));
}

function report_not_authorized(req, res) {
    report_status(res, 401);
    res.end(JSON.stringify("Not authorized"));
}

function report_bad_version(req, res) {
    report_status(res, 426);
    res.end(JSON.stringify("Version out of date"));
}

function report_status(res, status_code) {
    res.writeHead(status_code, {
        "Content-Type": "application/json"
    });
}

module.exports = {
    report_not_authorized: report_not_authorized,
    report_bad_token: report_bad_token,
    report_not_found: report_not_found,
    report_request_not_supported: report_request_not_supported,
    report_success_no_info: report_success_no_info,
    report_success_with_info: report_success_with_info,
    report_fail_with_message: report_fail_with_message,
    report_creation_successful: report_creation_successful,
    report_accepted: report_accepted,
    report_bad_version: report_bad_version
};