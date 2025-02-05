const mariadb = require('mariadb')
const fs = require('fs')

const config = JSON.parse(
  fs.readFileSync('/workspace/json/settings.json')
)

const dbConfig = config.database

const pool = mariadb.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port,
  acquireTimeout: 20000, // Increase timeout to 20 seconds
  idleTimeout: 30000, // Increase idle timeout
  connectionLimit: 50, // Set the limit (adjust based on `max_connections`)
  acquireTimeout: 20000, // Increase timeout (default is 10000ms)
  waitForConnections: true, // Queue connections if all are in use
  multipleStatements: true
})

module.exports = pool
