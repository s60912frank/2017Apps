var { storeId } = require('../config/storeConfig').store;
var { lineJwt } = require('../config/storeConfig').line;
var { lineIconUrl, lineUserUrl } = require('../config/storeConfig').url;
var lineBot = require('../helpers/lineBot');

var Messages = require('node-line-messaging-api').Messages;
const op = require('./operation')

module.exports = async(event) => {
    let message = new Messages()
    switch (event.type) {
        case 'follow':
            message.addButtons({
                thumbnailImageUrl: lineIconUrl,
                altText: '帳戶設定',
                title: 'Line@iStore',
                text: '歡迎使用Line@iStore口袋商店,下方選單有更多功能喔!',
                actions: [{
                    "type": "uri",
                    "label": "進入iStore",
                    "uri": `${lineUserUrl}?lineId=${event.source.userId}`
                }]
            })
            break;
        case 'message':
            var { text } = event.message;

            if (text == '儲值') {
                let amount = text.substring(2, text.length - 1)
                await op.depositIntention({ lineId: event.source.userId })
                    .then(result => message.addText(result))
                    .catch(err => message.addText(err))
            } else if (text === '商品') {
                var columns = []
                await op.getProduct(event.source.userId)
                    .then((result) => {
                        result.products.reverse().filter((product) => {
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
                        message.addCarousel({ altText: 'iStore商品列表', columns });
                    }).catch(err => message.addText(err))
            } else if (!isNaN(text)) {
                await op.deposit({ lineId: event.source.userId, amount: text })
                    //.catch(err => message.addText(err))
                    .then(result => message.addText(`商店:Store${storeId}\n帳戶:${result.account.name}\n餘額:${result.account.balance}`))
                    .catch(err => message.addText(err))
            } else if (text == '使用方法') {
                await op.getAccount({ lineId: event.source.userId }).then(account => {
                    if (account.isDepositing) {
                        message.addText('儲值動作已經取消')
                        account.isDepositing = false
                        account.save(err => {})
                    } else message.addText('儲值:可以儲值指定金額\n商品列表:可以取得最新上架的商品列表\n帳號資訊:顯示帳號資訊(餘額等等)，若發生錯誤可以按此重新登入')
                }).catch(err => message.addText(err))
            } else if (text == '帳戶') {
                await op.getAccount({ lineId: event.source.userId }).then(account => {
                    if (account.isDepositing) {
                        message.addText('儲值動作已經取消')
                        account.isDepositing = false
                        account.save(err => {})
                    } else {
                        message.addText(`商店:Store${storeId}\n帳戶:${account.name}\n餘額:${account.balance}`)
                    }
                }).catch(err => {
                    message.addButtons({
                        thumbnailImageUrl: lineIconUrl,
                        altText: '帳戶設定',
                        title: 'Line@iStore',
                        text: '請使用下方連結重新登入!',
                        actions: [{
                            "type": "uri",
                            "label": "進入iStore",
                            "uri": `${lineUserUrl}?lineId=${event.source.userId}`
                        }]
                    })
                })
            } else {
                await op.getAccount({ lineId: event.source.userId }).then(account => {
                    if (account.isDepositing) {
                        message.addText('儲值動作已經取消')
                        account.isDepositing = false
                        account.save(err => {})
                    } else message.addText('未知指令，請利用下方選單操作喔!')
                }).catch(err => message.addText(err))
            }
            break;
        case 'postback':
            var data = JSON.parse(event.postback.data);
            await op.buy({ lineId: event.source.userId, productId: data.productId })
                .then(result => message.addText(`商店:Store${storeId}\n帳戶:${result.account.name}\n餘額:${result.account.balance}`))
                .catch(err => message.addText(err))
            break;
        default:
            /*await op.getAccount({ lineId: event.source.userId }).then(account => {
                if (account.isDepositing) {
                    message.addText('儲值動作已經取消')
                    account.isDepositing = false
                    account.save(err => {})
                } else message.addText('未知指令，請利用下方選單操作喔!')
            })*/
            break;
    }
    return (message.commit().length != 0) ? lineBot.client.replyMessage(event.replyToken, message.commit()) : undefined
}