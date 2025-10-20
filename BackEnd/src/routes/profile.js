const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');
const upload = require('../config/multer');
const fs = require('fs');
const path = require('path');

// @route   GET /api/profile
// @desc    Get admin profile
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    
    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          bio: admin.bio,
          department: admin.department,
          role: admin.role,
          avatar: admin.getAvatarUrl(),
          preferences: admin.preferences,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/profile
// @desc    Update admin profile
// @access  Private
router.put(
  '/',
  protect,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('phone')
      .optional()
      .trim(),
    body('bio')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    body('department')
      .optional()
      .trim()
  ],
  async (req, res) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { name, email, phone, bio, department } = req.body;
      const updateFields = {};

      if (name) updateFields.name = name;
      if (email) {
        // Check if email is already taken by another admin
        const existingAdmin = await Admin.findOne({ 
          email, 
          _id: { $ne: req.admin._id } 
        });
        
        if (existingAdmin) {
          return res.status(400).json({
            success: false,
            message: 'Email is already in use'
          });
        }
        updateFields.email = email;
      }
      if (phone !== undefined) updateFields.phone = phone;
      if (bio !== undefined) updateFields.bio = bio;
      if (department !== undefined) updateFields.department = department;

      const admin = await Admin.findByIdAndUpdate(
        req.admin._id,
        { $set: updateFields },
        { new: true, runValidators: true }
      ).select('-password');

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            bio: admin.bio,
            department: admin.department,
            role: admin.role,
            avatar: admin.getAvatarUrl(),
            preferences: admin.preferences,
            updatedAt: admin.updatedAt
          }
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during profile update',
        error: error.message
      });
    }
  }
);

// @route   POST /api/profile/avatar
// @desc    Upload avatar
// @access  Private
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const admin = await Admin.findById(req.admin._id);

    // Delete old avatar if exists and is not default
    if (admin.avatar && !admin.avatar.includes('ui-avatars.com')) {
      const oldAvatarPath = path.join(__dirname, '..', admin.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Save new avatar path
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    admin.avatar = avatarPath;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: `${req.protocol}://${req.get('host')}${avatarPath}`
      }
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    
    // Delete uploaded file if database operation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during avatar upload',
      error: error.message
    });
  }
});

// @route   DELETE /api/profile/avatar
// @desc    Delete avatar
// @access  Private
router.delete('/avatar', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    // Delete avatar file if exists
    if (admin.avatar && !admin.avatar.includes('ui-avatars.com')) {
      const avatarPath = path.join(__dirname, '..', admin.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    admin.avatar = null;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Avatar deleted successfully',
      data: {
        avatar: admin.getAvatarUrl()
      }
    });
  } catch (error) {
    console.error('Avatar delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during avatar deletion',
      error: error.message
    });
  }
});

// @route   PUT /api/profile/password
// @desc    Change password
// @access  Private
router.put(
  '/password',
  protect,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage('Passwords do not match')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;

      const admin = await Admin.findById(req.admin._id).select('+password');

      // Verify current password
      const isPasswordValid = await admin.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      admin.password = newPassword;
      await admin.save();

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during password change',
        error: error.message
      });
    }
  }
);

// @route   PUT /api/profile/preferences
// @desc    Update preferences
// @access  Private
router.put('/preferences', protect, async (req, res) => {
  try {
    const { theme, emailNotifications, dashboardLayout, language } = req.body;
    const updateFields = {};

    if (theme) updateFields['preferences.theme'] = theme;
    if (emailNotifications !== undefined) updateFields['preferences.emailNotifications'] = emailNotifications;
    if (dashboardLayout) updateFields['preferences.dashboardLayout'] = dashboardLayout;
    if (language) updateFields['preferences.language'] = language;

    const admin = await Admin.findByIdAndUpdate(
      req.admin._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: admin.preferences
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during preferences update',
      error: error.message
    });
  }
});

module.exports = router;
