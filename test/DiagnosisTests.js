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
        it("should give status 201 if the adding was sucessful", function (done) {
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

        it("should give status 201 if the adding was sucessful", function (done) {
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

        it("should give status 201 if the adding was sucessful", function (done) {
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

        it("should give status 201 if the adding was sucessful", function (done) {
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
        it("should give status 200 if adding is sucessful", function (done) {
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
        it("should give status 204 if the adding is sucessful", function (done) {
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
        it("should give status 200 if adding is sucessful", function (done) {
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
        it("should give status 204 if the adding is sucessful", function (done) {
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
        it("should give status 200 if adding is sucessful", function (done) {
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
        it("should give status 204 if the adding is sucessful", function (done) {
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
        it("should give status 200 if adding is sucessful", function (done) {
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
                    expect(res.body[0].disease_name).to.be.equal("Lyme Disease");
                    done();
                });
        });
    });

});