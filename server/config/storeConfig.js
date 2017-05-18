var storeId = '16';

module.exports = {
    istore: {
        fcmServerKey: 'AIzaSyCa_MXHiw6SS9aqYYJ_VXmTm-_xNRFdl9g'
    },

    store: {
        storeId: storeId,
        storeName: `Store ${storeId}`,
        storeDB: `mongodb://Apps${storeId}:a1234@104.199.219.156:27017/Apps${storeId}`,
        storeSecret: `store${storeId}`,
        storePath: `/apps${storeId}/istore`,
        storeTopic: `/topics/store${storeId}`
    },

    line: {
        channelSecret: '374307a029a9ed61cd3a715f878e1612',
        channelAccessToken: 'sdkypFt3fIIwtb26mIj+/f39HfYPHbjTmikPVKMMtkwx3UbnKP9QJLqKZbGcjL8ozyamKUoH8t25PKjBEgajx0MtQJpHhM4FrZX/FI3wg3MTCUuax1+bZB74zqQ3mu08KJ4K+8tQYx52G9L+xnHR7QdB04t89/1O/w1cDnyilFU=',
        lineJwt: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoibGluZSIsImlhdCI6MTQ5NTA4NjQ3NSwiZXhwIjoxNTAwMjcwNDc1fQ.azvwEbnZdyEEsMaDFbDYbbLmw2ISN9BOs31kK8H86Mc'
    },

    url: {
        lineIconUrl: `https://ilab.csie.io/apps${storeId}/istore/public/picture/2017Apps_icon.png`,
        lineUserUrl: `https://ilab.csie.io/apps${storeId}/istore/public/www/index.html#/user`,
        lineDepositUrl: `https://ilab.csie.io/apps${storeId}/istore/account/deposit`,
        lineBuyUrl: `https://ilab.csie.io/apps${storeId}/istore/account/buy`,
        lineProdutsUrl: `https://ilab.csie.io/apps${storeId}/istore/product`
    }
};