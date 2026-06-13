const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const verifyToken = require('../middleware/verifyToken');

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP
router.post('/send-otp', async (req, res) => {
    console.log('DEBUG: Entering /send-otp route');
    try {
        const { email, type } = req.body;
        console.log(`DEBUG: Request body: ${JSON.stringify(req.body)}`);

        const user = await User.findOne({ email });
        console.log(`DEBUG: User found: ${user ? user._id : 'null'}`);

        if (type === 'register' && user) {
            console.log('DEBUG: User exists, returning 400');
            return res.status(400).send("User with this email already exists.");
        }
        if (type === 'reset' && !user) {
            console.log('DEBUG: User not found for reset, returning 400');
            return res.status(400).send("User with this email does not exist.");
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        console.log(`DEBUG: Generated OTP for ${email}: ${otp}`); // Log OTP for testing

        if (!user && type === 'register') {
            console.log('DEBUG: Creating new user/pending user');
            // Create temporary user document for registration
            // Check if there is already a pending unverified user
            let pendingUser = await User.findOne({ email, isVerified: false });
            if (pendingUser) {
                console.log('DEBUG: Updating pending user');
                pendingUser.otp = otp;
                pendingUser.otpExpires = otpExpires;
                await pendingUser.save();
            } else {
                console.log('DEBUG: Creating new user');
                // Create pending user with temporary password (will be replaced after OTP verification)
                const newUser = new User({
                    email,
                    password: 'PENDING_OTP_VERIFICATION', // Placeholder - will be set during registration completion
                    otp,
                    otpExpires,
                    isVerified: false
                });
                await newUser.save();
            }
        } else if (user) {
            console.log('DEBUG: Updating existing user OTP');
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        }

        const subject = type === 'register' ? "EcoWIPE Registration OTP" : "EcoWIPE Password Reset OTP";
        const message = `Your OTP for ${type === 'register' ? 'registration' : 'password reset'} is ${otp}. It expires in 10 minutes.`;

        try {
            console.log('DEBUG: Attempting to send email...');
            await sendEmail(email, subject, message);
            console.log('DEBUG: Email sent successfully');
        } catch (emailError) {
            console.error('DEBUG: Email sending failed, but continuing flow:', emailError);
            // Proceed without sending email in dev/demo mode
        }

        // In development, return the OTP in the response for easier testing
        const isDevelopment = process.env.NODE_ENV !== 'production';
        res.status(200).json({
            message: "OTP sent successfully",
            ...(isDevelopment && { devOtp: otp }) // Only include OTP in dev mode
        });

    } catch (err) {
        console.error('DEBUG: Error in /send-otp:', err);
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
router.post('/register', async (req, res) => {
    try {
        const { email, password, full_name, token } = req.body;

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
        user.full_name = full_name; // Save the collected name
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
        const { email, googleId, name } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if not exists
            user = new User({
                email,
                googleId,
                full_name: name || 'Google User',
                isVerified: true // Google accounts start verified
            });
            await user.save();
        } else if (!user.googleId) {
            // Link googleId if user exists but hasn't used Google Auth before
            user.googleId = googleId;
            if (name && (!user.full_name || user.full_name === 'User')) {
                user.full_name = name;
            }
            if (!user.isVerified) user.isVerified = true;
            await user.save();
        }

        // Create and assign a token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'fallback_secret');
        res.header('auth-token', token).json({ token, user });

    } catch (err) {
        console.error('Google Auth error:', err.message || err);
        res.status(400).json({ error: err.message || 'Google authentication failed' });
    }
});


// Login
router.post('/login', async (req, res) => {
    console.log('Login request:', req.body);
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Email is not found');

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send('Invalid password');

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'fallback_secret');

        console.log('Login successful for:', req.body.email);
        res.header('auth-token', token).send({
            token: token,
            user: user
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(400).send(err);
    }
});

// GET current user
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
