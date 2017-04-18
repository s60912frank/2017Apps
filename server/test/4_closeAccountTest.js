const testenv = require('./testenv')
var chai = require('chai'),
    should = chai.should(),
    chaiHttp = require('chai-http');

chai.use(chaiHttp);

var app = require('../app.js');

var studentId = testenv.studentID;

describe('結清測試', function() {
    var account,
        user = testenv.testUsers[0]

    before(function(done) {
        chai.request(app)
            .post(`/${studentId}/istore/account`)
            .send(user)
            .end(function(err, res) {
                account = res.body.account;
                done();
            });
    });

    it('結清成功', function(done) {
        chai.request(app)
            .delete(`/${studentId}/istore/account/` + account._id)
            .end(function(err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('關閉帳戶錯誤', function(done) {
        account._id = -1;
        chai.request(app)
            .delete(`/${studentId}/istore/account/` + account._id)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.error.should.have.eql('關閉帳戶錯誤');
                done();
            });
    });
});
