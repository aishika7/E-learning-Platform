// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/elearning';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing users
    // await User.deleteMany();
    // console.log('🗑️  Cleared existing users');

    const hashedAdminPassword = await bcrypt.hash('Admin@123', 12);
    const hashedInstructorPassword = await bcrypt.hash('Instructor@123', 12);
    const hashedStudentPassword = await bcrypt.hash('Student@123', 12);

    const usersToSeed = [
      {
        name: 'Admin User',
        email: 'admin@elearn.com',
        password: hashedAdminPassword,
        role: 'admin',
        isActive: true,
      },
      {
        name: 'Jane Instructor',
        email: 'instructor@elearn.com',
        password: hashedInstructorPassword,
        role: 'instructor',
        isActive: true,
      },
      {
        name: 'John Student',
        email: 'student@elearn.com',
        password: hashedStudentPassword,
        role: 'student',
        isActive: true,
      },
    ];

    for (const user of usersToSeed) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        await User.create(user);
        console.log(`👤 Created user: ${user.email} (${user.role})`);
      } else {
        console.log(`⚠️  User already exists: ${user.email} (${user.role})`);
      }
    }

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
