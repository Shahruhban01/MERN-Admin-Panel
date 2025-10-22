const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/checkPermission');
const ActivityLog = require('../models/ActivityLog');

// GET /api/activity-logs
router.get('/', protect, checkPermission('activity_logs', 'view'), async (req, res) => {
  try {
    const { actionType, admin, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (admin) filter.admin = admin;
    if (actionType) filter.actionType = new RegExp(actionType, 'i');

    const total = await ActivityLog.countDocuments(filter);
    const logs = await ActivityLog.find(filter)
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: { logs },
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching activity logs' });
  }
});

module.exports = router;
