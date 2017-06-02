var { storeSecret } = require('../config/storeConfig').store,
    router = require('express').Router(),
    axios = require('axios'),
    Account = require('../models/accountModel'),
    Product = require('../models/productModel');

var jwt = require('jsonwebtoken'),
    user = require('../helpers/accessControl');

let lineBot = require('../helpers/lineBot').client

var Messages = require('../helpers/lineBot').Messages;

router.post('/product', user.can('linePushProducts'), function(req, res) {
    //promise Approach
    new Promise((res, rej) => {
        Account.find({}).select('lineId').exec(function(err, users) {
            if (err) rej('帳號錯誤');
            else {
                var lineIds = [];
                users.filter((user) => {
                    if (user.lineId !== undefined && user.lineId !== null) {
                        lineIds.push(user.lineId);
                    }
                });
                res(lineIds)
            }
        })
    }).then((lineIds) => new Promise((res, rej) => {
        Product.find({ _id: { $in: req.body.productIds } }).exec((err, products) => {
            if (err) rej('產品錯誤');
            else {
                var columns = [];
                products.filter(function(product) {
                    columns.push({
                        thumbnailImageUrl: product.imageUrl,
                        title: `特價商品:${product.name}`,
                        text: `價格:${product.price}`,
                        actions: [{
                            "type": "postback",
                            "label": "購買",
                            "data": `{"productId":${product._id}}`
                        }]
                    })
                });
                var pushMessages = new Messages().addCarousel({
                    altText: '購物列表',
                    columns: columns
                });
                res({ lineIds, msgs: pushMessages.commit() });
            }
        })
    })).then(data => new Promise((resolve, rej) => {
        lineBot.multicast(data.lineIds, data.msgs)
            .then(() => {
                var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' });
                res.header('Authorization', `Bearer ${roleToken}`);
                return res.json({});
            }).catch(err => {
                rej('推播錯誤');
                console.error(err);
            })
    })).catch(err => res.json({ error: err }))
});

router.post('/location', user.can('linePushLocation'), function(req, res) {
    //promise approach
    new Promise((res, rej) => {
        Account.find({}).select('lineId').exec(function(err, users) {
            if (err) rej('帳號錯誤');
            else {
                var lineIds = [];
                users.filter(function(user) {
                    if (user.lineId !== undefined && user.lineId !== null) {
                        lineIds.push(user.lineId);
                    }
                });
                res(lineIds)
            }
        })
    }).then((lineIds) => new Promise((res, rej => {
        axios.get(`http://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(req.body.address)}`)
            .then(function(response) {
                var pushMessages = new Messages().addLocation({
                    title: '特賣會商品',
                    address: req.body.address,
                    latitude: response.data.results[0].geometry.location.lat,
                    longitude: response.data.results[0].geometry.location.lng
                })
                lineBot.multicast(lineIds, pushMessages.commit())
                    .then(() => {
                        var roleToken = jwt.sign({ role: req.user.role }, storeSecret, { expiresIn: '30m' });
                        res.header('Authorization', `Bearer ${roleToken}`);
                        return res.json({});
                    }).catch(rej('推播錯誤'));
            }).catch(rej('轉址錯誤'));
    }))).catch(err => res.json({ error: err }))
});

var { middleware } = require('../helpers/lineBot')
let replyLogic = require('../libs/lineRobot')
router.post('/webhook', middleware, (req, res) => {
    Promise
        .all(req.body.events.map(replyLogic))
        .then((result) => res.json(result));
})

module.exports = router;