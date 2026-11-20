const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByReport,
  deleteComment,
  getAllComments
} = require('../controllers/commentController');
const { authenticateUser } = require('../auth/middleware');

router.post('/', authenticateUser, createComment);
router.get('/report/:reportId', getCommentsByReport);
router.delete('/:id', authenticateUser, deleteComment);
router.get('/', getAllComments);

module.exports = router;
