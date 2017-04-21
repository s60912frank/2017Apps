const testenv = require('./testenv')
var chai = require('chai'),
    should = chai.should(),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);

var app = testenv.target;
var studentId = testenv.studentID;

describe('作業測試', function() {
    var account,
        user = testenv.getTestUsers()[0]

    before(function(done) {
        chai.request(app)
            .post(`/${studentId}/istore/account`)
            .send(user)
            .end(function(err, res) {
                account = res.body.account;
                done();
            });
    });

    after(function(done) {
        chai.request(app)
            .delete(`/${studentId}/istore/account/` + account._id)
            .end(function() {
                done();
            });
    });

    it('儲值成功', function(done) {
        chai.request(app)
            .put(`/${studentId}/istore/account`)
            .send({ _id: account._id, amount: 1000 })
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.account.should.have.property('name').eql(account.name);
                res.body.account.should.have.property('balance').eql(account.balance + 1000);
                account = res.body.account;
                done();
            });
    });

    it('消費成功', function(done) {
        chai.request(app)
            .put(`/${studentId}/istore/account`)
            .send({ _id: account._id, amount: -1000 })
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.account.should.have.property('name').eql(account.name);
                res.body.account.should.have.property('balance').eql(account.balance - 1000);
                done();
            });
    });
})
