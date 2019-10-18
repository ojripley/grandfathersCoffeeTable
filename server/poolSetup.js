const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  password: 'admin',
  host: 'localhost',
  database: 'midterm'
});

module.exports = pool;
