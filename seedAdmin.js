import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Role from './models/Role.js';

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected for seeding... 🚀');

    // 2. Create Super Admin Role (Global)
    const superAdminRoleData = {
      name: 'Super Admin',
      description: 'Platform-wide full access',
      permissions: {
        orders: { read: true, write: true, delete: true },
        inventory: { read: true, write: true },
        hr: { read: true, write: true },
        finance: { read: true, write: true },
        logistics: { read: true, write: true },
        settings: { read: true, write: true }
      }
    };

    let superAdminRole = await Role.findOne({ name: 'Super Admin', companyId: null });
    if (!superAdminRole) {
      superAdminRole = await Role.create(superAdminRoleData);
      console.log('Super Admin Role created! 🛡️');
    }

    // 3. Data for Super Admin User
    const superAdminData = {
      name: 'Rishi Kumar',
      email: 'rishi.encodency95@gmail.com',
      password: 'admin@123',
      isSuperAdmin: true,
      status: 'Active',
      roles: [superAdminRole._id]
    };

    // 4. Check if user exists
    const existingUser = await User.findOne({ email: superAdminData.email });
    if (existingUser) {
      console.log('User already exists! Updating roles...');
      existingUser.roles = [superAdminRole._id];
      existingUser.isSuperAdmin = true;
      await existingUser.save();
      console.log('User roles updated successfully! ✅');
    } else {
      // Create User
      await User.create(superAdminData);
      console.log('Super Admin User created successfully! 🎉');
    }

    console.log('Seeding completed! Email: rishi.encodency95@gmail.com');
    process.exit();
  } catch (err) {
    console.error('Error seeding Super Admin:', err.message);
    process.exit(1);
  }
};

seedSuperAdmin();
