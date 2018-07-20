var ryan_auth_token;
var cole_auth_token;
var brynn_auth_token;
var to_delete_auth_token;
var admin_auth_token;

const chai = require("chai");
var expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);


const get_app = require('../main.js').get_app;
const join = get_app("EPIDEMIK_TEST", false);
const app = join[0];
const reset = join[1];


describe("Resets the database", function () {
    it("should not error", function (done) {
        reset().then(admin_token => {
            admin_auth_token = admin_token;
            done();
        })
    });
});

describe("Adds a user to the database", function () {
    it("should give status 403 if the adding was unsucessful", function (done) {
        chai.request(app)
            .post('/users')
            .query({
                version: "1"
            })
            .send({
                username: 'ryan',
                password: 'as',
                latitude: 0,
                longitude: 0,
                deviceID: "askjndskasjndkjasn",
                date_of_birth: "1999-05-05",
                gender: "Male"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(403);
                ryan_auth_token = res.body;
                done();
            });
    });
    it("should give status 403 if the adding was unsucessful", function (done) {
        chai.request(app)
            .post('/users')
            .query({
                version: "1"
            })
            .send({
                username: 'ryan',
                password: 'password',
                latitude: 0,
                longitude: 0,
                deviceID: "askjndskasjndkjasn",
                date_of_birth: "1999-05-05",
                gender: "Male"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(403);
                ryan_auth_token = res.body;
                done();
            });
    });
    it("should give status 403 if the adding was unsucessful", function (done) {
        chai.request(app)
            .post('/users')
            .query({
                version: "1"
            })
            .send({
                username: '/ryan',
                password: 'godpassword',
                latitude: 0,
                longitude: 0,
                deviceID: "askjndskasjndkjasn",
                date_of_birth: "1999-05-05",
                gender: "Male"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(403);
                ryan_auth_token = res.body;
                done();
            });
    });
    it("should give status 403 if the adding was unsucessful", function (done) {
        chai.request(app)
            .post('/users')
            .query({
                version: "1"
            })
            .send({
                username: 'r yan',
                password: 'godpassword',
                latitude: 0,
                longitude: 0,
                deviceID: "askjndskasjndkjasn",
                date_of_birth: "1999-05-05",
                gender: "Male"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(403);
                ryan_auth_token = res.body;
                done();
            });
    });
    it("should give status 403 if the adding was unsucessful", function (done) {
        chai.request(app)
            .post('/users')
            .query({
                version: "1"
            })
            .send({
                username: 'ryan',
                password: 'bad password',
                latitude: 0,
                longitude: 0,
                deviceID: "askjndskasjndkjasn",
                date_of_birth: "1999-05-05",
                gender: "Male"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(403);
                ryan_auth_token = res.body;
                done();
            });
    });

    it("should give status 201 if the adding was successful", function (done) {
        chai.request(app)
            .post('/users')
            .query({
                version: "1"
            })
            .send({
                username: 'ryan',
                password: 'test_password',
                latitude: 0,
                longitude: 0,
                deviceID: "askjndskasjndkjasn",
                date_of_birth: "1999-05-05",
                gender: "Male"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(201);
                ryan_auth_token = res.body;
                done();
            });
    });

    it("should give status 403 if the adding was unsucessful", function (done) {
        chai.request(app)
            .post('/users')
            .query({
                version: "1"
            })
            .send({
                username: 'ryan',
                password: 'test_password',
                latitude: 0,
                longitude: 0,
                deviceID: "askjndskasjndkjasn",
                date_of_birth: "1999-05-05",
                gender: "Male"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(403);
                done();
            });
    });

    it("should give status 201 if the adding was successful", function (done) {
        chai.request(app)
            .post('/users')
            .query({
                version: "1"
            })
            .send({
                username: 'brynn',
                password: 'godpassword',
                latitude: 1,
                longitude: 1,
                deviceID: "aslknfoi j",
                date_of_birth: "1999-12-03",
                gender: "Female"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(201);
                brynn_auth_token = res.body;
                done();
            });
    });

    it("should give status 201 if the adding was successful", function (done) {
        chai.request(app)
            .post('/users')
            .query({
                version: "1"
            })
            .send({
                username: 'cole',
                password: 'godpassword',
                latitude: 2,
                longitude: 2,
                deviceID: "co msds",
                date_of_birth: "1998-03-12",
                gender: "Male"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(201);
                cole_auth_token = res.body
                done();
            });
    });

    it("should give status 201 if the adding was successful", function (done) {
        chai.request(app)
            .post('/users')
            .query({
                version: "1"
            })
            .send({
                username: 'to_delete',
                password: 'godpassword',
                latitude: 2,
                longitude: 2,
                deviceID: "co msds",
                date_of_birth: "1998-03-12",
                gender: "Male"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(201);
                to_delete_auth_token = res.body;
                done();
            });
    });
});

describe("Login", function () {
    it("should return the auth token if successful", function (done) {
        chai.request(app)
            .post('/login')
            .query({
                version: "1",
                password: "godpassword",
                username: "cole"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                cole_auth_token = res.body;
                done();
            });
    });

    it("should not return the auth token if failed", function (done) {
        chai.request(app)
            .post('/login')
            .query({
                version: "1",
                auth_token: to_delete_auth_token,
                password: "dkjansdkja",
                username: "cole"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });

    it("should not return the auth token if failed", function (done) {
        chai.request(app)
            .post('/login')
            .query({
                version: "1",
                auth_token: to_delete_auth_token,
                password: "dkjansdkja",
                username: "slkdmnaslmd"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });
});

describe("Deletes a user from the system", function () {
    it("should give status 401 if the deletion was unsucessful", function (done) {
        chai.request(app)
            .del('/users/to_delete')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });

    it("should give status 204 if the deletion was successful", function (done) {
        chai.request(app)
            .del('/users/to_delete')
            .query({
                version: "1",
                auth_token: to_delete_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(204);
                done();
            });
    });
});

describe("Add diseases to the system", function () {
    it("should give status 200 if adding is successful", function (done) {
        chai.request(app)
            .post('/users/ryan/diseases')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .send({
                disease_name: 'Common Cold',
                date_sick: '2018-05-20',
                date_healthy: null,
                symptoms: [1, 2, 3]
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it("should give status 200 if adding is successful", function (done) {
        chai.request(app)
            .post('/users/cole/diseases')
            .query({
                version: "1",
                auth_token: cole_auth_token
            })
            .send({
                disease_name: 'Flu',
                date_sick: '2018-05-23',
                date_healthy: null,
                symptoms: [2, 3]
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it("should give status 200 if adding is successful", function (done) {
        chai.request(app)
            .post('/users/brynn/diseases')
            .query({
                version: "1",
                auth_token: brynn_auth_token
            })
            .send({
                disease_name: 'Common Cold',
                date_sick: '2018-05-25',
                date_healthy: null,
                symptoms: [2, 3, 5]
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
});

describe("Delete diseases", function () {
    it("should return status 401 if the deletion is unsucessful", function (done) {
        chai.request(app)
            .delete('/users/ryan/diseases/3')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });

    it("should return status 204 if the deletion is successful", function (done) {
        chai.request(app)
            .delete('/users/brynn/diseases/3')
            .query({
                version: "1",
                auth_token: brynn_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(204);
                done();
            });
    });
});

describe("Mark a disease as healthy", function () {
    it("should give status 204 if the adding is successful", function (done) {
        chai.request(app)
            .patch('/users/cole/diseases')
            .query({
                version: "1",
                auth_token: cole_auth_token,
                date_healthy: '2018-05-25'
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(204);
                done();
            });
    });
});

describe("Change a users password", function () {
    it("should return a different auth token than the one before", function (done) {
        chai.request(app)
            .put('/users/ryan')
            .query({
                version: "1",
                auth_token: ryan_auth_token,
                new_password: 'password_test'
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(202);
                ryan_auth_token = res.body;
                done();
            });
    });
});


describe("Delete symptom", function () {
    it("should give status 204 if successful", function (done) {
        chai.request(app)
            .delete('/users/ryan/diseases/1/symptoms/1')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(204);
                done();
            });
    });
});

describe("Add symptom", function () {
    it("should give status 200 if successful", function (done) {
        chai.request(app)
            .post('/users/ryan/symptoms')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .send({
                symID: 4
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
});

describe("Get symptoms", function () {
    it("should return every symptom this user currently has", function (done) {
        chai.request(app)
            .get('/users/ryan/symptoms')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it("should return every symptom this disease has", function (done) {
        chai.request(app)
            .get('/users/ryan/diseases/1/symptoms')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
});


describe("Get specific disease", function () {
    it("should return all info about this users diseases", function (done) {
        chai.request(app)
            .get('/users/ryan/diseases/1')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it("should not let another user get access", function (done) {
        chai.request(app)
            .get('/users/ryan/diseases/1')
            .query({
                version: "1",
                auth_token: brynn_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });

    it("should not let another user get access", function (done) {
        chai.request(app)
            .get('/users/brynn/diseases/1')
            .query({
                version: "1",
                auth_token: brynn_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });
});

describe("Get all user disease", function () {
    it("should return all info about this users diseases", function (done) {
        chai.request(app)
            .get('/users/cole/diseases')
            .query({
                version: "1",
                auth_token: cole_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it("should return all info about this users diseases", function (done) {
        chai.request(app)
            .get('/users/brynn/diseases')
            .query({
                version: "1",
                auth_token: brynn_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it("should not let another user get access", function (done) {
        chai.request(app)
            .get('/users/brynn/diseases')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });
});

describe("All Users Info", function () {
    it("should return all info about this user", function (done) {
        chai.request(app)
            .get('/users/cole')
            .query({
                version: "1",
                auth_token: cole_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });

    it("should allow the admin", function (done) {
        chai.request(app)
            .get('/users/cole')
            .query({
                version: "1",
                auth_token: admin_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
});

describe("Get all Users", function () {
    it("should return the info for every user", function (done) {
        chai.request(app)
            .get('/users')
            .query({
                version: "1",
                auth_token: admin_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
});

describe("Gets all diseases", function () {
    it("should return the information for every still-sick disease", function (done) {
        chai.request(app)
            .get('/diseases')
            .query({
                version: "1",
                auth_token: ryan_auth_token,
                region: {
                    lat_min: -50,
                    long_min: -50,
                    lat_max: 50,
                    long_max: 50
                }
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
});

describe("Gets all diseases by name", function () {
    it("should return the information for every sick or not sick disease that matches this name", function (done) {
        chai.request(app)
            .get('/diseases/Flu')
            .query({
                version: "1",
                auth_token: ryan_auth_token,
                region: {
                    lat_min: -50,
                    long_min: -50,
                    lat_max: 50,
                    long_max: 50
                }
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
});

describe("Gets all information for a diseases symtoms", function () {
    it("should return a list of all symptoms experienced by people with this disease", function (done) {
        chai.request(app)
            .get('/diseases/Common-Cold/symptoms')
            .query({
                version: "1",
                auth_token: ryan_auth_token,
                region: {
                    lat_min: -50,
                    long_min: -50,
                    lat_max: 50,
                    long_max: 50
                }
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
});

describe("Returns every trend in this users region", function () {
    it("should return the trend info for this users region", function (done) {
        chai.request(app)
            .get('/trends')
            .query({
                version: "1",
                auth_token: admin_auth_token,
                latitude: 2,
                longitude: 2
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
});

describe("Returns the percent of users infected on dates", function () {
    it("should give back the data", function (done) {
        chai.request(app)
            .get('/trends/historical')
            .query({
                version: "1",
                auth_token: admin_auth_token,
                latitude: 2,
                longitude: 2,
                disease_name: "Flu"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
});

describe("Change address", function () {
    it("should change the address of the given user", function (done) {
        chai.request(app)
            .patch('/users/cole')
            .query({
                version: "1",
                auth_token: admin_auth_token,
                latitude: 3.09312,
                longitude: 4.01921321
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(204);
                done();
            });
    });

    it("should not allow other users", function (done) {
        chai.request(app)
            .patch('/users/cole')
            .query({
                version: "1",
                auth_token: ryan_auth_token,
                latitude: 3.09312,
                longitude: 4.01921321
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });
});

describe("Returns the trends for this users region", function () {
    it("should give back the data", function (done) {
        chai.request(app)
            .get('/trends/cole')
            .query({
                version: "1",
                auth_token: admin_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
    it("should not allow other users", function (done) {
        chai.request(app)
            .get('/trends/cole')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });
});

describe("Cannot do anything with a bad version", function () {
    it("should give a bad status if wrong version", function (done) {
        chai.request(app)
            .post('/login')
            .query({
                version: "0.01",
                auth_token: to_delete_auth_token,
                password: "cool",
                username: "cole"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(426);
                done();
            });
    });
});