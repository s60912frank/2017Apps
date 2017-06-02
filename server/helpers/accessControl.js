var ConnectRoles = require('connect-roles');

var user = new ConnectRoles({
    failureHandler: (req, res, action) => {
        res.status(403).json({ error: '帳戶未具此權限' });
    }
});

user.use('roleChange', req => (req.user && (req.user.role == 'manager' || req.user.role == 'customer')))

user.use('openAccount', req => (req.user && req.user.role == 'customer'))

user.use('loginAccount', req => (req.user && req.user.role == 'customer'))

user.use('closeAccount', req => (req.user && req.user.role == 'customer'))

user.use('buy', req => (req.user && req.user.role === 'customer' || req.user.role === 'line'))

user.use('deposit', req => (req.user && req.user.role === 'customer' || req.user.role === 'line'))

user.use('transactions', req => (req.user && (req.user.role === 'manager' || req.user.role === 'customer')))

user.use('accounts', req => (req.user && req.user.role === 'manager'))

user.use('sendMessage', req => (req.user && req.user.role === 'manager'))

user.use('messages', req => (req.user && (req.user.role === 'manager' || req.user.role === 'customer')))

user.use('product', req => (req.user && (req.user.role === 'manager')))

user.use('products', req => (req.user && (req.user.role === 'manager' || req.user.role === 'customer' || req.user.role === 'line')))

user.use('linePushProducts', req => (req.user && req.user.role === 'manager'))

user.use('linePushLocation', req => (req.user && req.user.role === 'manager'))

module.exports = user;