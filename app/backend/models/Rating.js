const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Store = require('./Store');

const Rating = sequelize.define('Rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rating: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    validate: { min: 1, max: 5 }
  }
}, { timestamps: true });

Rating.belongsTo(User, { foreignKey: 'userId' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });
User.hasMany(Rating, { foreignKey: 'userId' });
Store.hasMany(Rating, { foreignKey: 'storeId' });

module.exports = Rating;
