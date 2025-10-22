const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const AppSettings = require('../models/AppSettings');
const { protect } = require('../middleware/auth');
const { checkPermission, optionalPermissionCheck } = require('../middleware/checkPermission');
const { logActivity } = require('../utils/logActivity');

// @route   GET /api/app-settings
// @desc    Get app settings (public minimal data if not authenticated)
// @access  Public/Private
router.get('/', optionalPermissionCheck, async (req, res) => {
  try {
    const settings = await AppSettings.getSetting();
    
    // If not authenticated, return only public info
    if (!req.admin) {
      return res.status(200).json({
        success: true,
        data: {
          settings: {
            appName: settings.appName,
            logoUrl: settings.logoUrl,
            faviconUrl: settings.faviconUrl,
            maintenanceMode: settings.maintenanceMode,
            maintenanceMessage: settings.maintenanceMode ? settings.maintenanceMessage : null,
            allowRegistration: settings.allowRegistration,
            language: settings.language
          }
        },
        meta: {
          version: '1.0.0',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Check if user has view permission
    if (!req.isSuperAdmin && !req.permissions?.settings?.view) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        code: 'PERMISSION_DENIED'
      });
    }

    // Return full settings for authenticated admins with permission
    res.status(200).json({
      success: true,
      data: { settings },
      meta: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        lastUpdatedBy: settings.updatedBy,
        lastUpdatedAt: settings.updatedAt
      }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching settings',
      code: 'SERVER_ERROR'
    });
  }
});

// @route   GET /api/app-settings/public
// @desc    Get public settings (for unauthenticated users/apps)
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const settings = await AppSettings.getSetting();
    
    res.status(200).json({
      success: true,
      data: {
        settings: {
          appName: settings.appName,
          logoUrl: settings.logoUrl,
          faviconUrl: settings.faviconUrl,
          contactEmail: settings.contactEmail,
          supportPhone: settings.supportPhone,
          maintenanceMode: settings.maintenanceMode,
          maintenanceMessage: settings.maintenanceMode ? settings.maintenanceMessage : null,
          allowRegistration: settings.allowRegistration,
          language: settings.language,
          timezone: settings.timezone,
          dateFormat: settings.dateFormat
        }
      },
      meta: {
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get public settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
});

// @route   GET /api/app-settings/field/:fieldName
// @desc    Get specific setting field
// @access  Public for certain fields, Private for sensitive ones
router.get('/field/:fieldName', async (req, res) => {
  try {
    const { fieldName } = req.params;
    const settings = await AppSettings.getSetting();

    // Public fields that don't require authentication
    const publicFields = [
      'appName', 
      'logoUrl', 
      'faviconUrl', 
      'maintenanceMode', 
      'allowRegistration',
      'language',
      'timezone',
      'dateFormat'
    ];

    if (!publicFields.includes(fieldName)) {
      return res.status(403).json({
        success: false,
        message: 'This field requires authentication',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!(fieldName in settings.toObject())) {
      return res.status(404).json({
        success: false,
        message: 'Setting field not found',
        code: 'FIELD_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        field: fieldName,
        value: settings[fieldName]
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get field error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
});

// @route   PUT /api/app-settings
// @desc    Update app settings (full or partial update)
// @access  Private (requires settings.edit)
router.put(
  '/',
  protect,
  checkPermission('settings', 'edit'),
  [
    body('appName').optional().trim().notEmpty().withMessage('App name cannot be empty'),
    body('logoUrl').optional().isURL().withMessage('Invalid logo URL'),
    body('faviconUrl').optional().isURL().withMessage('Invalid favicon URL'),
    body('contactEmail').optional().isEmail().withMessage('Invalid email format'),
    body('supportPhone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('maxLoginAttempts').optional().isInt({ min: 3, max: 10 }).withMessage('Must be between 3-10'),
    body('sessionTimeout').optional().isInt({ min: 5, max: 1440 }).withMessage('Must be between 5-1440 minutes'),
    body('maintenanceMode').optional().isBoolean().withMessage('Must be true or false'),
    body('allowRegistration').optional().isBoolean().withMessage('Must be true or false')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
          code: 'VALIDATION_ERROR'
        });
      }

      const settings = await AppSettings.getSetting();
      const updateData = {
        ...req.body,
        updatedBy: req.admin._id,
        updatedAt: Date.now()
      };

      // Track what changed for activity log
      const changes = [];
      Object.keys(req.body).forEach(key => {
        if (settings[key] !== req.body[key]) {
          changes.push(`${key}: ${settings[key]} → ${req.body[key]}`);
        }
      });

      Object.assign(settings, updateData);
      await settings.save();

      // Log activity
      await logActivity(
        req.admin._id,
        'settings_update',
        `Updated application settings: ${changes.join(', ')}`,
        { settingsId: settings._id, changes },
        req
      );

      res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        data: { settings },
        meta: {
          timestamp: new Date().toISOString(),
          updatedBy: req.admin.name
        }
      });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating settings',
        code: 'SERVER_ERROR'
      });
    }
  }
);

// @route   PATCH /api/app-settings/field/:fieldName
// @desc    Update a single setting field
// @access  Private (requires settings.edit)
router.patch(
  '/field/:fieldName',
  protect,
  checkPermission('settings', 'edit'),
  async (req, res) => {
    try {
      const { fieldName } = req.params;
      const { value } = req.body;

      if (value === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Value is required',
          code: 'VALUE_REQUIRED'
        });
      }

      const settings = await AppSettings.getSetting();

      if (!(fieldName in settings.toObject())) {
        return res.status(404).json({
          success: false,
          message: 'Setting field not found',
          code: 'FIELD_NOT_FOUND'
        });
      }

      const oldValue = settings[fieldName];
      settings[fieldName] = value;
      settings.updatedBy = req.admin._id;
      settings.updatedAt = Date.now();

      await settings.save();

      // Log activity
      await logActivity(
        req.admin._id,
        'settings_update',
        `Updated ${fieldName}: ${oldValue} → ${value}`,
        { settingsId: settings._id, field: fieldName },
        req
      );

      res.status(200).json({
        success: true,
        message: `${fieldName} updated successfully`,
        data: {
          field: fieldName,
          oldValue,
          newValue: value
        },
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Update field error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        code: 'SERVER_ERROR'
      });
    }
  }
);

// @route   POST /api/app-settings/reset
// @desc    Reset to default settings
// @access  Private (requires settings.edit)
router.post('/reset', protect, checkPermission('settings', 'edit'), async (req, res) => {
  try {
    const settings = await AppSettings.getSetting();
    
    const oldSettings = { ...settings.toObject() };

    // Reset to defaults
    settings.appName = 'Admin Panel';
    settings.logoUrl = null;
    settings.faviconUrl = null;
    settings.contactEmail = 'admin@example.com';
    settings.supportPhone = null;
    settings.maintenanceMode = false;
    settings.maintenanceMessage = 'We are currently performing scheduled maintenance. Please check back soon.';
    settings.allowRegistration = true;
    settings.maxLoginAttempts = 5;
    settings.sessionTimeout = 30;
    settings.dateFormat = 'MM/DD/YYYY';
    settings.timezone = 'UTC';
    settings.language = 'en';
    settings.updatedBy = req.admin._id;
    settings.updatedAt = Date.now();

    await settings.save();

    await logActivity(
      req.admin._id,
      'settings_update',
      'Reset application settings to defaults',
      { settingsId: settings._id, previousSettings: oldSettings },
      req
    );

    res.status(200).json({
      success: true,
      message: 'Settings reset to defaults',
      data: { settings },
      meta: {
        timestamp: new Date().toISOString(),
        resetBy: req.admin.name
      }
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      code: 'SERVER_ERROR'
    });
  }
});

// @route   POST /api/app-settings/toggle/:fieldName
// @desc    Toggle a boolean setting field
// @access  Private (requires settings.edit)
router.post(
  '/toggle/:fieldName',
  protect,
  checkPermission('settings', 'edit'),
  async (req, res) => {
    try {
      const { fieldName } = req.params;
      const settings = await AppSettings.getSetting();

      if (!(fieldName in settings.toObject())) {
        return res.status(404).json({
          success: false,
          message: 'Setting field not found',
          code: 'FIELD_NOT_FOUND'
        });
      }

      if (typeof settings[fieldName] !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'Field is not a boolean',
          code: 'INVALID_FIELD_TYPE'
        });
      }

      const oldValue = settings[fieldName];
      settings[fieldName] = !oldValue;
      settings.updatedBy = req.admin._id;
      settings.updatedAt = Date.now();

      await settings.save();

      await logActivity(
        req.admin._id,
        'settings_update',
        `Toggled ${fieldName}: ${oldValue} → ${!oldValue}`,
        { settingsId: settings._id, field: fieldName },
        req
      );

      res.status(200).json({
        success: true,
        message: `${fieldName} toggled successfully`,
        data: {
          field: fieldName,
          value: settings[fieldName]
        },
        meta: {
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Toggle field error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        code: 'SERVER_ERROR'
      });
    }
  }
);

// @route   GET /api/app-settings/version
// @desc    Get API version info
// @access  Public
router.get('/version', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      apiVersion: '1.0.0',
      appVersion: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;
