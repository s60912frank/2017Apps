var { storeId } = require('./config/storeConfig');

module.exports = {
  apps : [
    {
      name      : `apps${storeId}`,
      script    : "bin/www",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production : {
        NODE_ENV: "production"
      }
    }
  ]
}

