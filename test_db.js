import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Company from './models/superAdmin/Company.js';
import Branch from './models/superAdmin/Branch.js';
import AdminRole from './models/add_by_admin/Role.js';

dotenv.config();

async function run() {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully!");

    const roles = await AdminRole.find({});
    console.log(`\n--- ROLES (${roles.length}) ---`);
    console.log(JSON.stringify(roles, null, 2));

    const companies = await Company.find({});
    console.log(`\n--- COMPANIES (${companies.length}) ---`);
    console.log(JSON.stringify(companies, null, 2));

    const branches = await Branch.find({});
    console.log(`\n--- BRANCHES (${branches.length}) ---`);
    console.log(JSON.stringify(branches, null, 2));

    const users = await User.find({}).populate('role');
    console.log(`\n--- USERS (${users.length}) ---`);
    console.log(JSON.stringify(users, null, 2));

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
