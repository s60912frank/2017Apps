var express = require('express'),
    router = express.Router(),
    async = require('async'),
    User = require('../models/userModel'),
    Account = require('../models/accountModel'),
    Transaction = require('../models/transactionModel');

router.post('/', function(req, res) {
    /*console.log(req.body)
    let createUser = () => {
        return new Promise((resolve, reject) => {
            let user = new User({
                username: req.body.username,
                password: req.body.password
            });
            user.save((err)=> {
                if (err) {
                    res.json({ error: '新增帳號錯誤' });
                    //reject()
                }
                else
                    resolve(user);
            });
        })
    }
    let createAccount = (user) => {
        return new Promise((resolve, reject) => {
            Account.create({
                name: user.username.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()),
                balance: 0
            }, (err, account) => {
                console.log(account)
                if (err) {
                    res.json({ error: '新增帳戶錯誤' });
                    //reject()
                }
                else
                    resolve(user._id, account._id);
            })
        })
    }
    let setAccount = (userId, accountId) => {
        console.log(userId, accountId)
        return new Promise((resolve, reject) => {
            User.findByIdAndUpdate(userId, { $set: { account: accountId } }, { new: true })
            .populate('account')
            .exec((err, user) => {
                if (err){
                    res.json({ error: '帳號設定錯誤' });
                    console.log(err)
                }
                else 
                    res.json({ account: user.account });
                resolve()
            })
        })
    }

    createUser().then(createAccount).then(setAccount)*/

    async.waterfall([function(next) {
        var user = new User({
            username: req.body.username,
            password: req.body.password
        });
        user.save(function(err) {
            if (err)
                return res.json({ error: '新增帳號錯誤' });
            else
                next(null, user);
        });
    }, function(user, next) {
        Account.create({
            name: user.username.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase()),
            balance: 0
        }, function(err, account) {
            if (err)
                return res.json({ error: '新增帳戶錯誤' });
            else
                next(null, user._id, account._id);
        })
    }, function(userId, accountId) {
        User.findByIdAndUpdate(userId, { $set: { account: accountId } }, { new: true })
            .populate('account')
            .exec(function(err, user) {
                if (err)
                    return res.json({ error: '帳號設定錯誤' });
                else {
                    return res.json({
                        account: user.account
                    });
                }
            })
    }]);
});

router.put('/', function(req, res) {
    async.waterfall([function(next) {
        Account.findByIdAndUpdate(req.body._id, { "$inc": { "balance": req.body.amount } }, { new: true }, function(err, account) {
            if (err)
                return res.json({ error: '交易錯誤' });
            else
                next(null, account);
        })
    }, function(account) {
        var type;
        req.body.amount < 0 ? type = 0 : type = 1;
        Transaction.create({
            account: req.body._id,
            amount: Math.abs(req.body.amount),
            balance: account.balance,
            type: type
        }, function(err, transaction) {
            if (err)
                return res.json({ error: '交易紀錄錯誤' });
            else
                return res.json(account);
        });
    }])
});

router.delete('/:accountId', function(req, res) {
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
                next();
        })
    }, function() {
        User.findOneAndRemove({ account: req.params.accountId }, function(err, user) {
            if (err || user === null)
                return res.json({ error: '關閉帳號錯誤' });
            else
                return res.json({});
        })
    }])
})

router.get('/', function(req, res) {
    Account.find({}, function(err, accounts) {
        if (err)
            return res.json({ error: '帳戶列表錯誤' });
        else
            return res.json(accounts);
    })
});

module.exports = router;
