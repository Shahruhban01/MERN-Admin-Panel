const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Role = require('../models/Role');
const { protect } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @route   POST /api/auth/register
// @desc    Register new admin
// @access  Public
router.post(
  '/register',
  [
    body('name')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('roleId')
      .optional()
      .isMongoId()
      .withMessage('Invalid role ID')
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

      const { name, email, password, roleId } = req.body;

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Admin with this email already exists'
        });
      }

      // If roleId not provided, assign default role
      let assignedRoleId = roleId;
      if (!assignedRoleId) {
        // Find a default non-super-admin role
        const defaultRole = await Role.findOne({ 
          isDefault: true, 
          isSuperAdmin: false,
          isActive: true 
        });
        
        if (!defaultRole) {
          return res.status(400).json({
            success: false,
            message: 'No default role available. Please contact administrator.'
          });
        }
        
        assignedRoleId = defaultRole._id;
      } else {
        // Verify role exists
        const role = await Role.findById(roleId);
        if (!role) {
          return res.status(400).json({
            success: false,
            message: 'Invalid role selected'
          });
        }
      }

      // Create admin
      const admin = await Admin.create({
        name,
        email,
        password,
        roleId: assignedRoleId
      });

      // Populate role details
      await admin.populate('roleId', 'name permissions isSuperAdmin');

      // Generate token
      const token = generateToken(admin._id);

      res.status(201).json({
        success: true,
        message: 'Admin registered successfully',
        data: {
          token,
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            roleDetails: {
              _id: admin.roleId._id,
              name: admin.roleId.name,
              isSuperAdmin: admin.roleId.isSuperAdmin,
              permissions: admin.roleId.permissions
            },
            avatar: admin.getAvatarUrl(),
            createdAt: admin.createdAt
          }
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during registration',
        error: error.message
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login admin
// @access  Public
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
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

      const { email, password } = req.body;

      // Check if admin exists and get password
      const admin = await Admin.findOne({ email })
        .select('+password')
        .populate('roleId', 'name permissions isSuperAdmin isActive');
      
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if admin is active
      if (!admin.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated'
        });
      }

      // Check if role is active
      if (!admin.roleId || !admin.roleId.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Your role has been deactivated. Contact administrator.'
        });
      }

      // Verify password
      const isPasswordValid = await admin.comparePassword(password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Update last login
      admin.lastLogin = Date.now();
      await admin.save();

      // Generate token
      const token = generateToken(admin._id);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            roleDetails: {
              _id: admin.roleId._id,
              name: admin.roleId.name,
              isSuperAdmin: admin.roleId.isSuperAdmin,
              permissions: admin.roleId.permissions
            },
            avatar: admin.getAvatarUrl(),
            lastLogin: admin.lastLogin
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during login',
        error: error.message
      });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current logged in admin
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id)
      .populate('roleId', 'name permissions isSuperAdmin')
      .select('-password');

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
          roleDetails: {
            _id: admin.roleId._id,
            name: admin.roleId.name,
            isSuperAdmin: admin.roleId.isSuperAdmin,
            permissions: admin.roleId.permissions
          },
          avatar: admin.getAvatarUrl(),
          preferences: admin.preferences,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout admin
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

module.exports = router;
