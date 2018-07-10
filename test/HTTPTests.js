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
            expect(admin_auth_token).to.be.a('string');
            done();
        })
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
                expect(res.body).to.be.a('string');
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
                expect(res.body).to.be.a('string');
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
                expect(res.body).to.be.a('string');
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
                expect(res.body).to.be.a('string');
                to_delete_auth_token = res.body;
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
                done();
            });
    });
});

describe("Add diseases to the system", function () {
    it("should give status 204 if adding is sucessful", function (done) {
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
                done();
            });
    });

    it("should give status 204 if adding is sucessful", function (done) {
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
                done();
            });
    });
});

describe("Detect sickness", function() {
    it("should give false if the user is sick", function(done) {
        chai.request(app)
            .get('/users/cole/sickness')
            .query({
                version: "1",
                auth_token: cole_auth_token
            })
            .end(function (err, res) {
                expect(res.body).to.be.equal(false);
                done();
            });
    });

    it("should give true if the user is sick", function(done) {
        chai.request(app)
            .get('/users/ryan/sickness')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .end(function (err, res) {
                expect(res.body).to.be.equal(true);
                done();
            });
    });
})

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
                expect(res.body).to.be.not.equal(ryan_auth_token);
                ryan_auth_token = res.body;
                done();
            });
    });
});


describe("Delete symptom", function () {
    it("should give status 204 if sucessful", function (done) {
        chai.request(app)
            .delete('/users/ryan/diseases/1/symptoms/1')
            .query({
                version: "1",
                auth_token: ryan_auth_token
            })
            .end(function (err, res) {
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
            .send({
                symID: 4
            })
            .end(function (err, res) {
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
                expect(res.body).to.be.deep.equal([{
                    symID: 2
                }, {
                    symID: 3
                }, {
                    symID: 4
                }]);
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
                expect(res.body).to.be.deep.equal([{
                    symID: 2
                }, {
                    symID: 3
                }, {
                    symID: 4
                }]);
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
                    disease_name: 'Common Cold',
                    date_sick: '2018-05-20T04:00:00.000Z',
                    date_healthy: null,
                    symptoms: [{
                        symID: 2
                    }, {
                        symID: 3
                    }, {
                        symID: 4
                    }]
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
                auth_token: cole_auth_token
            })
            .end(function (err, res) {
                expect(res.body).to.be.deep.equal([{
                    latitude: "2",
                    longitude: "2",
                    disease_name: 'Flu',
                    date_sick: '2018-05-23T04:00:00.000Z',
                    date_healthy: '2018-05-25T04:00:00.000Z',
                    symptoms: [{
                        symID: 2
                    }, {
                        symID: 3
                    }]
                }]);
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
                expect(res.body).to.be.deep.equal([]);
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
                expect(res.body).to.be.deep.equal({
                    latitude: 2,
                    longitude: 2,
                    date_of_birth: "1998-03-12T05:00:00.000Z",
                    gender: "Male",
                    diseases: [{
                        disease_name: 'Flu',
                        date_sick: '2018-05-23T04:00:00.000Z',
                        date_healthy: '2018-05-25T04:00:00.000Z',
                        symptoms: [{
                            symID: 2
                        }, {
                            symID: 3
                        }]
                    }]
                });
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
                expect(res.body).to.be.deep.equal(
                    [{
                            latitude: 1,
                            longitude: 1,
                            date_of_birth: "1999-12-03T05:00:00.000Z",
                            gender: "Female",
                            diseases: []
                        },
                        {
                            latitude: 2,
                            longitude: 2,
                            date_of_birth: "1998-03-12T05:00:00.000Z",
                            gender: "Male",
                            diseases: [{
                                disease_name: 'Flu',
                                date_sick: '2018-05-23T04:00:00.000Z',
                                date_healthy: '2018-05-25T04:00:00.000Z',
                                symptoms: [{
                                    symID: 2
                                }, {
                                    symID: 3
                                }]
                            }]
                        },
                        {
                            latitude: 0.01,
                            longitude: 0.01,
                            date_of_birth: "1999-05-05T04:00:00.000Z",
                            gender: "Male",
                            diseases: [{
                                disease_name: 'Common Cold',
                                date_sick: '2018-05-20T04:00:00.000Z',
                                date_healthy: null,
                                symptoms: [{
                                    symID: 2
                                }, {
                                    symID: 3
                                }, {
                                    symID: 4
                                }]
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
                    lat_min: -50,
                    long_min: -50,
                    lat_max: 50,
                    long_max: 50
                }
            })
            .end(function (err, res) {
                expect(res.body).to.be.deep.equal(
                    [{
                        latitude: "0.01",
                        longitude: "0.01",
                        disease_name: 'Common Cold',
                        date_sick: '2018-05-20T04:00:00.000Z',
                        date_healthy: null,
                        symptoms: [{
                            symID: 2
                        }, {
                            symID: 3
                        }, {
                            symID: 4
                        }]
                    }]
                )
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
                auth_token: admin_auth_token,
                region: {
                    lat_min: -50,
                    long_min: -50,
                    lat_max: 50,
                    long_max: 50
                }
            })
            .end(function (err, res) {
                expect(res.body).to.be.deep.equal(
                    [{
                        disease_name: 'Flu',
                        date_sick: '2018-05-23T04:00:00.000Z',
                        date_healthy: '2018-05-25T04:00:00.000Z',
                        symptoms: [{
                            symID: 2
                        }, {
                            symID: 3
                        }]
                    }]
                )
                done();
            });
    });
});

describe("Gets all information for a diseases symtoms", function () {
    it("should return a list of all symptoms experienced by people with this disease", function (done) {
        chai.request(app)
            .get('/diseases/Common Cold/symptoms')
            .query({
                version: "1",
                auth_token: admin_auth_token,
                region: {
                    lat_min: -50,
                    long_min: -50,
                    lat_max: 50,
                    long_max: 50
                }
            })
            .end(function (err, res) {
                expect(res.body).to.be.deep.equal(
                    [
                        [{
                            symID: 2
                        }, {
                            symID: 3
                        }, {
                            symID: 4
                        }]
                    ]
                )
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
                expect(res.body).to.be.deep.equal([{
                    disease_name: "Flu",
                    latitude: 2,
                    longitude: 2,
                    trend_weight: 2
                }])
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
                expect(res.body).to.be.deep.equal([{
                    percent: 1,
                    date: "2018-05-23T04:00:00.000Z"
                }])
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
                expect(res.body).to.be.deep.equal([{
                    disease_name: "Flu",
                    latitude: 3.1,
                    longitude: 4.02,
                    trend_weight: 2
                }])
                done();
            });
    });
});