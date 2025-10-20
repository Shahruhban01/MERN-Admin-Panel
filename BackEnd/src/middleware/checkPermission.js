const Role = require('../models/Role');
const Admin = require('../models/Admin');

// Main permission checker middleware
const checkPermission = (module, action) => {
  return async (req, res, next) => {
    try {
      // Get admin with populated role
      const admin = await Admin.findById(req.admin._id).populate('roleId');

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Admin not found'
        });
      }

      // Check if admin is active
      if (!admin.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been deactivated'
        });
      }

      // Check if admin has a role assigned
      if (!admin.roleId) {
        return res.status(403).json({
          success: false,
          message: 'No role assigned. Contact administrator.',
          requiredPermission: { module, action }
        });
      }

      // Check if role is active
      if (!admin.roleId.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Your role has been deactivated. Contact administrator.',
          requiredPermission: { module, action }
        });
      }

      // Super admin has all permissions - bypass all checks
      if (admin.roleId.isSuperAdmin) {
        req.permissions = admin.roleId.permissions;
        req.isSuperAdmin = true;
        req.currentAdmin = admin;
        return next();
      }

      // Check if the module exists in permissions
      if (!admin.roleId.permissions[module]) {
        return res.status(403).json({
          success: false,
          message: `Access denied. You don't have permission to access ${module}`,
          requiredPermission: { module, action }
        });
      }

      // Check specific permission
      const hasPermission = admin.roleId.permissions[module][action];

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied. You don't have permission to ${action} ${module}`,
          requiredPermission: { module, action }
        });
      }

      // Attach permissions and admin to request for use in route handlers
      req.permissions = admin.roleId.permissions;
      req.isSuperAdmin = false;
      req.currentAdmin = admin;

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking permissions',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
};

// Check if user is super admin
const isSuperAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id).populate('roleId');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    if (!admin.roleId) {
      return res.status(403).json({
        success: false,
        message: 'No role assigned'
      });
    }

    if (!admin.roleId.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Super admin privileges required.'
      });
    }
    
    req.isSuperAdmin = true;
    req.currentAdmin = admin;
    req.permissions = admin.roleId.permissions;
    next();
  } catch (error) {
    console.error('Super admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking admin role',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Check multiple permissions (requires at least one)
const checkAnyPermission = (permissions) => {
  return async (req, res, next) => {
    try {
      const admin = await Admin.findById(req.admin._id).populate('roleId');

      if (!admin || !admin.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      if (!admin.roleId) {
        return res.status(403).json({
          success: false,
          message: 'No role assigned'
        });
      }

      // Super admin bypasses
      if (admin.roleId.isSuperAdmin) {
        req.permissions = admin.roleId.permissions;
        req.isSuperAdmin = true;
        req.currentAdmin = admin;
        return next();
      }

      const hasAnyPermission = permissions.some(({ module, action }) => 
        admin.roleId.permissions[module]?.[action]
      );

      if (!hasAnyPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          requiredPermissions: permissions
        });
      }

      req.permissions = admin.roleId.permissions;
      req.currentAdmin = admin;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      });
    }
  };
};

// Check all permissions (requires all)
const checkAllPermissions = (permissions) => {
  return async (req, res, next) => {
    try {
      const admin = await Admin.findById(req.admin._id).populate('roleId');

      if (!admin || !admin.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      if (!admin.roleId) {
        return res.status(403).json({
          success: false,
          message: 'No role assigned'
        });
      }

      // Super admin bypasses
      if (admin.roleId.isSuperAdmin) {
        req.permissions = admin.roleId.permissions;
        req.isSuperAdmin = true;
        req.currentAdmin = admin;
        return next();
      }

      const hasAllPermissions = permissions.every(({ module, action }) => 
        admin.roleId.permissions[module]?.[action]
      );

      if (!hasAllPermissions) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          requiredPermissions: permissions
        });
      }

      req.permissions = admin.roleId.permissions;
      req.currentAdmin = admin;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      });
    }
  };
};

// Optional permission check - allows access but attaches permission info
const optionalPermissionCheck = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id).populate('roleId');
    
    if (admin && admin.roleId) {
      req.permissions = admin.roleId.permissions;
      req.isSuperAdmin = admin.roleId.isSuperAdmin || false;
      req.currentAdmin = admin;
    }
    
    next();
  } catch (error) {
    console.error('Optional permission check error:', error);
    next();
  }
};

module.exports = { 
  checkPermission, 
  isSuperAdmin, 
  checkAnyPermission, 
  checkAllPermissions,
  optionalPermissionCheck
};
