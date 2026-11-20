const express = require('express');
const router = express.Router();
const {
  createOrUpdateVote,
  getVotesByReport,
  getAllVotes
} = require('../controllers/voteController');
const { authenticateUser } = require('../auth/middleware');

router.post('/', authenticateUser, createOrUpdateVote);
router.get('/report/:reportId', getVotesByReport);
router.get('/', getAllVotes);

module.exports = router;
