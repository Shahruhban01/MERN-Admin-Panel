const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Role = require('../models/Role');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/checkPermission');
const { logActivity } = require('../utils/logActivity');


// @route   GET /api/roles
// @desc    Get all roles
// @access  Private (roles.view permission)
router.get('/', protect, checkPermission('roles', 'view'), async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    
    // Get admin count for each role
    const rolesWithCount = await Promise.all(
      roles.map(async (role) => {
        const adminCount = await Admin.countDocuments({ roleId: role._id });
        return {
          ...role.toObject(),
          adminCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        roles: rolesWithCount
      }
    });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/roles/:id
// @desc    Get single role
// @access  Private (roles.view permission)
router.get('/:id', protect, checkPermission('roles', 'view'), async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { role }
    });
  } catch (error) {
    console.error('Get role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/roles
// @desc    Create new role
// @access  Private (roles.create permission)
router.post(
  '/',
  protect,
  checkPermission('roles', 'create'),
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Role name is required')
      .isLength({ min: 2 })
      .withMessage('Role name must be at least 2 characters'),
    body('description')
      .optional()
      .trim()
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

      const { name, description, permissions, isSuperAdmin } = req.body;

      // Check if role already exists
      const existingRole = await Role.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') } 
      });

      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: 'Role with this name already exists'
        });
      }

      // Only super admins can create super admin roles
      if (isSuperAdmin && !req.isSuperAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only super admins can create super admin roles'
        });
      }

      const role = await Role.create({
        name,
        description,
        permissions,
        isSuperAdmin: isSuperAdmin || false
      });

      res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: { role }
      });
      await logActivity(req.admin._id, 'create', `Created new role: ${role.name} with permissions: ${JSON.stringify(role.permissions)}`, { id: role._id }, req);
    } catch (error) {
      console.error('Create role error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
);

// @route   PUT /api/roles/:id
// @desc    Update role
// @access  Private (roles.edit permission)
router.put('/:id', protect, checkPermission('roles', 'edit'), async (req, res) => {
  try {
    const { name, description, permissions, isActive } = req.body;

    let role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Prevent editing super admin role if not super admin
    if (role.isSuperAdmin && !req.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only super admins can edit super admin roles'
      });
    }

    // Check if role is default
    if (role.isDefault && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate default role'
      });
    }

    // Check if new name conflicts with existing role
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });

      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: 'Role with this name already exists'
        });
      }
    }

    role = await Role.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: name || role.name,
          description: description !== undefined ? description : role.description,
          permissions: permissions || role.permissions,
          isActive: isActive !== undefined ? isActive : role.isActive
        }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: { role }
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/roles/:id
// @desc    Delete role
// @access  Private (roles.delete permission)
router.delete('/:id', protect, checkPermission('roles', 'delete'), async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Prevent deleting super admin role
    if (role.isSuperAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete super admin role'
      });
    }

    // Check if role is default
    if (role.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default role'
      });
    }

    // Check if any admins are using this role
    const adminCount = await Admin.countDocuments({ roleId: role._id });

    if (adminCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. ${adminCount} admin(s) are assigned to this role.`
      });
    }

    await Role.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
