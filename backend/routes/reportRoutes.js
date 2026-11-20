const express = require('express');
const router = express.Router();
const {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  updateReportStatus,
  deleteReport,
  getReportStats
} = require('../controllers/reportController');
const { authenticateUser, authorizeAdmin } = require('../auth/middleware');

router.post('/', authenticateUser, createReport);
router.get('/', getAllReports);
router.get('/stats', authenticateUser, getReportStats);
router.get('/:id', getReportById);
router.put('/:id', authenticateUser, updateReport);
router.patch('/:id/status', authenticateUser, authorizeAdmin, updateReportStatus);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteReport);

module.exports = router;
