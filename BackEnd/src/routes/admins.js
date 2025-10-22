const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const Role = require('../models/Role');
const { protect } = require('../middleware/auth');
const { checkPermission, isSuperAdmin } = require('../middleware/checkPermission');
const { logActivity } = require('../utils/logActivity');

// @route   GET /api/admins
// @desc    Get all admins
// @access  Private (Super Admin OR admins.view permission)
router.get('/', protect, checkPermission('admins', 'view'), async (req, res) => {
  try {
    const admins = await Admin.find()
      .populate('roleId', 'name permissions isSuperAdmin')
      .select('-password')
      .sort({ createdAt: -1 });

    const adminsWithDetails = admins.map(admin => ({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      roleDetails: admin.roleId ? {
        _id: admin.roleId._id,
        name: admin.roleId.name,
        isSuperAdmin: admin.roleId.isSuperAdmin
      } : null,
      displayRole: admin.roleId ? admin.roleId.name : 'No Role',
      avatar: admin.getAvatarUrl(),
      department: admin.department,
      isActive: admin.isActive,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt
    }));

    res.status(200).json({
      success: true,
      data: {
        admins: adminsWithDetails,
        total: adminsWithDetails.length
      }
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admins/:id
// @desc    Get single admin
// @access  Private (admins.view permission)
router.get('/:id', protect, checkPermission('admins', 'view'), async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id)
      .populate('roleId')
      .select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        admin: {
          ...admin.toObject(),
          avatar: admin.getAvatarUrl(),
          displayRole: admin.roleId ? admin.roleId.name : 'No Role'
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

// @route   POST /api/admins
// @desc    Create new admin
// @access  Private (admins.create permission)
router.post(
  '/',
  protect,
  checkPermission('admins', 'create'),
  [
    body('name')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('roleId')
      .notEmpty()
      .withMessage('Role is required')
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

      const { name, email, password, roleId, phone, department } = req.body;

      // Check if admin exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Admin with this email already exists'
        });
      }

      // Verify role exists and is active
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role selected'
        });
      }
      
      if (!role.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Selected role is inactive'
        });
      }

      // Create admin
      const admin = await Admin.create({
        name,
        email,
        password,
        roleId,
        phone: phone || null,
        department: department || null
      });

      const adminWithRole = await Admin.findById(admin._id)
        .populate('roleId', 'name permissions isSuperAdmin')
        .select('-password');

      res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        data: {
          admin: {
            id: adminWithRole._id,
            name: adminWithRole.name,
            email: adminWithRole.email,
            phone: adminWithRole.phone,
            roleDetails: {
              _id: adminWithRole.roleId._id,
              name: adminWithRole.roleId.name,
              isSuperAdmin: adminWithRole.roleId.isSuperAdmin
            },
            displayRole: adminWithRole.roleId.name,
            avatar: adminWithRole.getAvatarUrl(),
            department: adminWithRole.department,
            isActive: adminWithRole.isActive,
            createdAt: adminWithRole.createdAt
          }
        }
      });
      await logActivity(req.admin._id, 'create', `Created Admin: ${adminWithRole.name} with Role: ${adminWithRole.roleId.name}`, { id: role._id }, req);
    } catch (error) {
      console.error('Create admin error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
);

// @route   PUT /api/admins/:id
// @desc    Update admin
// @access  Private (admins.edit permission)
router.put('/:id', protect, checkPermission('admins', 'edit'), async (req, res) => {
  try {
    const { name, email, roleId, phone, department, isActive } = req.body;

    let admin = await Admin.findById(req.params.id).populate('roleId');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Prevent super admin from being deactivated if it's the only one
    if (admin.roleId?.isSuperAdmin && isActive === false) {
      const superAdminCount = await Admin.countDocuments({
        'roleId': admin.roleId._id,
        isActive: true
      });

      if (superAdminCount === 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate the only super admin'
        });
      }
    }

    // Check email conflict
    if (email && email !== admin.email) {
      const existingAdmin = await Admin.findOne({
        email,
        _id: { $ne: req.params.id }
      });

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Verify role exists if provided and not empty
    if (roleId && roleId !== '' && roleId !== null) {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role selected'
        });
      }
      
      if (!role.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Selected role is inactive'
        });
      }
    }

    // Build update object
    const updateData = {
      name: name || admin.name,
      email: email || admin.email,
      phone: phone !== undefined ? phone : admin.phone,
      department: department !== undefined ? department : admin.department,
      isActive: isActive !== undefined ? isActive : admin.isActive
    };

    // Handle roleId specifically
    if (roleId !== undefined) {
      updateData.roleId = roleId;
    }

    admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('roleId', 'name permissions isSuperAdmin').select('-password');

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          roleDetails: admin.roleId ? {
            _id: admin.roleId._id,
            name: admin.roleId.name,
            isSuperAdmin: admin.roleId.isSuperAdmin
          } : null,
          displayRole: admin.roleId ? admin.roleId.name : 'No Role',
          avatar: admin.getAvatarUrl(),
          department: admin.department,
          isActive: admin.isActive,
          updatedAt: admin.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/admins/:id
// @desc    Delete admin
// @access  Private (admins.delete permission)
router.delete('/:id', protect, checkPermission('admins', 'delete'), async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).populate('roleId');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Prevent deleting the last super admin
    if (admin.roleId?.isSuperAdmin) {
      const superAdminCount = await Admin.countDocuments({
        'roleId': admin.roleId._id
      });

      if (superAdminCount === 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the only super admin'
        });
      }
    }

    // Prevent self-deletion
    if (admin._id.toString() === req.admin._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await Admin.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
