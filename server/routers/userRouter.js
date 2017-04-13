var express = require('express'),
    router = express.Router(),
    User = require('../models/userModel'),
    Account = require('../models/accountModel');

router.post('/login', function(req, res) {
    User.findOne({ username: req.body.username })
        .populate('account')
        .exec(function(err, user) {
            if (err) {
                res.json({ error: '帳號資料錯誤' });
            } else if (!user) {
                res.json({ error: "帳號不存在" });
            } else if (!user.account) {
                res.json({ error: "帳戶不存在" });
            } else if (user.password !== req.body.password) {
                res.json({ error: "密碼錯誤" });
            } else {
                res.json({
                    account: user.account
                });
            }
        })
});

module.exports = router;