const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'store_rating_db'}\`;`);
    console.log('Database created or already exists.');
    process.exit(0);
  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  }
}
createDB();
