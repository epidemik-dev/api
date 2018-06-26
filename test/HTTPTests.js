var ryan_auth_token;
var cole_auth_token;
var brynn_auth_token;
var to_delete_auth_token;
var admin_auth_token;

const chai = require("chai");
var expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../index').app;

describe("Resets the database", function () {
    it("should return status 204 if sucessful", function (done) {
        chai.request(app)
            .post('/reset')
            .query({
                auth_token: admin_auth_token
            })
            .send()
            .end(function (err, res) {
                expect(res.status).to.be.equal(204);
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
                expect(res.status).to.be.equal(201);
                expect(res.body.token).to.be.a('string');
                ryan_auth_token = res.body.token;
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
                password: 'password',
                latitude: 1,
                longitude: 1,
                deviceID: "aslknfoi j",
                date_of_birth: "1999-12-03",
                gender: "Female"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(201);
                expect(res.body.token).to.be.a('string');
                brynn_auth_token = res.body.token;
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
                password: 'cool',
                latitude: 2,
                longitude: 2,
                deviceID: "co msds",
                date_of_birth: "1998-03-12",
                gender: "Male"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(201);
                expect(res.body.token).to.be.a('string');
                cole_auth_token = res.body.token
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
                password: 'cool',
                latitude: 2,
                longitude: 2,
                deviceID: "co msds",
                date_of_birth: "1998-03-12",
                gender: "Male"
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(201);
                expect(res.body.token).to.be.a('string');
                to_delete_auth_token = res.body.token;
                done();
            });
    });
});
describe("Deletes a user from the system", function () {
    it("should give status 204 if the deletion was sucessful", function (done) {
        chai.request(app)
            .del('/users/to_delete')
            .query({
                version: "1",
                auth_token: to_delete_auth_token,
                password: "cool"
            })
            .end(function (err, res) {
                console.log(res.text);
                expect(res.status).to.be.equal(204);
                done();
            });
    });
});
/*

describe("Add diseases to the system", function () {
    it("should give status 204 if adding is sucessful", function (done) {
        chai.request(app)
            .post('/users/ryan/diseases')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .send({
                disease_name: 'Common-Cold',
                date_sick: '2018-05-20',
                date_healthy: null,
                symptoms: [1, 2, 3]
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(204);
                done();
            });
    });

    it("should give status 204 if adding is sucessful", function (done) {
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
                expect(res.status).to.be.equal(204);
                done();
            });
    });

    it("should give status 204 if adding is sucessful", function (done) {
        chai.request(app)
            .post('/users/brynn/diseases')
            .query({
                version: "1",
                auth_token: cole_auth_token
            })
            .send({
                disease_name: 'Common-Cold',
                date_sick: '2018-05-25',
                date_healthy: null,
                symptoms: [2, 3, 5]
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(204);
                done();
            });
    });
});

describe("Delete diseases", function () {
    it("should return status 204 if the deletion is sucessful", function (done) {
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
    it("should give status 204 if the adding is sucessful", function (done) {
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
                auth_token: cole_auth_token,
                new_password: 'password_test',
                old_password: 'test_password'
            })
            .end(function (err, res) {
                expect(res.status).to.be.equal(202);
                expect(res.body).to.be.not.equal(ryan_auth_token);
                ryan_auth_token = res.body;
                done();
            });
    });
});

describe("Delete symptom", function () {
    it("should give status 204 if sucessful", function (done) {
        chai.request(app)
            .put('/users/ryan/diseases/1/symptoms/1')
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
    it("should give status 204 if sucessful", function (done) {
        chai.request(app)
            .post('/users/ryan/symptoms')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .send(4)
            .end(function (err, res) {
                expect(res.status).to.be.equal(204);
                done();
            });
    });
});

describe("Get symptoms", function () {
    it("should return every symptom this user currently has", function (done) {
        chai.request(app)
            .gvet('/users/ryan/symptoms')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .end(function (err, res) {
                expect(res.body).to.be.deep.equal([2, 3, 4]);
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
                expect(res.body).to.be.deep.equal([2, 3, 4]);
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
                expect(res.body).to.be.deep.equal({
                    disease_name: 'Common-Cold',
                    date_sick: '2018-05-20',
                    date_healthy: null,
                    symptoms: [1, 2, 3]
                });
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
                auth_token: ryan_auth_token
            })
            .end(function (err, res) {
                expect(res.body).to.be.deep.equal([{
                    disease_name: 'Flu',
                    date_sick: '2018-05-23',
                    date_healthy: '2018-05-25',
                    symptoms: [2, 3]
                }]);
                done();
            });
    });

    it("should return all info about this users diseases", function (done) {
        chai.request(app)
            .get('/users/brynn/diseases')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .end(function (err, res) {
                expect(res.body).to.be.deep.equal([]);
                done();
            });
    });
});

describe("All Users Info", function () {
    it("should return all info about this user", function () {
        chai.request(app)
            .get('/users/cole')
            .query({
                version: "1",
                auth_token: cole_auth_token
            })
            .end(function (err, res) {
                expect(res.body).to.be.deep.equal({
                    username: "cole",
                    latitude: 2,
                    longitude: 2,
                    deviceID: "co msds",
                    date_of_birth: "1998-03-12",
                    gender: "Male",
                    diseases: [{
                        disease_name: 'Flu',
                        date_sick: '2018-05-23',
                        date_healthy: '2018-05-25',
                        symptoms: [2, 3]
                    }]
                });
                done();
            });
    });
});

describe("Get all Users", function () {
    it("should return the info for every user", function () {
        chai.request(app)
            .get('/users')
            .query({
                version: "1",
                auth_token: admin_auth_token
            })
            .end(function (err, res) {
                expect(res.body).to.be.deep.equal(
                    [{
                            username: "cole",
                            latitude: 2,
                            longitude: 2,
                            deviceID: "co msds",
                            date_of_birth: "1998-03-12",
                            gender: "Male",
                            diseases: [{
                                disease_name: 'Flu',
                                date_sick: '2018-05-23',
                                date_healthy: '2018-05-25',
                                symptoms: [2, 3]
                            }]
                        },
                        {
                            username: "brynn",
                            latitude: 1,
                            longitude: 1,
                            deviceID: "aslknfoi j",
                            date_of_birth: "1999-12-03",
                            gender: "Female",
                            diseases: [{}]
                        },
                        {
                            username: "ryan",
                            latitude: 0,
                            longitude: 0,
                            deviceID: "askjndskasjndkjasn",
                            date_of_birth: "1999-05-05",
                            gender: "Male",
                            diseases: [{
                                disease_name: 'Common-Cold',
                                date_sick: '2018-05-20',
                                date_healthy: null,
                                symptoms: [1, 2, 3]
                            }]
                        }
                    ]);
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
                auth_token: admin_auth_token,
                region: {
                    latMin: -50,
                    longMin: -50,
                    latMax: 50,
                    longMax: 50
                }
            })
            .end(function (err, res) {
                expect(res.body).to.be.deep.equal(
                    [{
                        disease_name: 'Common-Cold',
                        date_sick: '2018-05-20',
                        date_healthy: null,
                        symptoms: [1, 2, 3]
                    }]
                )
            });
    });
});

describe("Gets all diseases by name", function () {
    it("should return the information for every sick or not sick disease that matches this name", function (done) {
        chai.request(app)
            .get('/diseases/Flu')
            .query({
                version: "1",
                auth_token: admin_auth_token,
                region: {
                    latMin: -50,
                    longMin: -50,
                    latMax: 50,
                    longMax: 50
                }
            })
            .end(function (err, res) {
                expect(res.body).to.be.deep.equal(
                    [{
                        disease_name: 'Flu',
                        date_sick: '2018-05-23',
                        date_healthy: '2018-05-25',
                        symptoms: [2, 3]
                    }]
                )
            });
    });
});

describe("Gets all information for a diseases symtoms", function () {
    it("should return a list of all symptoms experienced by people with this disease", function (done) {
        chai.request(app)
            .get('/diseases/Common-Cold')
            .query({
                version: "1",
                auth_token: admin_auth_token,
                region: {
                    latMin: -50,
                    longMin: -50,
                    latMax: 50,
                    longMax: 50
                }
            })
            .end(function (err, res) {
                expect(res.body).to.be.deep.equal(
                    [
                        [2, 3, 4]
                    ]
                )
            });
    });
});

describe("Returns every trend in this users region", function () {
    it("should return the trend info for this users region", function(done) {
        chai.request(app)
        .get('/trends')
        .query({
            version: "1",
            auth_token: admin_auth_token,
            region: {
                latMin: -50,
                longMin: -50,
                latMax: 50,
                longMax: 50
            }
        })
        .end(function (err, res) {
            expect(res.body).to.be.deep.equal([])
        });
    });
});

*/