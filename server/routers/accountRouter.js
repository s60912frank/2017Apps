var { storeId, storeSecret, storeTopic, istoreJwt } = require('../config/storeConfig').store, { fcmServerKey } = require('../config/storeConfig').istore,
    express = require('express'),
    router = express.Router(),
    async = require('async'),
    //User = require('../models/userModel'),
    Account = require('../models/accountModel'),
    Message = require('../models/messageModel'),
    Transaction = require('../models/transactionModel'),
    Product = require('../models/productModel');

var passport = require('passport'),
    jwt = require('jsonwebtoken'),
    user = require('../helpers/accessControl');

var FCM = require('fcm-push'),
    fcm = new FCM(fcmServerKey);

const axios = require('axios')
const expressJwt = require('express-jwt')

let op = require('../libs/operation')

router.post('/', expressJwt({ secret: 'apps2017' }), user.can('openAccount'), (req, res) => {
    console.log(req.body)
    new Promise((res, rej) => {
        Account.create({
            name: req.body.username.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()),
            balance: 0,
            role: req.user.role,
            user: req.body.userId,
            lineId: req.body.lineId ? req.body.lineId : null //why
        }, (err, account) => {
            if (err) rej('帳戶已存在')
            else res(account)
        })
    }).then(account => axios({ //could boom
        method: 'post',
        url: ` https://ilab.csie.io/apps09/istore/user/account`,
        headers: { Authorization: istoreJwt },
        data: { userId: req.body.userId, accountId: account._id, storeId: storeId }
    }).then(() => {
        var roleToken = jwt.sign({ role: account.role }, storeSecret, { expiresIn: '300Y' });
        res.header('Authorization', `Bearer ${roleToken}`);
        res.json({ account });
    })).catch((err) => res.json({ error: err }))

    /*async.waterfall([function(next) {
        User.findById(req.body.userId, function(err, user) {
            if (err)
                return res.json({ error: '帳號不存在' });
            else
                next(null, user);
        })
    }, function(user, next) {
        Account.create({
            name: user.username.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()),
            balance: 0,
            role: req.user.role,
            user: req.body.userId
        }, function(err, account) {
            if (err)
                return res.json({ error: '帳戶已存在' });
            else
                next(null, account);
        })
    }, function(account) {
        User.findByIdAndUpdate(req.body.userId, { $addToSet: { accounts: { storeId: req.body.storeId, accountId: account._id } } }, function(err, user) {
            if (err)
                return res.json({ error: '帳號設定錯誤' });
            else {
                var roleToken = jwt.sign({ role: account.role }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${roleToken}`);
                res.json({ account: account });
            }
        });
    }]);*/
});

router.post('/login', expressJwt({ secret: 'apps2017' }), user.can('loginAccount'), (req, res) => {
    let accountName = req.body.username.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    Account.findOne({ user: req.body.userId, name: accountName }, (err, account) => {
        if (err || !account) return res.json({ error: '帳戶錯誤' });
        else {
            var roleToken = jwt.sign({ role: account ? account.role : 'customer' }, storeSecret, { expiresIn: '30m' });
            res.header('Authorization', `Bearer ${roleToken}`);
            return res.json({ loginUser: { _id: req.body.userId, username: req.body.username }, account });
        }
    });

    /*console.log(req.body)
    new Promise((res, rej) => {
        Account.create({
            name: req.body.username.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()),
            balance: 0,
            role: req.user.role,
            user: req.body.userId,
            lineId: req.body.lineId ? req.body.lineId : null //why
        }, (err, account) => {
            if (err) rej('帳戶已存在')
            else res(account)
        })
    }).then(account => axios({ //could boom
        method: 'post',
        url: ` https://ilab.csie.io/apps09/istore/user/account`,
        headers: { Authorization: istoreJwt },
        data: { userId: req.body.userId, accountId: account._id, storeId: storeId }
    }).then(() => {
        var roleToken = jwt.sign({ role: account.role }, storeSecret, { expiresIn: '300Y' });
        res.header('Authorization', `Bearer ${roleToken}`);
        res.json({ account });
    })).catch((err) => res.json({ error: err }))*/
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

router.put('/deposit', user.can('deposit'), async(req, res) => {
    //could boom
    op.deposit(req.body).then((result) => {
        var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' })
        res.header('Authorization', `Bearer ${roleToken}`)
        res.json(result)
    }).catch((err) => res.json({ error: err }))
});

router.put('/buy', user.can('buy'), function(req, res) {
    //could boom
    op.buy(req.body).then((result) => {
        var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' })
        res.header('Authorization', `Bearer ${roleToken}`)
        res.json(result)
    }).catch((err) => res.json({ error: err }))
});

/*router.delete('/:storeId/:accountId', user.can('closeAccount'), function(req, res) {
    async.waterfall([function(next) {
        Transaction.remove({ account: req.params.accountId }, function(err, transaction) {
            if (err)
                return res.json({ error: '刪除交易明細錯誤' });
            else {
                next();
            }
        })
    }, function(next) {
        Account.findByIdAndRemove(req.params.accountId, function(err, account) {
            if (err || account === null)
                return res.json({ error: '關閉帳戶錯誤' });
            else
                next(null, account.user);
        })
    }, function(userId) {
        User.findByIdAndUpdate(userId, { $pull: { accounts: { storeId: req.params.storeId } } }, { new: true }, function(err, user) {
            if (err || user === null)
                return res.json({ error: '關閉帳號錯誤' });
            else {
                var roleToken = jwt.sign({ role: 'customer' }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${roleToken}`);
                return res.json({});
            }
        });
    }])
})*/

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
    new Promise((res, rej) => {
        axios({
                method: 'post',
                url: ` https://ilab.csie.io/apps09/istore/pushmessage`,
                headers: { Authorization: istoreJwt },
                data: { title: req.body.title, content: req.body.content, storeId: storeId, accountIds: req.body.accountIds ? req.body.accountIds : null, storeTopic: storeTopic }
            })
            .then(res()) //could boom
            .catch(rej('訊息發送錯誤'))
    }).then(new Promise((res, rej) => {
        Message.create({ title: req.body.title, content: req.body.content }, (err, message) => err ? rej('訊息儲存錯誤') : res(message._id))
    })).then(msgId => {
        let condition = (req.body.accountIds) ? { _id: { $in: req.body.accountIds } } : {}
        Account.update(condition, { "$addToSet": { "messages": msgId } }, { multi: true }, (err, accounts) => err ? res.json({ error: '訊息儲存錯誤' }) : res.json({}))
    }).catch(err => res.json({ error: err }))


    //new
    /*router.post('/message', user.can('sendMessage'), function(req, res) {
        async.waterfall([function(next) {
            axios({
                method: 'post',
                url: ` https://ilab.csie.io/apps09/istore/pushmessage`,
                headers: { Authorization: istoreJwt },
                data: { title: req.body.title, content: req.body.content, storeId: storeId, accountIds: req.body.accountIds ? req.body.accountIds : null, storeTopic: storeTopic }
            }).then(function() {
                next();
            }).catch(function() {
                return res.json({ error: '訊息發送錯誤' });
            });
        }, function(next) {
            Message.create({ title: req.body.title, content: req.body.content }, function(err, message) {
                if (err)
                    return res.json({ error: '訊息儲存錯誤' });
                else
                    next(null, message._id);
            });
        }, function(messageId) {
            var condition = (req.body.accountIds) ? { _id: { $in: req.body.accountIds } } : {}

            Account.update(condition, { "$addToSet": { "messages": messageId } }, { multi: true }, function(err, accounts) {
                if (err)
                    return res.json({ error: '訊息儲存錯誤' });
                else {
                    return res.json({});
                }
            });
        }]);
    });



    async.waterfall([function(next) {
        if (req.body.accountIds) {
            User.find({ 'accounts': { $elemMatch: { storeId: req.body.storeId, accountId: { $in: req.body.accountIds } } } }, function(err, users) {
                var deviceTokens = users.map(function(user) {
                    return user.deviceToken;
                });
                next(null, deviceTokens);
            });
        } else
            next(null, null);
    }, function(deviceTokens, next) {
        var fcmMessage = {
            notification: {
                title: req.body.title,
                body: req.body.content,
                sound: "default",
                click_action: "FCM_PLUGIN_ACTIVITY",
                icon: "fcm_push_icon"
            },
            data: {
                title: req.body.title,
                body: req.body.content,
            },
            priority: "high"
        };

        if (req.body.accountIds)
            fcmMessage['registration_ids'] = deviceTokens;
        else
            fcmMessage['to'] = storeTopic;
        fcm.send(fcmMessage, function(err, response) {
            if (err) {
                return res.json({ error: '訊息發送錯誤' });
            } else
                next(null);
        });
    }, function(next) {
        Message.create({ title: req.body.title, content: req.body.content }, function(err, message) {
            if (err)
                return res.json({ error: '訊息儲存錯誤' });
            else
                next(null, message);
        });
    }, function(message) {
        var condition;

        if (req.body.accountIds)
            condition = { _id: { $in: req.body.accountIds } };
        else
            condition = {};

        Account.update(condition, { "$addToSet": { "messages": message._id } }, { multi: true }, function(err, accounts) {
            if (err)
                return res.json({ error: '訊息儲存錯誤' });
            else {
                var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${roleToken}`);
                return res.json({ message: message });
            }
        });
    }]);*/
});

router.delete('/:accountId', user.can('closeAccount'), (req, res) => {
    new Promise((res, rej) => {
        Transaction.remove({ account: req.params.accountId }, (err, transaction) => err ? rej('刪除交易明細錯誤') : res())
    }).then(new Promise((res, rej) => {
        Account.findByIdAndRemove(req.params.accountId, (err, account) => (err || account === null) ? rej('關閉帳戶錯誤') : res(account.user))
    })).then(userId => axios({ //could boom
        method: 'delete',
        url: `https://ilab.csie.io/apps09/istore/user/account/${userId}/${storeId}`,
        headers: { Authorization: istoreJwt }
    }).then(() => {
        res.header('Authorization', istoreJwt);
        res.json({});
    }).catch(() => res.json({ error: '關閉帳號錯誤' })))

    /*async.waterfall([function(next) {
        Transaction.remove({ account: req.params.accountId }, function(err, transaction) {
            if (err)
                return res.json({ error: '刪除交易明細錯誤' });
            else
                next();
        })
    }, function(next) {
        Account.findByIdAndRemove(req.params.accountId, function(err, account) {
            if (err || account === null)
                return res.json({ error: '關閉帳戶錯誤' });
            else
                next(null, account.user);
        })
    }, function(userId) {
        axios({
            method: 'delete',
            url: `https://ilab.csie.io/apps09/istore/user/account/${userId}/${storeId}`,
            headers: { Authorization: istoreJwt }
        }).then(function() {
            res.header('Authorization', istoreJwt);
            res.json({});
        }).catch(function() {
            return res.json({ error: '關閉帳號錯誤' });
        });
    }])*/
})


module.exports = router;