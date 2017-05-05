var { storePath, storeSecret } = require('../config/storeConfig');

var chai = require('chai'),
    should = chai.should(),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);

var app = require('../app.js'),
    jwt = require('jsonwebtoken');

var async = require('async');

describe('權限變更', function () {
    var customer,
        customerBy00,
        manager,
        managerBy00;

    var customerBy01 = 'Bearer ' + jwt.sign({ role: 'customer' }, 'store01', { expiresIn: '30m' }),
        anonymousBy00 = 'Bearer ' + jwt.sign({ role: 'anonymous' }, storeSecret, { expiresIn: '30m' });

    before(function (done) {
        async.parallel([function (callback) {
            chai.request(app)
                .post(`${storePath}/user/login`)
                .send({ username: 'alice', password: 'a1234' })
                .end(function (err, res) {
                    customer = res.body.account;
                    customerBy00 = res.header.authorization;
                    callback();
                });
        }, function (callback) {
            chai.request(app)
                .post(`${storePath}/user/login`)
                .send({ username: 'bob', password: 'b1234' })
                .end(function (err, res) {
                    manager = res.body.account;
                    managerBy00 = res.header.authorization;
                    callback();
                });
        }], function () {
            done();
        });
    });

    after(function (done) {
        async.parallel([function (callback) {
            chai.request(app)
                .put(`${storePath}/account/role`)
                .send({ _id: customer._id, role: 'customer' })
                .set('Authorization', managerBy00)
                .end(function () {
                    callback();
                });
        }, function (callback) {
            chai.request(app)
                .put(`${storePath}/account/role`)
                .send({ _id: manager._id, role: 'manager' })
                .set('Authorization', customerBy00)
                .end(function () {
                    callback();
                });
        }], function () {
            done();
        });
    });

    it('權限錯誤:token=customerBy01', function (done) {
        chai.request(app)
            .put(`${storePath}/account/role`)
            .set('Authorization', customerBy01)
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            });
    });

    it('變更成功:token=customerBy00', function (done) {
        chai.request(app)
            .put(`${storePath}/account/role`)
            .send({ _id: customer._id, role: 'manager' })
            .set('Authorization', customerBy00)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.account.role.should.have.eql('manager');
                customerBy00 = res.header.authorization;
                done();
            });
    });

    it('變更成功:token=managerBy00', function (done) {
        chai.request(app)
            .put(`${storePath}/account/role`)
            .send({ _id: manager._id, role: 'customer' })
            .set('Authorization', managerBy00)
            .end(function (err, res) {
                res.should.have.status(200);
                res.body.account.role.should.have.eql('customer');
                managerBy00 = res.header.authorization;
                done();
            });
    });

    it('權限錯誤:token=anonymousBy00', function (done) {
        chai.request(app)
            .put(`${storePath}/account/role`)
            .set('Authorization', anonymousBy00)
            .end(function (err, res) {
                res.should.have.status(403);
                res.body.error.should.have.eql('帳戶未具此權限');
                done();
            });
    });

})
