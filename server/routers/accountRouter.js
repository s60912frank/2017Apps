var { storeId, storeSecret, storeTopic } = require('../config/storeConfig').store,
    { fcmServerKey } = require('../config/storeConfig').istore,
    express = require('express'),
    router = express.Router(),
    async = require('async'),
    User = require('../models/userModel'),
    Account = require('../models/accountModel'),
    Message = require('../models/messageModel'),
    Transaction = require('../models/transactionModel'),
    Product = require('../models/productModel');

var passport = require('passport'),
    jwt = require('jsonwebtoken'),
    user = require('../helpers/accessControl');

var FCM = require('fcm-push'),
    fcm = new FCM(fcmServerKey);

router.post('/', user.can('openAccount'), function (req, res) {
    async.waterfall([function (next) {
        User.findById(req.body.userId, function (err, user) {
            if (err)
                return res.json({ error: '帳號不存在' });
            else
                next(null, user);
        })
    }, function (user, next) {
        Account.create({
            name: user.username.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()),
            balance: 0,
            role: req.user.role,
            user: req.body.userId
        }, function (err, account) {
            if (err)
                return res.json({ error: '帳戶已存在' });
            else
                next(null, account);
        })
    }, function (account) {
        User.findByIdAndUpdate(req.body.userId, { $addToSet: { accounts: { storeId: req.body.storeId, accountId: account._id } } }, function (err, user) {
            if (err)
                return res.json({ error: '帳號設定錯誤' });
            else {
                var roleToken = jwt.sign({ role: account.role }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${roleToken}`);
                res.json({ account: account });
            }
        });
    }]);
});

router.put('/role', user.can('roleChange'), function (req, res) {
    Account.findByIdAndUpdate(req.body.accountId, { $set: { role: req.body.role } }, { new: true }, function (err, account) {
        if (err)
            res.json({ error: "更改權限錯誤" });
        else {
            var roleToken = jwt.sign({ role: account.role }, storeSecret, { expiresIn: '30m' });
            res.header('Authorization', `Bearer ${roleToken}`);
            res.json({ account: account });
        }
    })
});

router.put('/deposit', user.can('deposit'), function (req, res) {
    async.waterfall([function (next) {
        if (req.body.lineId)
            User.findOne({ lineId: req.body.lineId, accounts: { $elemMatch: { storeId: storeId } } }, function (err, user) {
                if (err)
                    return res.json({ error: '帳號錯誤' });
                else
                    next(null, user.accounts[0].accountId);
            })
        else
            next(null, req.body.accountId);
    }, function (accountId, next) {
        Account.findById(accountId, function (err, account) {
            if (err)
                return res.json({ error: '帳戶錯誤' });
            else
                next(null, account);
        })
    }, function (account, next) {
        account.balance += parseInt(req.body.amount);
        Transaction.create({
            account: req.body.accountId,
            amount: req.body.amount,
            balance: account.balance,
            type: 1
        }, function (err, transaction) {
            if (err)
                return res.json({ error: '交易紀錄錯誤' });
            else
                next(null, account, transaction._id);
        });
    }, function (account, transactionId) {
        Account.findByIdAndUpdate(account._id, { "$addToSet": { "transactions": transactionId }, "$set": { "balance": account.balance } }, { new: true }, function (err, account) {
            if (err) {
                return res.json({ error: '交易錯誤' });
            } else {
                var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${roleToken}`);
                return res.json({ account: account });
            }
        })
    }])
});

router.put('/buy', user.can('buy'), function (req, res) {
    async.waterfall([function (next) {
        if (req.body.lineId)
            User.findOne({ lineId: req.body.lineId, accounts: { $elemMatch: { storeId: storeId } } }, function (err, user) {
                if (err)
                    return res.json({ error: '帳號錯誤' });
                else
                    next(null, user.accounts[0].accountId);
            })
        else
            next(null, req.body.accountId);
    }, function (accountId, next) {
        Account.findById(accountId, function (err, account) {
            if (err)
                return res.json({ error: '帳戶錯誤' });
            else
                next(null, account);
        })
    }, function (account, next) {
        Product.findById(req.body.productId, function (err, product) {
            if (err)
                return res.json({ error: '商品錯誤' });
            else if (account.balance < product.price)
                return res.json({ error: '餘額不足' });
            else
                next(null, account, product);
        })
    }, function (account, product, next) {
        account.balance -= product.price;
        Transaction.create({
            account: req.body.accountId,
            amount: product.price,
            balance: account.balance,
            product: product._id,
            type: 0
        }, function (err, transaction) {
            if (err)
                return res.json({ error: '交易紀錄錯誤' });
            else
                next(null, account, transaction._id);
        });
    }, function (account, transactionId) {
        Account.findByIdAndUpdate(account._id, { "$addToSet": { "transactions": transactionId }, "$set": { "balance": account.balance } }, { new: true }, function (err, account) {
            if (err) {
                return res.json({ error: '交易錯誤' });
            } else {
                var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${roleToken}`);
                return res.json({ account: account });
            }
        })
    }])
});

router.delete('/:storeId/:accountId', user.can('closeAccount'), function (req, res) {
    async.waterfall([function (next) {
        Transaction.remove({ account: req.params.accountId }, function (err, transaction) {
            if (err)
                return res.json({ error: '刪除交易明細錯誤' });
            else {
                next();
            }
        })
    }, function (next) {
        Account.findByIdAndRemove(req.params.accountId, function (err, account) {
            if (err || account === null)
                return res.json({ error: '關閉帳戶錯誤' });
            else
                next(null, account.user);
        })
    }, function (userId) {
        User.findByIdAndUpdate(userId, { $pull: { accounts: { storeId: req.params.storeId } } }, { new: true }, function (err, user) {
            if (err || user === null)
                return res.json({ error: '關閉帳號錯誤' });
            else {
                var roleToken = jwt.sign({ role: 'customer' }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${roleToken}`);
                return res.json({});
            }
        });
    }])
})

router.get('/', user.can('accounts'), function (req, res) {
    Account.find({}, function (err, accounts) {
        if (err)
            return res.json({ error: '帳戶列表錯誤' });
        else {
            var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' });
            res.header('Authorization', `Bearer ${roleToken}`);
            return res.json({ accounts: accounts });
        }
    })
});

router.get('/transaction/:accountId', user.can('transactions'), function (req, res) {
    Account.findOne({ _id: req.params.accountId })
        .populate({ path: 'transactions', populate: { path: 'product' } })
        .exec(function (err, account) {
            if (err)
                res.json({ error: '交易明細錯誤' });
            else {
                var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${roleToken}`);
                res.json({ transactions: account.transactions });
            }
        });
});

router.get('/message/:accountId', user.can('messages'), function (req, res) {
    Account.findOne({ _id: req.params.accountId })
        .populate('messages')
        .exec(function (err, account) {
            if (err)
                res.json({ error: '訊息明細錯誤' });
            else {
                var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${roleToken}`);
                res.json({ messages: account.messages });
            }
        });
});

router.post('/message', user.can('sendMessage'), function (req, res) {
    async.waterfall([function (next) {
        if (req.body.accountIds) {
            User.find({ 'accounts': { $elemMatch: { storeId: req.body.storeId, accountId: { $in: req.body.accountIds } } } }, function (err, users) {
                var deviceTokens = users.map(function (user) {
                    return user.deviceToken;
                });
                next(null, deviceTokens);
            });
        } else
            next(null, null);
    }, function (deviceTokens, next) {
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
        fcm.send(fcmMessage, function (err, response) {
            if (err) {
                return res.json({ error: '訊息發送錯誤' });
            } else
                next(null);
        });
    }, function (next) {
        Message.create({ title: req.body.title, content: req.body.content }, function (err, message) {
            if (err)
                return res.json({ error: '訊息儲存錯誤' });
            else
                next(null, message);
        });
    }, function (message) {
        var condition;

        if (req.body.accountIds)
            condition = { _id: { $in: req.body.accountIds } };
        else
            condition = {};

        Account.update(condition, { "$addToSet": { "messages": message._id } }, { multi: true }, function (err, accounts) {
            if (err)
                return res.json({ error: '訊息儲存錯誤' });
            else {
                var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${roleToken}`);
                return res.json({ message: message });
            }
        });
    }]);
});

module.exports = router;
