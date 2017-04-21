const testenv = require('./testenv')
var chai = require('chai'),
    should = chai.should(),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);

var app = testenv.target;
var studentId = testenv.studentID;

describe('登入測試', function () {
    var account,
        user = testenv.getTestUsers()[0]

    before(function(done){
        chai.request(app)
            .post(`/${studentId}/istore/account`)
            .send(user)
            .end(function () {
                done();
            });
    });

    after(function (done) {
        chai.request(app)
            .delete(`/${studentId}/istore/account/` + account._id)
            .end(function () {
                done();
            });
    });

    it('登入成功', function (done) {
        chai.request(app)
            .post(`/${studentId}/istore/user/login`)
            .send(user)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.account.should.have.property('name').eql(user.username.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()));
                res.body.account.should.have.property('balance').eql(0);
                account = res.body.account;
                done();
            });
    });

    it('密碼錯誤', function (done) {
        user.password = testenv.getTestUsers()[1].password;
        chai.request(app)
            .post(`/${studentId}/istore/user/login`)
            .send(user)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.error.should.have.eql('密碼錯誤');
                done();
            });
    });

    it('帳號不存在', function (done) {
        user.username = testenv.getTestUsers()[1].username;
        chai.request(app)
            .post(`/${studentId}/istore/user/login`)
            .send(user)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.error.should.have.eql('帳號不存在');
                done();
            });
    });
})