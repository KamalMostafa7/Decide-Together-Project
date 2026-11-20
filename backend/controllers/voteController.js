const { Vote, Report, User, Notification } = require('../models');

const createOrUpdateVote = async (req, res) => {
  try {
    const { report_id, vote_type } = req.body;

    if (!report_id || !vote_type) {
      return res.status(400).json({ error: 'Report ID and vote type are required' });
    }

    if (!['upvote', 'downvote'].includes(vote_type)) {
      return res.status(400).json({ error: 'Invalid vote type' });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({
      where: {
        report_id,
        user_id: req.user.id
      }
    });

    let vote;
    let message;

    if (existingVote) {
      // If same vote type, remove the vote (toggle off)
      if (existingVote.vote_type === vote_type) {
        await existingVote.destroy();
        return res.json({
          message: 'Vote removed successfully',
          action: 'removed'
        });
      } else {
        // Change vote type (upvote to downvote or vice versa)
        existingVote.vote_type = vote_type;
        await existingVote.save();
        vote = existingVote;
        message = 'Vote updated successfully';
      }
    } else {
      // Create new vote
      vote = await Vote.create({
        report_id,
        user_id: req.user.id,
        vote_type
      });
      message = 'Vote created successfully';
    }

    // Create notification for report owner (if not voting on own report)
    const report = await Report.findByPk(report_id);
    if (report && report.user_id !== req.user.id && !existingVote) {
      const voteText = vote_type === 'upvote' ? 'upvoted' : 'downvoted';
      await Notification.create({
        user_id: report.user_id,
        message: `${req.user.name} ${voteText} your report: "${report.title}"`,
        type: 'vote',
        related_id: report_id,
        is_read: false
      });
    }

    res.status(201).json({
      message,
      vote
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process vote', details: error.message });
  }
};

const getVotesByReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const votes = await Vote.findAll({
      where: { report_id: reportId }
    });

    const upvotes = votes.filter(v => v.vote_type === 'upvote').length;
    const downvotes = votes.filter(v => v.vote_type === 'downvote').length;

    res.json({
      upvotes,
      downvotes,
      total: votes.length,
      votes: votes // Include all votes with user_id for checking
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch votes', details: error.message });
  }
};

const getAllVotes = async (req, res) => {
  try {
    const votes = await Vote.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({ votes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch votes', details: error.message });
  }
};

module.exports = {
  createOrUpdateVote,
  getVotesByReport,
  getAllVotes
};
