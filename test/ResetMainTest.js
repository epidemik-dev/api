const get_app = require('../main.js').get_app;
const join = get_app("EPIDEMIK");
const app = join[0];
const reset = join[1];
/*
describe("Resets the database", function () {
    it("should not error", function (done) {
        reset().then(admin_token => {
            admin_auth_token = admin_token;
            done();
        })
    });
});

*/