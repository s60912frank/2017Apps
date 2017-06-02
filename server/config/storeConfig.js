var storeId = '16';
//const lineHost = 'https://ilab.csie.io'
const lineHost = 'https://43c00dbc.ngrok.io'

module.exports = {
    istore: {
        fcmServerKey: 'AIzaSyCa_MXHiw6SS9aqYYJ_VXmTm-_xNRFdl9g'
    },

    store: {
        storeId: storeId,
        storeName: `Store ${storeId}`,
        storeDB: `mongodb://Apps${storeId}:a1234@ilab.csie.io:27017/Apps${storeId}`,
        //storeDB: `mongodb://localhost:27017/Apps${storeId}`,
        storeSecret: `store${storeId}`,
        storePath: `/apps${storeId}/store`,
        storeTopic: `/topics/store${storeId}`,
        istoreJwt: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE0OTUyNjMyMjcsImV4cCI6MTUyNjc5OTIyN30.IoFk47eFUTp6lfY_iO6slaubWz02LnL3_oqezZ5tOjo'
    },

    line: {
        channelSecret: '374307a029a9ed61cd3a715f878e1612',
        channelAccessToken: 'sdkypFt3fIIwtb26mIj+/f39HfYPHbjTmikPVKMMtkwx3UbnKP9QJLqKZbGcjL8ozyamKUoH8t25PKjBEgajx0MtQJpHhM4FrZX/FI3wg3MTCUuax1+bZB74zqQ3mu08KJ4K+8tQYx52G9L+xnHR7QdB04t89/1O/w1cDnyilFU=',
        lineJwt: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoibGluZSIsImlhdCI6MTQ5NTA4NjQ3NSwiZXhwIjoxNTAwMjcwNDc1fQ.azvwEbnZdyEEsMaDFbDYbbLmw2ISN9BOs31kK8H86Mc'
    },

    url: {
        lineIconUrl: `${lineHost}/apps${storeId}/store/public/picture/2017Apps_icon.jpg`,
        lineUserUrl: `${lineHost}/apps${storeId}/store/public/www/index.html#/user`,
        linePicUrl: `${lineHost}/apps${storeId}/store/public/picture/`
    }
};