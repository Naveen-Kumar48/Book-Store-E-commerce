const env = (process.env.NODE_ENV || 'development').trim();
require("dotenv").config({
  path: `./config.${env}.env`,
});

const mongoose = require('mongoose');
const User = require('./models/userModel');
const bcrypt = require('bcrypt');

async function diagnoseLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✓ Connected to MongoDB\n');

    // Get email from command line or use default
    const testEmail = process.argv[2] || 'admin@bookstore.com';
    const testPassword = process.argv[3] || 'Admin@123456';

    console.log('='.repeat(60));
    console.log('🔍 LOGIN DIAGNOSTIC TOOL');
    console.log('='.repeat(60));
    console.log(`Testing login for: ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    console.log('='.repeat(60) + '\n');

    // Step 1: Check if user exists
    console.log('Step 1: Checking if user exists...');
    const user = await User.findOne({ email: testEmail }).select('+password');
    
    if (!user) {
      console.log('❌ ISSUE FOUND: User does not exist in database');
      console.log('\n💡 Solution:');
      console.log('   - For admin: Run "node createAdmin.js"');
      console.log('   - For regular user: Complete signup with OTP verification');
      process.exit(1);
    }
    
    console.log('✓ User exists\n');

    // Step 2: Check verification status
    console.log('Step 2: Checking verification status...');
    console.log(`   isVerified: ${user.isVerified}`);
    
    if (!user.isVerified) {
      console.log('❌ ISSUE FOUND: User is not verified');
      console.log('\n💡 Solution:');
      console.log('   - Complete OTP verification');
      console.log('   - Or run: node createAdmin.js (for admin)');
      process.exit(1);
    }
    
    console.log('✓ User is verified\n');

    // Step 3: Check password
    console.log('Step 3: Checking password...');
    console.log(`   Stored password hash: ${user.password.substring(0, 20)}...`);
    
    const passwordMatch = await bcrypt.compare(testPassword, user.password);
    console.log(`   Password match: ${passwordMatch}`);
    
    if (!passwordMatch) {
      console.log('❌ ISSUE FOUND: Password does not match');
      console.log('\n💡 Solution:');
      console.log('   - Check if you\'re using the correct password');
      console.log('   - Password is case-sensitive');
      console.log('   - For admin default: Admin@123456');
      process.exit(1);
    }
    
    console.log('✓ Password matches\n');

    // Step 4: Check role
    console.log('Step 4: Checking user role...');
    console.log(`   Role: ${user.role}`);
    console.log('✓ Role is valid\n');

    // All checks passed
    console.log('='.repeat(60));
    console.log('✅ ALL CHECKS PASSED - LOGIN SHOULD WORK!');
    console.log('='.repeat(60));
    console.log('\nUser Details:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Verified: ${user.isVerified}`);
    console.log('\n💡 If login still fails, check:');
    console.log('   1. Backend server is running');
    console.log('   2. Frontend is sending correct data');
    console.log('   3. Check backend console logs for [LOGIN] messages');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

console.log('\n');
diagnoseLogin();
