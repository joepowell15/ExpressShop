module.exports = {
  apps : {
    name   : "Portfolio",
    script : "./app.js",
    env_production: {
        NODE_ENV: "prod",
        SOCKET_POLLING_PORT : 5000,
        RETHINKDB_HOST: "",
        RETHINKDB_PORT: null,
        RETHINKDB_DEFAULT_DB: "StoreDB",
    },
    env_development: {
        NODE_ENV: "dev",
        SOCKET_POLLING_PORT : 5000,
        RETHINKDB_HOST: "146.190.40.202",
        RETHINKDB_PORT: 28015,
        RETHINKDB_DEFAULT_DB: "StoreDB",
    }
  }
}
