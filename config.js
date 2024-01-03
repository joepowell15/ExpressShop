module.exports = {
    app: {
        name: "app",
        script: "../../app.js",
        env: {
            NODE_ENV: "dev",
            SOCKET_POLLING_PORT :5000,
            RETHINKDB_HOST: "146.190.40.202",
            RETHINKDB_PORT: 28015,
            RETHINKDB_DEFAULT_DB: "StoreDB",
        }
    }
}