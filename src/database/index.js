const mariadb = require('mariadb')
const fs = require('fs')

const config = JSON.parse(fs.readFileSync('./json/settings.json'))

const dbConfig = config.database

const pool = mariadb.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port
})

module.exports = pool
