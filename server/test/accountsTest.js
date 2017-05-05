var { storePath, storeSecret } = require('../config/storeConfig');

var chai = require('chai'),
    should = chai.should(),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);

var app = require('../app.js'),
    jwt = require('jsonwebtoken');

var async = require('async');

describe('帳戶列表', function () {
    var customerBy00,
        managerBy00;

    var customerBy01 = 'Bearer ' + jwt.sign({ role: 'customer' }, 'store01', { expiresIn: '30m' }),
        anonymousBy00 = 'Bearer ' + jwt.sign({ role: 'anonymous' }, storeSecret, { expiresIn: '30m' });

    before(function (done) {
        async.parallel([function (callback) {
            chai.request(app)
                .post(`${storePath}/user/login`)
                .send({ username: 'alice', password: 'a1234' })
                .end(function (err, res) {
                    customerBy00 = res.header.authorization;
                    callback();
                });
        }, function (callback) {
            chai.request(app)
                .post(`${storePath}/user/login`)
                .send({ username: 'bob', password: 'b1234' })
                .end(function (err, res) {
                    managerBy00 = res.header.authorization;
                    callback();
                });
        }], function () {
            done();
        });
    });

    it('權限錯誤:token=customerBy01', function (done) {
        chai.request(app)
            .get(`${storePath}/account`)
            .set('Authorization', customerBy01)
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });

    it('列表成功:token=managerBy00', function (done) {
        chai.request(app)
            .get(`${storePath}/account`)
            .set('Authorization', managerBy00)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('權限錯誤:token=customerBy00', function (done) {
        chai.request(app)
            .get(`${storePath}/account`)
            .set('Authorization', customerBy00)
            .end(function (err, res) {
                res.should.have.status(403);
                res.body.error.should.have.eql('帳戶未具此權限');
                done();
            });
    });

    it('權限錯誤:token=anonymousBy00', function (done) {
        chai.request(app)
            .get(`${storePath}/account`)
            .set('Authorization', anonymousBy00)
            .end(function (err, res) {
                res.should.have.status(403);
                res.body.error.should.have.eql('帳戶未具此權限');
                done();
            });
    });

})
