const pgp = require('pg-promise')(/* options */)
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const db = pgp({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'gradeit',
  user: process.env.DB_USER || 'gradeit',
  password: process.env.DB_PASSWORD || 'cosc499rocks'
});

module.exports = { db };