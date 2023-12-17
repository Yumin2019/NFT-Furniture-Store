const mysql = require("mysql2");
const db_info = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const conn = mysql.createConnection(db_info);
conn.connect((err) => {
  if (err) console.error("mysql connection error : " + err);
  else console.log("mysql is connected successfully!");
});

module.exports = conn;
