const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP
router.post('/send-otp', async (req, res) => {
    try {
        const { email, type } = req.body;
        const user = await User.findOne({ email });

        if (type === 'register' && user) {
            return res.status(400).send("User with this email already exists.");
        }
        if (type === 'reset' && !user) {
            return res.status(400).send("User with this email does not exist.");
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        console.log(`DEBUG: Generated OTP for ${email}: ${otp}`); // Log OTP for testing

        if (!user && type === 'register') {
            // Create temporary user document for registration
            // Check if there is already a pending unverified user
            let pendingUser = await User.findOne({ email, isVerified: false });
            if (pendingUser) {
                pendingUser.otp = otp;
                pendingUser.otpExpires = otpExpires;
                await pendingUser.save();
            } else {
                const newUser = new User({
                    email,
                    otp,
                    otpExpires,
                    isVerified: false
                });
                await newUser.save();
            }
        } else if (user) {
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        }

        const subject = type === 'register' ? "EcoWIPE Registration OTP" : "EcoWIPE Password Reset OTP";
        const message = `Your OTP for ${type === 'register' ? 'registration' : 'password reset'} is ${otp}. It expires in 10 minutes.`;

        await sendEmail(email, subject, message);
        res.status(200).send("OTP sent successfully");

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred sending OTP");
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).send("User not found");

        if (user.otp !== otp) {
            return res.status(400).send("Invalid OTP");
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).send("OTP expired");
        }

        // OTP is valid
        user.isVerified = true;
        user.otp = undefined; // Clear OTP
        user.otpExpires = undefined;
        await user.save();

        // Return a temporary token to allow the next step (password creation/reset)
        const token = jwt.sign({ _id: user._id, email: user.email, scope: 'verified' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '15m' });

        res.header('auth-token', token).send({ token, message: "OTP Verified" });

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred verifying OTP");
    }
});

// Register (Complete Registration after OTP)
router.post('/register-complete', async (req, res) => {
    try {
        const { email, password, token } = req.body;

        const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        if (verified.email !== email || verified.scope !== 'verified') {
            return res.status(400).send("Invalid or expired verification token");
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).send("User not found (flow error)");

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        await user.save();

        // Login the user immediately
        const loginToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'fallback_secret');
        res.header('auth-token', loginToken).send({ token: loginToken, message: "Account created successfully", user: user._id });

    } catch (err) {
        console.error(err);
        res.status(400).send("Invalid Token or Error");
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, password, token } = req.body;

        const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        if (verified.email !== email || verified.scope !== 'verified') {
            return res.status(400).send("Invalid or expired verification token");
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).send("User not found");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        await user.save();

        res.send("Password reset successfully");

    } catch (err) {
        console.error(err);
        res.status(400).send("Invalid Token or Error");
    }
});

// Google Auth
router.post('/google', async (req, res) => {
    console.log('Google Auth request received:', req.body);
    try {
        const { email, googleId } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if not exists
            user = new User({
                email,
                googleId,
            });
            await user.save();
        } else if (!user.googleId) {
            // Link googleId if user exists but hasn't used Google Auth before
            user.googleId = googleId;
            await user.save();
        }

        // Create and assign a token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'fallback_secret');
        res.header('auth-token', token).send({ token });

    } catch (err) {
        console.error('Google Auth error:', err);
        res.status(400).send(err);
    }
});

// Register
router.post('/register', async (req, res) => {
    console.log('Register request:', req.body);
    try {
        // Check if user already exists
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) return res.status(400).send('Email already exists');

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const user = new User({
            email: req.body.email,
            password: hashPassword,
        });

        const savedUser = await user.save();
        console.log('User saved:', savedUser._id);
        res.send({ user: user._id });
    } catch (err) {
        console.error('Register error:', err);
        res.status(400).send(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    console.log('Login request:', req.body);
    try {
        // Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Email is not found');

        // Check password
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send('Invalid password');

        // Create and assign a token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.header('auth-token', token).send({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(400).send(err);
    }
});

module.exports = router;
