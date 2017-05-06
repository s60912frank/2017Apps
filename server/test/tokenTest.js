const chai = require('chai'),
    should = chai.should(),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { storePath } = require('../config/storeConfig');
const SERVER_ADDR = 'http://localhost:3016'
const async = require('async');

describe('舊token測試', () => {
    let tokenList = []
    let jobList = []
    before(function (done) {
        for(let i = 0;i < 3;i++) {
            let func = (cb) => {
                chai.request(SERVER_ADDR)
                .post(`${storePath}/user/login`)
                .send({ username: 'alice', password: 'a1234' })
                .end(function (err, res) {
                    tokenList.push(res.header.authorization)
                    console.log(res.header.authorization)
                    cb();
                });
            }
            jobList.push(func)
        }
        async.parallel(jobList, () => done());
    });

    for(let i = 0;i < 3;i++) {
        it(`使用第${i + 1}個token取得帳戶明細成功`, function (done) {
            chai.request(SERVER_ADDR)
                .get(`${storePath}/account/transaction/2`)
                .set('Authorization', tokenList[i])
                .end(function (err, res) {
                    res.should.have.status(200);
                    done();
                });
        });
    }
})