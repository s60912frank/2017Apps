var ConnectRoles = require('connect-roles');

var user = new ConnectRoles({
    failureHandler: (req, res, action) => {
        res.status(403).json({ error: '帳戶未具此權限' });
    }
});

user.use('roleChange', function (req) {
    if (req.user && (req.user.role === 'manager' || req.user.role === 'customer')) {
        return true;
    }
});

user.use('closeAccount', function (req) {
    if (req.user && req.user.role === 'customer') {
        return true;
    }
});

user.use('operation', function (req) {
    if (req.user && req.user.role === 'customer') {
        return true;
    }
});

user.use('transactions', function (req) {
    if (req.user && (req.user.role === 'manager' || req.user.role === 'customer')) {
        return true;
    }
});

user.use('accounts', function (req) {
    if (req.user && req.user.role === 'manager') {
        return true;
    }
});

module.exports = user;