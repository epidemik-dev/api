// Says whether the given user can view the given patientID
function canViewUser(req, res, next) {
    req.authDB.isAllowed(req.verified, req.params.userID, 'view', function (err, can_view) {
        if (can_view) {
            next();
        } else {
            req.http_responses.report_not_authorized(req, res);
        }
    });
}

// Says whether the given user can edit the given patientID
function canEditUser(req, res, next) {
    req.authDB.isAllowed(req.verified, req.params.userID, 'edit', function (err, can_view) {
        if (can_view) {
            next();
        } else {
            req.http_responses.report_not_authorized(req, res);
        }
    });
}

function hasAdminPriv(req, res, next) {
    if(req.verified === 'admin') {
        next();
    } else {
        req.http_responses.report_not_authorized(req, res);
    }
}


// Vefifies the JWT and writes the info to the req
function verifyJWT(req, res, next) {
    req.authDB.verifyJWT(req).then(verified => {
        req.verified = verified;
        next();
    }).catch(error => {
        req.http_responses.report_bad_token(req, res);
    });
}

function verifyVersion(req, res, next) {
    if(req.query.version === "0.01") {
        req.http_responses.report_bad_version(req, res);
    } else {
        next();
    }
}

function canViewDisease(req, res, next) {
    if(req.verified === "admin") {
        next();
        return;
    }
    req.authDB.can_view_disease(req.params.userID, req.params.diseaseID).then(result => {
        next();
    }).catch(error => {
        req.http_responses.report_not_authorized(req, res);
    });
}

module.exports = {
    verifyJWT: verifyJWT,
    canViewUser: canViewUser,
    canEditUser: canEditUser,
    verifyVersion: verifyVersion,
    hasAdminPriv: hasAdminPriv,
    canViewDisease: canViewDisease
}