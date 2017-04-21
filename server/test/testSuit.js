const rd = require('fs').readdirSync
const async = require('async')
const Mocha = require('mocha')

let testJobs = []
rd('./').filter((file) => { //讀取同一個資料夾下的所有檔案
    return /\d*Test/.test(file) //我只要數字開頭Test結尾的檔案
}).forEach((test) => testJobs.push((callback) => (new Mocha()).addFile('./' + test).run().on('end', () => callback())))

async.series(testJobs, () => process.exit()) //循序執行array中的function跑完退出