const { Report, User, Comment, Vote } = require('../models');
const { Notification } = require('../models');
const { Op } = require('sequelize');

const createReport = async (req, res) => {
  try {
    const { title, description, suggested_solution, category, governorate, city, address, latitude, longitude, image_url } = req.body;

    if (!title || !description || !category || !governorate || !latitude || !longitude) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const report = await Report.create({
      title,
      description,
      suggested_solution: suggested_solution || null,
      category,
      governorate,
      city: city || null,
      address: address || null,
      latitude,
      longitude,
      image_url: image_url || null,
      user_id: req.user.id
    });

    const reportWithUser = await Report.findByPk(report.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
    });

    res.status(201).json({
      message: 'Report created successfully',
      report: reportWithUser
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create report', details: error.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const { category, status, governorate } = req.query;
    const where = {};

    if (category) where.category = category;
    if (status) where.status = status;
    if (governorate) where.governorate = governorate;

    const reports = await Report.findAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Comment, as: 'comments', include: [{ model: User, as: 'user', attributes: ['name'] }] },
        { model: Vote, as: 'votes' }
      ],
      order: [['createdAt', 'DESC']]
    });

    const reportsWithCounts = reports.map(report => {
      const votes = report.votes || [];
      const upvotes = votes.filter(v => v.vote_type === 'upvote').length;
      const downvotes = votes.filter(v => v.vote_type === 'downvote').length;

      return {
        ...report.toJSON(),
        upvotes,
        downvotes,
        commentCount: report.comments ? report.comments.length : 0
      };
    });

    res.json({ reports: reportsWithCounts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports', details: error.message });
  }
};

const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { 
          model: Comment, 
          as: 'comments', 
          include: [{ model: User, as: 'user', attributes: ['name'] }],
          order: [['createdAt', 'DESC']]
        },
        { model: Vote, as: 'votes' }
      ]
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const votes = report.votes || [];
    const upvotes = votes.filter(v => v.vote_type === 'upvote').length;
    const downvotes = votes.filter(v => v.vote_type === 'downvote').length;

    res.json({
      report: {
        ...report.toJSON(),
        upvotes,
        downvotes
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report', details: error.message });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['open', 'in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const report = await Report.findByPk(id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const oldStatus = report.status;
    report.status = status;
    await report.save();

    // Create notification for report owner
    if (oldStatus !== status) {
      await Notification.create({
        user_id: report.user_id,
        report_id: report.id,
        message: `Your report "${report.title}" status has been updated to ${status.replace('_', ' ')}`
      });
    }

    res.json({
      message: 'Report status updated successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update report', details: error.message });
  }
};

const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, suggested_solution, category, governorate, city, address, latitude, longitude, image_url } = req.body;

    const report = await Report.findByPk(id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Only report owner can edit (admin can only change status)
    if (report.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this report' });
    }

    // Update fields if provided
    if (title) report.title = title;
    if (description) report.description = description;
    if (suggested_solution !== undefined) report.suggested_solution = suggested_solution;
    if (category) report.category = category;
    if (governorate) report.governorate = governorate;
    if (city !== undefined) report.city = city;
    if (address !== undefined) report.address = address;
    if (latitude) report.latitude = latitude;
    if (longitude) report.longitude = longitude;
    if (image_url !== undefined) report.image_url = image_url;

    await report.save();

    const updatedReport = await Report.findByPk(id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
    });

    res.json({
      message: 'Report updated successfully',
      report: updatedReport
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update report', details: error.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByPk(id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Only admin or report owner can delete
    if (req.user.role !== 'admin' && report.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this report' });
    }

    await report.destroy();

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete report', details: error.message });
  }
};

const getReportStats = async (req, res) => {
  try {
    const totalReports = await Report.count();
    const openReports = await Report.count({ where: { status: 'open' } });
    const inProgressReports = await Report.count({ where: { status: 'in_progress' } });
    const resolvedReports = await Report.count({ where: { status: 'resolved' } });

    const categoryStats = await Report.findAll({
      attributes: [
        'category',
        [require('sequelize').fn('COUNT', 'id'), 'count']
      ],
      group: ['category']
    });

    res.json({
      stats: {
        total: totalReports,
        open: openReports,
        in_progress: inProgressReports,
        resolved: resolvedReports,
        byCategory: categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
  }
};

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  updateReportStatus,
  deleteReport,
  getReportStats
};
