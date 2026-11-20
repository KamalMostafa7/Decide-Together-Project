const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  report_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Reports',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Notification;
