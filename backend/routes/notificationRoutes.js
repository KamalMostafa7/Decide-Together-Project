const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');
const { authenticateUser } = require('../auth/middleware');

router.get('/', authenticateUser, getNotifications);
router.put('/:id/read', authenticateUser, markAsRead);
router.put('/read-all', authenticateUser, markAllAsRead);

module.exports = router;
