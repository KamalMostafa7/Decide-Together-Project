const User = require('./User');
const Report = require('./Report');
const Comment = require('./Comment');
const Vote = require('./Vote');
const Notification = require('./Notification');

// Define associations
User.hasMany(Report, { foreignKey: 'user_id', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Report.hasMany(Comment, { foreignKey: 'report_id', as: 'comments' });
Comment.belongsTo(Report, { foreignKey: 'report_id', as: 'report' });

User.hasMany(Vote, { foreignKey: 'user_id', as: 'votes' });
Vote.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Report.hasMany(Vote, { foreignKey: 'report_id', as: 'votes' });
Vote.belongsTo(Report, { foreignKey: 'report_id', as: 'report' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Report.hasMany(Notification, { foreignKey: 'report_id', as: 'notifications' });
Notification.belongsTo(Report, { foreignKey: 'report_id', as: 'report' });

module.exports = {
  User,
  Report,
  Comment,
  Vote,
  Notification
};
