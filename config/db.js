const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'user',
  password: '123456',
  database: 'temperature_data'
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;