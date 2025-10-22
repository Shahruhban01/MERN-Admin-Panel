const ActivityLog = require('../models/ActivityLog');

async function logActivity(adminId, actionType, description, affectedRecord = null, req = null) {
  try {
    const ipAddress = req?.ip || req?.connection?.remoteAddress || null;
    const userAgent = req?.headers['user-agent'] || null;

    const log = new ActivityLog({
      admin: adminId,
      actionType,
      description,
      affectedRecord,
      ipAddress,
      userAgent
    });

    await log.save();
  } catch (error) {
    console.error('Error recording activity log:', error);
  }
}

module.exports = { logActivity };
