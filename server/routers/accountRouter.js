var { storeSecret } = require('../config/storeConfig'),
    express = require('express'),
    router = express.Router(),
    async = require('async'),
    User = require('../models/userModel'),
    Account = require('../models/accountModel'),
    Transaction = require('../models/transactionModel');

var passport = require('passport'),
    jwt = require('jsonwebtoken'),
    user = require('../helpers/accessControl');

router.post('/', function (req, res) {
    async.waterfall([function (next) {
        var user = new User({
            username: req.body.username
        });
        User.register(user, req.body.password, function (err) {
            if (err)
                return res.json({ error: '帳號已存在' });
            else
                next(null, user);
        });
    }, function (user, next) {
        Account.create({
            name: user.username.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()),
            balance: 0,
            role: req.body.role
        }, function (err, account) {
            if (err)
                return res.json({ error: '帳戶已存在' });
            else
                next(null, user._id, account._id);
        })
    }, function (userId, accountId) {
        User.findByIdAndUpdate(userId, { $set: { account: accountId } }, { new: true })
            .populate('account')
            .exec(function (err, user) {
                if (err)
                    return res.json({ error: '帳號設定錯誤' });
                else {
                    var token = jwt.sign({ role: user.account.role }, storeSecret, { expiresIn: '30m' });
                    res.header('Authorization', `Bearer ${token}`);
                    res.json({ account: user.account });
                }
            })
    }]);
});

router.put('/role', user.can('roleChange'), function (req, res) {
    Account.findByIdAndUpdate(req.body._id, { $set: { role: req.body.role } }, { new: true }, function (err, account) {
        if (err)
            res.json({ error: "更改權限錯誤" });
        else {
            var token = jwt.sign({ role: account.role }, storeSecret, { expiresIn: '30m' });
            res.header('Authorization', `Bearer ${token}`);
            res.json({ account: account });
        }
    })
});

router.put('/', user.can('operation'), function (req, res) {
    async.waterfall([function (next) {
        Account.findById(req.body._id, function (err, account) {
            if (err)
                return res.json({ error: '交易錯誤' });
            else {
                next(null, account);
            }
        })
    }, function (account, next) {
        account.balance += req.body.amount;
        var type;
        req.body.amount < 0 ? type = 0 : type = 1;
        Transaction.create({
            account: req.body._id,
            amount: Math.abs(req.body.amount),
            balance: account.balance,
            type: type
        }, function (err, transaction) {
            if (err)
                return res.json({ error: '交易紀錄錯誤' });
            else
                next(null, account, transaction._id);
        });
    }, function (account, transactionId) {
        Account.findByIdAndUpdate(req.body._id, { "$addToSet": { "transactions": transactionId }, "$set": { "balance": account.balance } }, { new: true }, function (err, account) {
            if (err) {
                return res.json({ error: '交易錯誤' });
            } else {
                var token = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${token}`);
                return res.json({ account: account });
            }
        })
    }])
});

router.delete('/:accountId', user.can('closeAccount'), function (req, res) {
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
                next();
        })
    }, function () {
        User.findOneAndRemove({ account: req.params.accountId }, function (err, user) {
            if (err || user === null)
                return res.json({ error: '關閉帳號錯誤' });
            else
                return res.json({});
        })
    }])
})

router.get('/', user.can('accounts'), function (req, res) {
    Account.find({}, function (err, accounts) {
        if (err)
            return res.json({ error: '帳戶列表錯誤' });
        else {
            var token = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' });
            res.header('Authorization', `Bearer ${token}`);
            return res.json({ accounts: accounts });
        }
    })
});

router.get('/transaction/:accountId', user.can('transactions'), function (req, res) {
    Account.findOne({ _id: req.params.accountId })
        .populate('transactions')
        .exec(function (err, account) {
            if (err)
                res.json({ error: '交易明細錯誤' });
            else {
                var token = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${token}`);
                res.json({ transactions: account.transactions });
            }
        });
});

module.exports = router;
