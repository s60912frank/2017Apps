var { storeSecret } = require('../config/storeConfig'),
    express = require('express'),
    router = express.Router(),
    User = require('../models/userModel');

var passport = require('passport'),
    jwt = require('jsonwebtoken');

router.post('/login', function (req, res) {
    passport.authenticate('local', { session: false }, function (err, user, errInfo) {
        if (err)
            return res.json({ error: '登入錯誤' });
        else if (errInfo) {
            if (errInfo.name === 'IncorrectPasswordError')
                return res.json({ error: '密碼錯誤' });
            else if (errInfo.name === 'IncorrectUsernameError')
                return res.json({ error: '帳號不存在' });
        } else {
            var token = jwt.sign({ role: user.account.role }, storeSecret, { expiresIn: '30m' });
            res.header('Authorization', `Bearer ${token}`);
            return res.json({ account: user.account });
        }
    })(req, res);
});

module.exports = router;
