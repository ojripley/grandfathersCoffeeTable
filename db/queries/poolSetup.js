const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'admin',
//   password: 'admin',
//   host: 'localhost',
//   database: 'midterm'
// });

// module.exports = pool;

let dbParams = {};
if (process.env.DATABASE_URL) {
  dbParams.connectionString = process.env.DATABASE_URL;
} else {
  dbParams = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  };
}

const pool = new Pool(dbParams);

// module.exports = dbParams;

module.exports = pool;
