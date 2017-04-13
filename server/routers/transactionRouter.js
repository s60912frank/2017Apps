var express = require('express'),
    router = express.Router(),
    Transaction = require('../models/transactionModel');

router.get('/:accountId', function(req, res) {
    Transaction.find({ account: req.params.accountId }, function(err, transactions) {
        if (err)
            res.json({ error: '交易明細錯誤' });
        else
            res.json(transactions);
    })
});

module.exports = router;