const mysql = require("mysql2");
const db_info = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const pool = mysql.createPool(db_info);
const promisePool = pool.promise();
module.exports = promisePool;
