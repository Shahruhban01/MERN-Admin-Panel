import React from 'react';
import { useAuth } from '../context/AuthContext';

function PermissionGuard({ 
  module, 
  action, 
  children, 
  fallback = null,
  requireAll = false,
  permissions = [] 
}) {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = useAuth();

  let hasAccess = false;

  if (permissions.length > 0) {
    // Multiple permissions check
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else if (module && action) {
    // Single permission check
    hasAccess = hasPermission(module, action);
  }

  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
}

export default PermissionGuard;
