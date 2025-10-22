const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/checkPermission');
const ActivityLog = require('../models/ActivityLog');

// GET /api/activity-logs
router.get('/', protect, checkPermission('activity_logs', 'view'), async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const filter = {};

    // Universal search across multiple fields
    if (search && search.trim()) {
      const searchRegex = new RegExp(search, 'i');
      
      // Get admin IDs that match the search term
      const Admin = require('../models/Admin');
      const matchingAdmins = await Admin.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ]
      }).select('_id');
      
      const adminIds = matchingAdmins.map(a => a._id);

      filter.$or = [
        { description: searchRegex },
        { actionType: searchRegex },
        { ipAddress: searchRegex },
        { admin: { $in: adminIds } }
      ];
    }

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
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching activity logs' 
    });
  }
});

module.exports = router;
