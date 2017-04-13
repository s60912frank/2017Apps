 let dbConfig = require('./config/dbConfig'),
     express = require('express'),
     logger = require('morgan'),
     bodyParser = require('body-parser'),
     mongoose = require('mongoose'),
     connection = mongoose.connect(dbConfig.DBUrl),
     autoIncrement = require('mongoose-auto-increment'),
     cors = require('cors');

 autoIncrement.initialize(connection);

 let userRouter = require('./routers/userRouter'),
     accountRouter = require('./routers/accountRouter'),
     transactionRouter = require('./routers/transactionRouter');

 let app = express(),
     router = express.Router();

 app.use(logger('dev'));
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(cors());

 app.use('/apps16/istore/user', userRouter);
 app.use('/apps16/istore/account', accountRouter);
 app.use('/apps16/istore/transaction', transactionRouter);

 app.use((req, res, next) => {
     let err = new Error('Not Found');
     err.status = 404;
     next(err);
 });

 app.use((err, req, res, next) => {
     res.status(err.status || 500);
     res.json({ error: 'Service Not Found' });
 });

 module.exports = app;