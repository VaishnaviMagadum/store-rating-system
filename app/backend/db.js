const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'store_rating_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: 4000,
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_HOST ? { rejectUnauthorized: true } : false
    }
  }
);

module.exports = sequelize;
