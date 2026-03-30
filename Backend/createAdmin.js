const mongoose = require('mongoose');
const User = require('./models/userModel');
const dotenv = require('dotenv');

const env = (process.env.NODE_ENV || 'development').trim();
dotenv.config({ path: `./config.${env}.env` });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('✓ Connected to MongoDB');

        const adminData = {
            name: 'Admin User',
            email: 'admin@bookstore.com',
            password: 'Admin@123456',
            confirmPassword: 'Admin@123456',
            role: 'admin',
            isVerified: true, // Skip OTP verification for admin
            otp: undefined,
            otpExpires: undefined
        };

        let user = await User.findOne({ email: adminData.email });
        
        if (user) {
            console.log('⚠️  Admin user already exists. Updating...');
            user.name = adminData.name;
            user.role = 'admin';
            user.isVerified = true;
            user.password = adminData.password;
            user.confirmPassword = adminData.confirmPassword;
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            console.log('✓ Admin user updated successfully');
        } else {
            await User.create(adminData);
            console.log('✓ Admin user created successfully');
        }

        console.log('\n' + '='.repeat(50));
        console.log('🔐 ADMIN CREDENTIALS');
        console.log('='.repeat(50));
        console.log('Email:    admin@bookstore.com');
        console.log('Password: Admin@123456');
        console.log('Role:     admin');
        console.log('Status:   Verified (No OTP required)');
        console.log('='.repeat(50));
        console.log('\n✅ You can now login at: http://localhost:5173/login\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

console.log('🚀 Creating Admin User...\n');
createAdmin();
