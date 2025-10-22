const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  actionType: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'create',
      'update',
      'delete',
      'role_change',
      'settings_update',
      'other'
    ]
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  affectedRecord: {
    type: mongoose.Schema.Types.Mixed, // could contain record ID, collection, details
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
