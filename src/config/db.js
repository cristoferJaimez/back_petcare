const mysql = require('mysql2/promise');
require('dotenv').config();

let pool        = null;
let isConnected = false;

const init = async () => {
  try {
    pool = mysql.createPool({
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    await pool.query('SELECT 1');
    isConnected = true;
    console.log('Conectado a MySQL');
  } catch {
    isConnected = false;
    console.log('Sin conexion a MySQL, usando datos locales');
  }
};

const getPool      = () => pool;
const getStatus    = () => isConnected;

module.exports = { init, getPool, getStatus };
