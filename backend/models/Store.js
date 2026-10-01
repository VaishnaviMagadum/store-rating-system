const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Store = sequelize.define('Store', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
  address: { type: DataTypes.STRING(400), allowNull: false },
  ownerId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
}, { timestamps: true });

Store.belongsTo(User, { as: 'Owner', foreignKey: 'ownerId' });
User.hasMany(Store, { as: 'Stores', foreignKey: 'ownerId' });

module.exports = Store;
