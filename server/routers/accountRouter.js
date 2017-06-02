var { storeId, storeSecret, storeTopic, istoreJwt } = require('../config/storeConfig').store, { fcmServerKey } = require('../config/storeConfig').istore,
    router = require('express').Router(),
    Account = require('../models/accountModel'),
    Message = require('../models/messageModel'),
    Transaction = require('../models/transactionModel'),
    Product = require('../models/productModel');

var jwt = require('jsonwebtoken'),
    user = require('../helpers/accessControl');

var FCM = require('fcm-push'),
    fcm = new FCM(fcmServerKey);

const axios = require('axios')
const expressJwt = require('express-jwt')

let op = require('../libs/operation')

router.post('/', expressJwt({ secret: 'apps2017' }), user.can('openAccount'), (req, res) => {
    console.log(req.body)
    new Promise((resolve, rej) => {
        Account.create({
            name: req.body.username.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()),
            balance: 0,
            role: req.user.role,
            user: req.body.userId,
            lineId: req.body.lineId ? req.body.lineId : null
        }, (err, account) => {
            if (err) rej('帳戶已存在')
            else resolve(account)
        })
    }).then(account => axios({ //could boom
        method: 'post',
        url: ` https://ilab.csie.io/apps09/istore/user/account`,
        headers: { Authorization: istoreJwt },
        data: { userId: req.body.userId, accountId: account._id, storeId }
    }).then(() => {
        var roleToken = jwt.sign({ role: account.role }, storeSecret, { expiresIn: '300Y' });
        res.header('Authorization', `Bearer ${roleToken}`);
        res.json({ account });
    })).catch((err) => res.json({ error: err }))
});

router.post('/login', expressJwt({ secret: 'apps2017' }), user.can('loginAccount'), (req, res) => {
    console.log(req.body)
    Account.findOne({ _id: req.body.accountId }, (err, account) => {
        if (err || !account) {
            console.log(account)
            console.error(err)
            return res.json({ error: '帳戶錯誤' });
        } else {
            if (req.body.lineId) {
                account.lineId = req.body.lineId
                account.save((err) => err ? console.log(err) : console.log('GOOD'))
            }
            var roleToken = jwt.sign({ role: account ? account.role : 'customer' }, storeSecret, { expiresIn: '30m' });
            res.header('Authorization', `Bearer ${roleToken}`);
            return res.json({ loginUser: { _id: req.body.userId, username: req.body.username }, account });
        }
    });
});

router.put('/role', user.can('roleChange'), function(req, res) {
    Account.findByIdAndUpdate(req.body.accountId, { $set: { role: req.body.role } }, { new: true }, function(err, account) {
        if (err)
            res.json({ error: "更改權限錯誤" });
        else {
            var roleToken = jwt.sign({ role: account.role }, storeSecret, { expiresIn: '30m' });
            res.header('Authorization', `Bearer ${roleToken}`);
            res.json({ account: account });
        }
    })
});

router.put('/deposit', user.can('deposit'), (req, res) => {
    op.deposit(req.body).then((result) => {
        var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' })
        res.header('Authorization', `Bearer ${roleToken}`)
        res.json(result)
    }).catch((err) => res.json({ error: err }))
});

router.put('/buy', user.can('buy'), function(req, res) {
    op.buy(req.body).then((result) => {
        var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' })
        res.header('Authorization', `Bearer ${roleToken}`)
        res.json(result)
    }).catch((err) => res.json({ error: err }))
});

router.get('/', user.can('accounts'), function(req, res) {
    Account.find({}, function(err, accounts) {
        if (err)
            return res.json({ error: '帳戶列表錯誤' });
        else {
            var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' });
            res.header('Authorization', `Bearer ${roleToken}`);
            return res.json({ accounts });
        }
    })
});

router.get('/transaction/:accountId', user.can('transactions'), function(req, res) {
    Account.findOne({ _id: req.params.accountId })
        .populate({ path: 'transactions', populate: { path: 'product' } })
        .exec(function(err, account) {
            if (err)
                res.json({ error: '交易明細錯誤' });
            else {
                var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${roleToken}`);
                res.json({ transactions: account.transactions });
            }
        });
});

router.get('/message/:accountId', user.can('messages'), function(req, res) {
    Account.findOne({ _id: req.params.accountId })
        .populate('messages')
        .exec(function(err, account) {
            if (err)
                res.json({ error: '訊息明細錯誤' });
            else {
                var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${roleToken}`);
                res.json({ messages: account.messages });
            }
        });
});

router.post('/message', user.can('sendMessage'), (req, res) => {
    //promise approach
    new Promise((resolve, rej) => {
        axios({
                method: 'post',
                url: ` https://ilab.csie.io/apps09/istore/pushmessage`,
                headers: { Authorization: istoreJwt },
                data: { title: req.body.title, content: req.body.content, storeId: storeId, accountIds: req.body.accountIds ? req.body.accountIds : null, storeTopic: storeTopic }
            })
            .then(resolve())
            .catch(rej('訊息發送錯誤'))
    }).then(() => new Promise((resolve, rej) => {
        Message.create({ title: req.body.title, content: req.body.content }, (err, message) => err ? rej('訊息儲存錯誤') : resolve(message._id))
    })).then(msgId => {
        let condition = (req.body.accountIds) ? { _id: { $in: req.body.accountIds } } : {}
        Account.update(condition, { "$addToSet": { "messages": msgId } }, { multi: true }, (err, accounts) => err ? rej('訊息儲存錯誤') : res.json({}))
    }).catch(err => res.json({ error: err }))
});

router.delete('/:accountId', user.can('closeAccount'), (req, res) => {
    (new Promise((resolve, rej) => {
        Transaction.remove({ account: req.params.accountId }, (err, transaction) => err ? rej('刪除交易明細錯誤') : resolve())
    })).then(() => new Promise((resolve, rej) => {
        Account.findByIdAndRemove(req.params.accountId, (err, account) => (err || !account) ? rej('關閉帳戶錯誤') : resolve(account.user))
    })).then(userId => new Promise((resolve, rej) => {
        axios({
                method: 'delete',
                url: `https://ilab.csie.io/apps09/istore/user/account/${userId}/${storeId}`,
                headers: { Authorization: istoreJwt }
            })
            .then(resp => resp.data.error ? rej(resp.data.error) : resolve())
            .catch(err => rej(err))
    })).then(() => {
        res.header('Authorization', istoreJwt);
        res.json({});
    }).catch(err => res.json({ error: err }))
})


module.exports = router;