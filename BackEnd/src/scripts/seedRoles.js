const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Role = require('../models/Role');

dotenv.config();

const defaultRoles = [
  {
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    isDefault: true,
    isSuperAdmin: true, // Mark as super admin
    permissions: {
      dashboard: { view: true, edit: true },
      users: { view: true, create: true, edit: true, delete: true },
      products: { view: true, create: true, edit: true, delete: true },
      orders: { view: true, create: true, edit: true, delete: true },
      analytics: { view: true },
      roles: { view: true, create: true, edit: true, delete: true },
      admins: { view: true, create: true, edit: true, delete: true },
      settings: { view: true, edit: true },
      activity_logs: { view: true, edit: true, create: true, delete: true }
    }
  },
  {
    name: 'Content Manager',
    description: 'Manage products and content',
    isDefault: true,
    isSuperAdmin: false,
    permissions: {
      dashboard: { view: true, edit: false },
      users: { view: true, create: false, edit: false, delete: false },
      products: { view: true, create: true, edit: true, delete: true },
      orders: { view: true, create: false, edit: false, delete: false },
      analytics: { view: true },
      roles: { view: false, create: false, edit: false, delete: false },
      admins: { view: false, create: false, edit: false, delete: false },
      settings: { view: true, edit: false },
      activity_logs: { view: true, edit: true, create: true, delete: true }
    }
  },
  {
    name: 'Customer Support',
    description: 'Handle customer orders and inquiries',
    isDefault: true,
    isSuperAdmin: false,
    permissions: {
      dashboard: { view: true, edit: false },
      users: { view: true, create: false, edit: true, delete: false },
      products: { view: true, create: false, edit: false, delete: false },
      orders: { view: true, create: true, edit: true, delete: false },
      analytics: { view: false },
      roles: { view: false, create: false, edit: false, delete: false },
      admins: { view: false, create: false, edit: false, delete: false },
      settings: { view: true, edit: false }
    }
  },
  {
    name: 'Viewer',
    description: 'Read-only access to dashboard',
    isDefault: true,
    isSuperAdmin: false,
    permissions: {
      dashboard: { view: true, edit: false },
      users: { view: true, create: false, edit: false, delete: false },
      products: { view: true, create: false, edit: false, delete: false },
      orders: { view: true, create: false, edit: false, delete: false },
      analytics: { view: true },
      roles: { view: false, create: false, edit: false, delete: false },
      admins: { view: false, create: false, edit: false, delete: false },
      settings: { view: true, edit: false }
    }
  }
];

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected');

    // Clear existing roles
    await Role.deleteMany({});
    console.log('Cleared existing roles');

    // Create default roles
    await Role.insertMany(defaultRoles);
    console.log('Default roles created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
};

seedRoles();
