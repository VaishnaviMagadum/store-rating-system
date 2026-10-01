const { Sequelize } = require('sequelize');
require('dotenv').config();

const isRender = process.env.RENDER === 'true';

const sequelize = isRender 
  ? new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite',
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME || 'store_rating_db',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
      }
    );

module.exports = sequelize;
