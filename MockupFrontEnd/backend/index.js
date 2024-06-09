const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

pool.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Database connection error', err.stack));

// Example query
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    console.log('Query result:', res.rows);
  }
});
