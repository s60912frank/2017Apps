let mongoose = require('mongoose')
let connection = mongoose.connect(require('./config/storeConfig').store.storeDB)
let autoIncrement = require('mongoose-auto-increment')
autoIncrement.initialize(connection)
let Product = require('./models/productModel')

let addProduct = (name, price, imageUrl) => {
    Product.create({ name, price, imageUrl }, (err, product) => {
        if (err)
            console.log('上架錯誤')
        else
            console.log(`${name}已上架!`)
    });
}

addProduct('可可拿鐵', 65, 'https://ilab.csie.io/apps16/istore/public/picture/可可拿鐵.jpg')
addProduct('四季春', 30, 'https://ilab.csie.io/apps16/istore/public/picture/四季春.jpg')
addProduct('多酚綠茶', 50, 'https://ilab.csie.io/apps16/istore/public/picture/多酚綠茶.jpg')
addProduct('茉香海鹽', 40, 'https://ilab.csie.io/apps16/istore/public/picture/茉香海鹽.jpg')