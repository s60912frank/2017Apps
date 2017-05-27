module.exports = {
    apps: [{
        name: `apps16`,
        script: "bin/www",
        env: {
            COMMON_VARIABLE: "true"
        },
        env_production: {
            NODE_ENV: "production"
        }
    }]
}