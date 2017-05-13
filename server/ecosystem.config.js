var { storeId } = require('./config/storeConfig').store;

module.exports = {
  apps: [
    {
      name: `apps${storeId}`,
      script: "bin/www",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
}
