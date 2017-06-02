var { linePicUrl } = require('../config/storeConfig').url
var { storeSecret } = require('../config/storeConfig').store,
    router = require('express').Router(),
    Account = require('../models/accountModel'),
    Product = require('../models/productModel');

var user = require('../helpers/accessControl');
const axios = require('axios');
const fs = require('fs')

router.post('/', user.can('product'), function(req, res) {
    console.log(req.body.url.length)
    new Promise((resolve, rej) => {
            console.log('TYPE: ' + req.body.imgType)
            if (req.body.imgType == 'dataURL') {
                let filename = `pic${Date.now()}`
                fs.writeFile(`${__dirname}/../public/picture/${filename}.jpg`, req.body.url, 'base64', err => err ? rej(err) : resolve(`${linePicUrl}${filename}.jpg`))
            } else if (req.body.imgType == 'URL') {
                resolve(req.body.url)
            } else if (req.body.imgType == 'nopic') {
                resolve(`${linePicUrl}nopic.jpg`)
            } else rej('網址格式錯誤')
        }).then(url => new Promise((resolve, rej) => {
            Product.create({ name: req.body.name, price: req.body.price, imageUrl: url }, (err, product) => {
                if (err) rej('上架錯誤')
                else resolve()
            });
        })).then(() => res.json({}))
        .catch(err => {
            console.error(err.message)
            res.json({ error: (err.message ? err.message : err) })
        })
});

router.get('/', user.can('products'), function(req, res) {
    Product.find({}, function(err, products) {
        if (err)
            return res.json({ error: '商品列表錯誤' });
        else
            return res.json({ products: products });
    });
});

module.exports = router;