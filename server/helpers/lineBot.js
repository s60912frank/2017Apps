const lineBot = require('@line/bot-sdk')
const config = {
    channelAccessToken: require('../config/storeConfig').line.channelAccessToken,
    channelSecret: lineSecret = require('../config/storeConfig').line.channelSecret
};

module.exports = {
    middleware: lineBot.middleware(config),
    client: new lineBot.Client(config)
}