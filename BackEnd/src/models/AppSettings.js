const mongoose = require('mongoose');

const appSettingsSchema = new mongoose.Schema({
  appName: {
    type: String,
    required: true,
    default: 'Admin Panel'
  },
  logoUrl: {
    type: String,
    default: null
  },
  faviconUrl: {
    type: String,
    default: null
  },
  contactEmail: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  supportPhone: {
    type: String,
    default: null
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: {
    type: String,
    default: 'We are currently performing scheduled maintenance. Please check back soon.'
  },
  allowRegistration: {
    type: Boolean,
    default: true
  },
  maxLoginAttempts: {
    type: Number,
    default: 5,
    min: 3,
    max: 10
  },
  sessionTimeout: {
    type: Number,
    default: 30, // minutes
    min: 5,
    max: 1440
  },
  dateFormat: {
    type: String,
    enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
    default: 'MM/DD/YYYY'
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  language: {
    type: String,
    enum: ['en', 'es', 'fr', 'de'],
    default: 'en'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure only one settings document exists
appSettingsSchema.statics.getSetting = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      appName: 'Admin Panel',
      contactEmail: 'admin@example.com'
    });
  }
  return settings;
};

module.exports = mongoose.model('AppSettings', appSettingsSchema);
