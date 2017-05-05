var { storeDB, storeSecret, storePath } = require('./config/storeConfig'),
    express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors');

var mongoose = require('mongoose'),
    connection = mongoose.connect(storeDB),
    autoIncrement = require('mongoose-auto-increment');

mongoose.Promise = global.Promise;
autoIncrement.initialize(connection);

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('./models/userModel'),
    expressJwt = require('express-jwt'),
    user = require('./helpers/accessControl');

var userRouter = require('./routers/userRouter'),
    accountRouter = require('./routers/accountRouter');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ exposedHeaders: 'Authorization' }));

app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
app.use(user.middleware());

app.all('*', expressJwt({ secret: storeSecret })
    .unless({
        path: [
            { url: `${storePath}/user/login` },
            { url: `${storePath}/account`, methods: ['POST'] }]
    }), function (req, res, next) {
        next();
    });

app.use(`${storePath}/user`, userRouter);
app.use(`${storePath}/account`, accountRouter);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: 'Service Not Found' });
});

module.exports = app;
