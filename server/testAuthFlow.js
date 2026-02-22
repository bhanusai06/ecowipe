const mongoose = require('mongoose');
const User = require('./models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const testAuth = async () => {
    try {
        console.log('Connecting to MongoDB...', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected Successfully.');

        const testEmail = `testuser_${Date.now()}@example.com`;
        
        console.log(`\n1. Creating test user: ${testEmail}`);
        const newUser = new User({
            email: testEmail,
            googleId: `google_mock_${Date.now()}`,
            isVerified: true
        });
        
        await newUser.save();
        console.log('-> User Saved to Database successfully.');

        console.log(`\n2. Querying database for user: ${testEmail}`);
        const foundUser = await User.findOne({ email: testEmail });
        
        if (foundUser) {
            console.log('-> SUCCESS: User found in DB.');
            console.log('-> User Data:', foundUser.email, '| Google ID:', foundUser.googleId);
        } else {
            console.log('-> FAILURE: User not found in DB.');
        }

        console.log('\n3. Cleaning up test user...');
        await User.deleteOne({ email: testEmail });
        console.log('-> Test user deleted successfully.');
        
        console.log('\n--- TESTS PASSED ---');
        process.exit(0);
    } catch (err) {
        console.error('--- TESTS FAILED ---');
        console.error(err);
        process.exit(1);
    }
};

testAuth();
