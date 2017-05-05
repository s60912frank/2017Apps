var storeId = '16';
const mode = 'local'

module.exports = {
    storeId: storeId,
    storeName: `Store ${storeId}`,
    storeDB: (mode == 'local') ? `mongodb://localhost:27017/Apps${storeId}` : `mongodb://Apps${storeId}:a1234@104.199.219.156:27017/Apps${storeId}`,
    storeSecret: `store${storeId}`,
    storePath: `/apps${storeId}/istore`
};