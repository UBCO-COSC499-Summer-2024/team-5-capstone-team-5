const { database } = require('./config')
const pgp = require('pg-promise')(/* options */)
const db = pgp(database)

module.exports = {
  db
};