var { storeSecret } = require('../config/storeConfig').store,
    express = require('express'),
    router = express.Router(),
    async = require('async'),
    User = require('../models/userModel'),
    Account = require('../models/accountModel');

var passport = require('passport'),
    jwt = require('jsonwebtoken'),
    user = require('../helpers/accessControl');


router.post('/', function (req, res) {
    var user = new User({
        username: req.body.username,
        deviceToken: req.body.deviceToken
    });
    User.register(user, req.body.password, function (err) {
        if (err)
            return res.json({ error: '帳號已存在' });
        else {
            var roleToken = jwt.sign({ role: 'customer' }, storeSecret, { expiresIn: '30m' });
            res.header('Authorization', `Bearer ${roleToken}`);
            return res.json({ loginUser: { _id: user._id, username: user.username } });
        }
    });
});

router.post('/login', function (req, res) {
    async.waterfall([function (next) {
        passport.authenticate('local', { session: false }, function (err, user, errInfo) {
            if (err)
                return res.json({ error: '登入錯誤' });
            else if (errInfo) {
                if (errInfo.name === 'IncorrectPasswordError')
                    return res.json({ error: '密碼錯誤' });
                else if (errInfo.name === 'IncorrectUsernameError')
                    return res.json({ error: '帳號不存在' });
            } else {
                user.update({ $set: { deviceToken: req.body.deviceToken } }, function (err) {
                    if (err)
                        res.json({ error: '裝置註冊錯誤' });
                    else
                        next(null, user);
                });
            }
        })(req, res);
    }, function (user) {
        Account.findOne({ user: user._id }, function (err, account) {
            if (err)
                return res.json({ error: '帳戶錯誤' });
            else {
                var roleToken = jwt.sign({ role: account ? account.role : 'customer' }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${roleToken}`);
                return res.json({ loginUser: { _id: user._id, username: user.username }, account: account });
            }
        });
    }]);
});

module.exports = router;
