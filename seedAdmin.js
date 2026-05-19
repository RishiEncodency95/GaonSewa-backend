import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Role from './models/add_by_admin/Role.js';
import Sidebar from './models/add_by_admin/Sidebar.js';

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected for seeding... 🚀');

    // 2. Create Super Admin Role (Global)
    const superAdminRoleData = {
      role: 'Super Admin',
      roleName: 'System Administrator',
      status: 'Active',
      added_by: 'System Seed'
    };

    let superAdminRole = await Role.findOne({ role: 'Super Admin' });
    if (!superAdminRole) {
      superAdminRole = await Role.create(superAdminRoleData);
      console.log('Super Admin Role created! 🛡️');
    }

    // 3. Data for Super Admin User
    const superAdminData = {
      name: 'Rishi Kumar',
      email: 'rishi.encodency95@gmail.com',
      password: 'admin@123',
      status: 'Active',
      role: superAdminRole._id // Use the role's ObjectId
    };

    // 4. Check if user exists
    const existingUser = await User.findOne({ email: superAdminData.email });
    if (existingUser) {
      console.log('User already exists! Updating roles and password...');
      existingUser.role = superAdminRole._id;
      existingUser.password = superAdminData.password;
      await existingUser.save();
      console.log('User roles and password updated successfully! ✅');
    } else {
      // Create User
      await User.create(superAdminData);
      console.log('Super Admin User created successfully! 🎉');
    }

    // 5. Seed Sidebar Items
    console.log('Seeding Sidebar items... 📋');
    const initialSidebarItems = [
      { label: 'Companies', path: '/companies', section: 'SUPER ADMIN', sectionOrder: 1, icon: 'MdBusiness', parentMenu: '' },
      { label: 'Manage', path: '', section: 'SUPER ADMIN', sectionOrder: 1, icon: 'MdManageAccounts', parentMenu: '' },
      { label: 'Branches', path: '/branches', section: 'SUPER ADMIN', sectionOrder: 1, icon: '', parentMenu: 'Manage' },
      { label: 'Branch Users', path: '/branch-users', section: 'SUPER ADMIN', sectionOrder: 1, icon: '', parentMenu: 'Manage' },

      { label: 'Dashboard', path: '/', section: 'MAIN', sectionOrder: 2, icon: 'MdDashboard', parentMenu: '' },
      { label: 'Operations', path: '', section: 'MAIN', sectionOrder: 2, icon: 'MdSettings', parentMenu: '' },
      { label: 'Dashboard', path: '/', section: 'MAIN', sectionOrder: 2, icon: '', parentMenu: 'Operations' },
      { label: 'Products', path: '/products', section: 'MAIN', sectionOrder: 2, icon: '', parentMenu: 'Operations' },
      { label: 'Orders', path: '/orders', section: 'MAIN', sectionOrder: 2, icon: '', parentMenu: 'Operations' },

      { label: 'Management', path: '', section: 'MAIN', sectionOrder: 2, icon: 'MdPeople', parentMenu: '' },
      { label: 'Branches', path: '/branches', section: 'MAIN', sectionOrder: 2, icon: '', parentMenu: 'Management' },
      { label: 'Roles', path: '/roles', section: 'MAIN', sectionOrder: 2, icon: '', parentMenu: 'Management' },

      { label: 'Website', path: '', section: 'MAIN', sectionOrder: 2, icon: 'MdWeb', parentMenu: '' },
      { label: 'Hero Section', path: '/hero', section: 'MAIN', sectionOrder: 2, icon: '', parentMenu: 'Website' },

      { label: 'Add By Admin', path: '', section: 'ADMIN MANAGEMENT', sectionOrder: 3, icon: 'MdAdminPanelSettings', parentMenu: '' },
      { label: 'Add Occupation', path: '/addOccupation', section: 'ADMIN MANAGEMENT', sectionOrder: 3, icon: '', parentMenu: 'Add By Admin' },
      { label: 'Add Sidebar', path: '/addSidebar', section: 'ADMIN MANAGEMENT', sectionOrder: 3, icon: '', parentMenu: 'Add By Admin' },

      { label: 'Users', path: '', section: 'ADMIN MANAGEMENT', sectionOrder: 3, icon: 'FiUsers', parentMenu: '' },
      { label: 'Add User', path: '/addUser', section: 'ADMIN MANAGEMENT', sectionOrder: 3, icon: '', parentMenu: 'Users' },
      { label: 'User List', path: '/userList', section: 'ADMIN MANAGEMENT', sectionOrder: 3, icon: '', parentMenu: 'Users' },

      { label: 'Blogs', path: '', section: 'CONTENT', sectionOrder: 4, icon: 'MdArticle', parentMenu: '' },
      { label: 'Add Blog', path: '/addBlog', section: 'CONTENT', sectionOrder: 4, icon: '', parentMenu: 'Blogs' },
      { label: 'Blog List', path: '/blogList', section: 'CONTENT', sectionOrder: 4, icon: '', parentMenu: 'Blogs' },
      { label: 'FAQ', path: '/faq', section: 'CONTENT', sectionOrder: 4, icon: 'MdQuestionAnswer', parentMenu: '' },
    ];

    for (const item of initialSidebarItems) {
      await Sidebar.findOneAndUpdate(
        { label: item.label, section: item.section, parentMenu: item.parentMenu },
        { $set: { ...item, added_by: 'System Seed', status: 'Active' } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log('Sidebar items seeded successfully! ✅');

    console.log('Seeding completed! Email: rishi.encodency95@gmail.com');
    process.exit();
  } catch (err) {
    console.error('Error seeding Super Admin:', err.message);
    process.exit(1);
  }
};

seedSuperAdmin();
