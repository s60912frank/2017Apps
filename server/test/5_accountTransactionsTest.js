const testenv = require('./testenv')
var chai = require('chai'),
    should = chai.should(),
    chaiHttp = require('chai-http');

chai.use(chaiHttp);

var app = require('../app.js');

var async = require('async');

var studentId = testenv.studentID;

describe('交易明細測試', function() {
    var account,
        user = testenv.testUsers[0]

    before(function(done) {
        async.series([
                function(callback) {
                    chai.request(app)
                        .post(`/${studentId}/istore/account`)
                        .send(user)
                        .end(function(err, res) {
                            account = res.body.account;
                            callback();
                        });
                },
                function(callback) {
                    chai.request(app)
                        .put(`/${studentId}/istore/account`)
                        .send({ _id: account._id, amount: 1000 })
                        .end(function() {
                            callback();
                        });
                },
                function(callback) {
                    chai.request(app)
                        .put(`/${studentId}/istore/account`)
                        .send({ _id: account._id, amount: -1000 })
                        .end(function() {
                            callback();
                        });
                }
            ],
            function() {
                done();
            });
    });

    after(function(done) {
        chai.request(app)
            .delete(`/${studentId}/istore/account/` + account._id)
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('交易明細', function(done) {
        chai.request(app)
            .get(`/${studentId}/istore/account/transaction/` + account._id)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.transactions.should.be.a('array');
                res.body.transactions.length.should.be.eql(2);
                done();
            });
    });
});
