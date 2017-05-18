module.exports = {
  apps : [
    {
      name      : `apps00`,
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
