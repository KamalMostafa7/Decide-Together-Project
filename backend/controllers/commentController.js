const { Comment, User, Report, Notification } = require('../models');

const createComment = async (req, res) => {
  try {
    const { report_id, content } = req.body;

    if (!report_id || !content) {
      return res.status(400).json({ error: 'Report ID and content are required' });
    }

    // Check if user already commented on this report
    const existingComment = await Comment.findOne({
      where: {
        report_id,
        user_id: req.user.id
      }
    });

    if (existingComment) {
      return res.status(400).json({ 
        error: 'You have already commented on this report',
        message: 'You can only comment once per report'
      });
    }

    const comment = await Comment.create({
      report_id,
      user_id: req.user.id,
      content
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
    });

    // Create notification for report owner (if not commenting on own report)
    const report = await Report.findByPk(report_id);
    if (report && report.user_id !== req.user.id) {
      await Notification.create({
        user_id: report.user_id,
        message: `${req.user.name} commented on your report: "${report.title}"`,
        type: 'comment',
        related_id: report_id,
        is_read: false
      });
    }

    res.status(201).json({
      message: 'Comment added successfully',
      comment: commentWithUser
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment', details: error.message });
  }
};

const getCommentsByReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const comments = await Comment.findAll({
      where: { report_id: reportId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ comments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments', details: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Only admin or comment owner can delete
    if (req.user.role !== 'admin' && comment.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await comment.destroy();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment', details: error.message });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ comments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments', details: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByReport,
  deleteComment,
  getAllComments
};
