const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const Role = require('../models/Role');

dotenv.config();

const createFirstAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected');

    // Check if super admin role exists
    let superAdminRole = await Role.findOne({ isSuperAdmin: true });
    
    if (!superAdminRole) {
      console.log('Creating Super Admin role...');
      superAdminRole = await Role.create({
        name: 'Super Admin',
        description: 'Full system access with all permissions',
        isDefault: true,
        isSuperAdmin: true,
        permissions: {
          dashboard: { view: true, edit: true },
          users: { view: true, create: true, edit: true, delete: true },
          products: { view: true, create: true, edit: true, delete: true },
          orders: { view: true, create: true, edit: true, delete: true },
          analytics: { view: true },
          roles: { view: true, create: true, edit: true, delete: true },
          admins: { view: true, create: true, edit: true, delete: true },
          settings: { view: true, edit: true }
        }
      });
      console.log('Super Admin role created');
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists with email: admin@example.com');
      process.exit(0);
    }

    // Create first admin
    const admin = await Admin.create({
      name: 'Super Administrator',
      email: 'admin@example.com',
      password: 'Admin@123456', // Change this password
      roleId: superAdminRole._id,
      isActive: true
    });

    console.log('✅ First Super Admin created successfully!');
    console.log('-----------------------------------');
    console.log('Email:', admin.email);
    console.log('Password: Admin@123456');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('-----------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating first admin:', error);
    process.exit(1);
  }
};

createFirstAdmin();
