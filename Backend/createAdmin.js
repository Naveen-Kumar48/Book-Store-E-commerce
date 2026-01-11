const mongoose = require('mongoose');
const User = require('./models/userModel');
const dotenv = require('dotenv');

dotenv.config({ path: './config.development.env' });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to DB');

        const adminData = {
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'adminpassword123',
            confirmPassword: 'adminpassword123',
            role: 'admin',
            isVerified: true
        };

        let user = await User.findOne({ email: adminData.email });
        if (user) {
            console.log('Admin user already exists. Updating role...');
            user.role = 'admin';
            user.isVerified = true;
            user.password = adminData.password;
            user.confirmPassword = adminData.confirmPassword;
            await user.save();
        } else {
            await User.create(adminData);
            console.log('Admin user created successfully');
        }

        console.log('-----------------------------------');
        console.log('Admin Credentials Created:');
        console.log('Email:    admin@example.com');
        console.log('Password: adminpassword123');
        console.log('-----------------------------------');

        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
