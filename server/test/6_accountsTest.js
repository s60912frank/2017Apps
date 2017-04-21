const testenv = require('./testenv')
var chai = require('chai'),
    should = chai.should(),
    chaiHttp = require('chai-http');

chai.use(chaiHttp);
var app = testenv.target;
var async = require('async');
var studentId = testenv.studentID;

describe('帳戶列表測試', function() {
    var idArray = [];

    var userArray = testenv.getTestUsers()

    let getCreateAccountJobs = () => {
        let jobs = []
        for(let i = 0; i < 3;i++) {
            jobs.push((callback) => {
                        chai.request(app)
                            .post(`/${studentId}/istore/account`)
                            .send(userArray[i])
                            .end(function(err, res) {
                                console.log(res.body)
                                idArray.push(res.body.account._id);
                                callback();
                            });
                    })
        }
        return jobs
    }

    before(function(done) {
        async.parallel(getCreateAccountJobs(), () => done());
    });

    after(function(done) {
        async.parallel([
                function(callback) {
                    chai.request(app)
                        .delete(`/${studentId}/istore/account/` + idArray[0])
                        .end(function() {
                            callback();
                        });
                },
                function(callback) {
                    chai.request(app)
                        .delete(`/${studentId}/istore/account/` + idArray[1])
                        .end(function() {
                            callback();
                        });
                },
                function(callback) {
                    chai.request(app)
                        .delete(`/${studentId}/istore/account/` + idArray[2])
                        .end(function() {
                            callback();
                        });
                }
            ],
            function() {
                done();
            });
    });


    it('帳戶列表', function(done) {
        chai.request(app)
            .get(`/${studentId}/istore/account`)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.accounts.should.be.a('array');
                res.body.accounts.length.should.be.eql(3);
                done();
            });
    });
});
