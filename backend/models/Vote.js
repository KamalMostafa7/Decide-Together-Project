const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');

const Vote = sequelize.define('Vote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vote_type: {
    type: DataTypes.ENUM('upvote', 'downvote'),
    allowNull: false
  },
  report_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Reports',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['report_id', 'user_id']
    }
  ]
});

module.exports = Vote;
