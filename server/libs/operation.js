var { storeId } = require('../config/storeConfig').store, { fcmServerKey } = require('../config/storeConfig').istore,
    User = require('../models/userModel'),
    Account = require('../models/accountModel'),
    Transaction = require('../models/transactionModel'),
    Product = require('../models/productModel');

let getAccount = (data) => {
    return new Promise((res, rej) => {
        if (data.lineId) {
            User.findOne({ lineId: data.lineId, accounts: { $elemMatch: { storeId } } }, (err, user) => {
                if (err) rej('帳號錯誤')
                else res(user.accounts[0].accountId)
            })
        } else
            res(data.accountId)
    }).then(accountId => new Promise((res, rej) => {
        Account.findById(accountId, (err, account) => {
            if (err) rej('帳戶錯誤')
            else res(account)
        })
    }))
}

module.exports = {
    getAccount: data => getAccount(data),
    depositIntention: (data) => {
        return getAccount(data).then(account => new Promise((res, rej) => {
            account.isDepositing = true
            account.save(err => err ? rej(err) : res('想要儲值多少錢呢?(請輸入數字部分即可)'))
        }))
    },
    deposit: (data) => {
        return getAccount(data).then(account => new Promise((res, rej) => {
            if (data.lineId && account.isDepositing) {
                account.isDepositing = false
                account.save(err => err ? rej(err) : res(account))
            } else res(account)
        })).then(account => new Promise((res, rej) => {
            account.balance += parseInt(data.amount);
            Transaction.create({
                account: data.accountId,
                amount: data.amount,
                balance: account.balance,
                type: 1
            }, (err, trans) => {
                if (err) rej('交易紀錄錯誤')
                else res({ account, transactionId: trans._id })
            })
        })).then(whee => new Promise((res, rej) => {
            Account.findByIdAndUpdate(whee.account._id, { "$addToSet": { "transactions": whee.transactionId }, "$set": { "balance": whee.account.balance } }, { new: true }, (err, account) => {
                if (err) rej('交易錯誤')
                else res({ account }) //final return value
            })
        }))
    },
    buy: (data) => {
        return getAccount(data).then(account => new Promise((res, rej) => {
            if (data.lineId && account.isDepositing) {
                account.isDepositing = false
                account.save(err => err ? rej(err) : rej('儲值動作已經取消'))
            } else res(account)
        })).then(account => new Promise((res, rej) => {
            Product.findById(data.productId, (err, product) => {
                if (err) rej('商品錯誤')
                else if (account.balance < product.price) rej('餘額不足')
                else res({ account, product })
            })
        })).then(acc_prod => new Promise((res, rej) => {
            acc_prod.account.balance -= acc_prod.product.price
            Transaction.create({
                account: data.accountId,
                amount: acc_prod.product.price,
                balance: acc_prod.account.balance,
                product: acc_prod.product._id,
                type: 0
            }, (err, trans) => {
                if (err) rej('交易紀錄錯誤')
                else res({ account: acc_prod.account, transactionId: trans._id })
            })
        })).then(acc_trans => new Promise((res, rej) => {
            Account.findByIdAndUpdate(acc_trans.account._id, { "$addToSet": { "transactions": acc_trans.transactionId }, "$set": { "balance": acc_trans.account.balance } }, { new: true }, (err, account) => {
                if (err) rej('交易錯誤')
                else res({ account })
            })
        }))
    },
    getProduct: (lineId) => {
        return getAccount({ lineId }).then(account => new Promise((res, rej) => {
            if (lineId && account.isDepositing) {
                account.isDepositing = false
                account.save(err => err ? rej(err) : rej('儲值動作已經取消'))
            } else res()
        })).then(() => new Promise((res, rej) => {
            Product.find({}, (err, products) => {
                if (err) rej('商品列表錯誤')
                else res({ products })
            });
        }))
    }
}