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
const diagnose = join[2];
const disease_information= require('../helpers/disease_helpers.js').disease_information;

describe("Diagnosis", function () {
    describe("Resets the database", function () {
        it("should not error", function (done) {
            reset().then(admin_token => {
                admin_auth_token = admin_token;
                done();
            })
        });
    });

    describe("Add diagnosis data", function () {
        it("should not error", function (done) {
            diagnose().then(() => {
                expect(1).to.be.equal(1);
                done();
            });
        });

        it("should not error", function (done) {
            diagnose().then(() => {
                expect(1).to.be.equal(1);
                done();
            });
        });
    });

    describe("Adds a user to the database", function () {
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
                    username: 'brynn',
                    password: 'godpassword',
                    latitude: 1,
                    longitude: 1,
                    deviceID: "aslknfoi j",
                    date_of_birth: "1999-12-03",
                    gender: "Female"
                })
                .end(function (err, res) {
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
                    to_delete_auth_token = res.body;
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
                    date_sick: '2018-05-20',
                    date_healthy: null,
                    symptoms: [1, 2, 3]
                })
                .end(function (err, res) {
                    expect(res.body[0].disease_name).to.be.equal("Common Cold");
                    done();
                });
        });
    });

    describe("Mark a disease as healthy", function () {
        it("should give status 204 if the adding is successful", function (done) {
            chai.request(app)
                .patch('/users/ryan/diseases')
                .query({
                    version: "1",
                    auth_token: ryan_auth_token,
                    date_healthy: '2018-05-25'
                })
                .end(function (err, res) {
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
                    date_sick: '2018-05-20',
                    date_healthy: null,
                    symptoms: []
                })
                .end(function (err, res) {
                    expect(res.body.length).to.be.equal(0);
                    done();
                });
        });
    });

    describe("Mark a disease as healthy", function () {
        it("should give status 204 if the adding is successful", function (done) {
            chai.request(app)
                .patch('/users/ryan/diseases')
                .query({
                    version: "1",
                    auth_token: ryan_auth_token,
                    date_healthy: '2018-05-25'
                })
                .end(function (err, res) {
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
                    date_sick: '2018-05-20',
                    date_healthy: null,
                    symptoms: [13, 14, 15]
                })
                .end(function (err, res) {
                    expect(res.body[0].disease_name).to.be.equal("Staph Infection");
                    done();
                });
        });
    });

    describe("Mark a disease as healthy", function () {
        it("should give status 204 if the adding is successful", function (done) {
            chai.request(app)
                .patch('/users/ryan/diseases')
                .query({
                    version: "1",
                    auth_token: ryan_auth_token,
                    date_healthy: '2018-05-25'
                })
                .end(function (err, res) {
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
                    date_sick: '2018-05-20',
                    date_healthy: null,
                    symptoms: [20, 21, 6, 22, 19, 2, 5, 7, 18]
                })
                .end(function (err, res) {
                    expect(res.body[0].disease_name).to.be.equal("Strep Throat");
                    done();
                });
        });
    });

    describe("Get disease info", function() {
        it("should give status 200 if the disease was found", function (done) {
            chai.request(app)
                .get('/diseases/Common-Cold/information')
                .query({
                    version: "1",
                    auth_token: ryan_auth_token
                })
                .end(function (err, res) {
                    expect(res.body).to.be.deep.equal(disease_information["common cold"]);
                    done();
                });
        });

        it("should give the default if the disease was not found", function (done) {
            chai.request(app)
                .get('/diseases/unknown/information')
                .query({
                    version: "1",
                    auth_token: ryan_auth_token
                })
                .end(function (err, res) {
                    expect(res.body).to.be.deep.equal(disease_information["default"]);
                    done();
                });
        });

        it("should overwrite the disease name if not found", function (done) {
            chai.request(app)
                .get('/diseases/unknown2/information')
                .query({
                    version: "1",
                    auth_token: ryan_auth_token
                })
                .end(function (err, res) {
                    expect(res.body.disease_name).to.be.equal("unknown2");
                    done();
                });
        });
    });

});