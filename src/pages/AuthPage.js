import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, ArrowRight, Loader2, Leaf, Globe, CheckCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import FloatingInput from '../components/FloatingInput';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthPage = () => {
    // Modes: 'login', 'register', 'forgot'
    const [mode, setMode] = useState('login');
    // Steps: 1 (Email/Initial), 2 (OTP), 3 (Password/Final Details)
    const [step, setStep] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        otp: '',
        password: '',
        confirmPassword: ''
    });

    const [tempToken, setTempToken] = useState(''); // Token received after OTP verification
    const [devOtp, setDevOtp] = useState(''); // For displaying OTP in development mode

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const resetForm = () => {
        setFormData({ fullName: '', email: '', otp: '', password: '', confirmPassword: '' });
        setStep(1);
        setError('');
        setSuccess('');
        setTempToken('');
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        resetForm();
    };

    // --- Actions ---

    const handleSendOTP = async () => {
        setLoading(true);
        setError('');
        setDevOtp(''); // Clear previous OTP
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    type: mode === 'register' ? 'register' : 'reset'
                })
            });

            if (!res.ok) throw new Error(await res.text());

            const data = await res.json();

            // Store dev OTP if available
            if (data.devOtp) {
                setDevOtp(data.devOtp);
            }

            setSuccess(`OTP sent to ${formData.email}`);
            setStep(2);
        } catch (err) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    otp: formData.otp
                })
            });

            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();

            setSuccess('OTP Verified!');
            setTempToken(data.token);
            setStep(3);
        } catch (err) {
            setError(err.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();

            login(data.token, { _id: 'temp_user_id' }); // Real user data fetched in auth context
            setSuccess('Sign in successful! Redirecting...');
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterComplete = async () => {
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    full_name: formData.fullName,
                    token: tempToken
                })
            });

            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();

            login(data.token, { _id: data.user });
            setSuccess('Account created! Redirecting...');
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    token: tempToken
                })
            });

            if (!res.ok) throw new Error(await res.text());

            setSuccess('Password reset successful! Please login.');
            setTimeout(() => switchMode('login'), 2000);
        } catch (err) {
            setError(err.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'login') {
            handleLogin();
        } else {
            // Register or Forgot Password Flows
            if (step === 1) handleSendOTP();
            else if (step === 2) handleVerifyOTP();
            else if (step === 3) {
                if (mode === 'register') handleRegisterComplete();
                else handleResetPassword();
            }
        }
    };

    // --- Integration of Google Auth inside the new flow ---
    const handleGoogleAuth = async (userData) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userData.email,
                    name: userData.name,
                    googleId: userData.googleId
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Google Sign-In failed');

            // Store token and login with real user data
            localStorage.setItem('auth-token', data.token);
            login(data.token, data.user || { _id: data.user?._id });
            setSuccess('Google Sign-In successful! Redirecting...');
        } catch (err) {
            console.error('Google Sign-In error:', err);
            setError(err.message || "Google Sign-In failed. Please try again.");
            setLoading(false);
        }
    };

    const handleGoogleAuthSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            handleGoogleAuth({
                email: decoded.email,
                name: decoded.name,
                googleId: decoded.sub
            });
        } catch (err) {
            console.error('Failed to parse JWT token:', err);
            setError('Google Login failed to process credentials.');
        }
    };


    // Split Layout Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8 } }
    };

    const formVariants = {
        hidden: { x: 50, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen w-full flex bg-[#0f172a] text-white overflow-hidden relative"
        >
            {/* Mobile Background Animations - show on all screens */}
            <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-black/80" />
                {/* Mobile Floating Leaves */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={`mobile-leaf-${i}`}
                        initial={{
                            x: Math.random() * 100 - 50,
                            y: -20,
                            rotate: Math.random() * 360,
                            opacity: 0
                        }}
                        animate={{
                            x: [
                                Math.random() * 100 - 50,
                                Math.random() * 100 - 50 + Math.sin(i) * 60,
                                Math.random() * 100 - 50
                            ],
                            y: [
                                -20,
                                '50vh',
                                '110vh'
                            ],
                            rotate: [
                                Math.random() * 360,
                                Math.random() * 360 + 180,
                                Math.random() * 360 + 360
                            ],
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{
                            duration: 12 + Math.random() * 6,
                            repeat: Infinity,
                            delay: i * 1.5,
                            ease: "linear"
                        }}
                        style={{
                            position: 'absolute',
                            left: `${(i * 12) % 100}%`,
                        }}
                    >
                        <Leaf
                            size={18 + Math.random() * 12}
                            className="text-emerald-400/50"
                            style={{
                                filter: 'drop-shadow(0 0 8px rgba(52, 211, 153, 0.4))'
                            }}
                        />
                    </motion.div>
                ))}
                {/* Mobile Rising Particles */}
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={`mobile-particle-${i}`}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: '110vh',
                            scale: 0,
                            opacity: 0
                        }}
                        animate={{
                            x: [
                                Math.random() * window.innerWidth,
                                Math.random() * window.innerWidth + Math.cos(i) * 50,
                                Math.random() * window.innerWidth
                            ],
                            y: [
                                '110vh',
                                '50vh',
                                '-20px'
                            ],
                            scale: [0, 1, 0],
                            opacity: [0, 0.7, 0]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 5,
                            repeat: Infinity,
                            delay: i * 1,
                            ease: "easeOut"
                        }}
                        style={{
                            position: 'absolute',
                        }}
                    >
                        <div
                            className="w-2 h-2 rounded-full bg-cyan-400/70"
                            style={{
                                boxShadow: '0 0 10px rgba(34, 211, 238, 0.7)',
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* LEFT PANEL: Cinematic Visuals */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between items-center p-12 bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-black/80 z-10" />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{ scale: [1.2, 1, 1.2], x: [0, 100, 0], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[100px]"
                    />

                    {/* Animated Floating Leaves - Lower area */}
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={`leaf-${i}`}
                            initial={{
                                x: Math.random() * 100 - 50,
                                y: -20,
                                rotate: Math.random() * 360,
                                opacity: 0
                            }}
                            animate={{
                                x: [
                                    Math.random() * 100 - 50,
                                    Math.random() * 100 - 50 + Math.sin(i) * 100,
                                    Math.random() * 100 - 50
                                ],
                                y: [
                                    -20,
                                    '50vh',
                                    '110vh'
                                ],
                                rotate: [
                                    Math.random() * 360,
                                    Math.random() * 360 + 180,
                                    Math.random() * 360 + 360
                                ],
                                opacity: [0, 0.7, 0]
                            }}
                            transition={{
                                duration: 15 + Math.random() * 10,
                                repeat: Infinity,
                                delay: i * 1.5,
                                ease: "linear"
                            }}
                            style={{
                                position: 'absolute',
                                left: `${(i * 8) % 100}%`,
                                zIndex: 5
                            }}
                            className="hidden lg:block"
                        >
                            <Leaf
                                size={20 + Math.random() * 15}
                                className="text-emerald-400/40"
                                style={{
                                    filter: 'drop-shadow(0 0 8px rgba(52, 211, 153, 0.3))'
                                }}
                            />
                        </motion.div>
                    ))}

                    {/* Mobile version - fewer leaves */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={`leaf-mobile-${i}`}
                            initial={{
                                x: Math.random() * 50 - 25,
                                y: -20,
                                rotate: Math.random() * 360,
                                opacity: 0
                            }}
                            animate={{
                                x: [
                                    Math.random() * 50 - 25,
                                    Math.random() * 50 - 25 + Math.sin(i) * 50,
                                    Math.random() * 50 - 25
                                ],
                                y: [
                                    -20,
                                    '50vh',
                                    '110vh'
                                ],
                                rotate: [
                                    Math.random() * 360,
                                    Math.random() * 360 + 180,
                                    Math.random() * 360 + 360
                                ],
                                opacity: [0, 0.6, 0]
                            }}
                            transition={{
                                duration: 12 + Math.random() * 8,
                                repeat: Infinity,
                                delay: i * 2,
                                ease: "linear"
                            }}
                            style={{
                                position: 'absolute',
                                left: `${(i * 15) % 100}%`,
                                zIndex: 5
                            }}
                            className="lg:hidden"
                        >
                            <Leaf
                                size={16 + Math.random() * 10}
                                className="text-emerald-400/35"
                                style={{
                                    filter: 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.2))'
                                }}
                            />
                        </motion.div>
                    ))}

                    {/* Rising Particles - Upper area (data purification effect) */}
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={`particle-${i}`}
                            initial={{
                                x: Math.random() * window.innerWidth * 0.5,
                                y: '110vh',
                                scale: 0,
                                opacity: 0
                            }}
                            animate={{
                                x: [
                                    Math.random() * window.innerWidth * 0.5,
                                    Math.random() * window.innerWidth * 0.5 + Math.cos(i) * 80,
                                    Math.random() * window.innerWidth * 0.5
                                ],
                                y: [
                                    '110vh',
                                    '50vh',
                                    '-20px'
                                ],
                                scale: [0, 1, 0],
                                opacity: [0, 0.8, 0]
                            }}
                            transition={{
                                duration: 12 + Math.random() * 8,
                                repeat: Infinity,
                                delay: i * 0.8,
                                ease: "easeOut"
                            }}
                            style={{
                                position: 'absolute',
                                zIndex: 5
                            }}
                            className="hidden lg:block"
                        >
                            <div
                                className="w-2 h-2 rounded-full bg-cyan-400/60"
                                style={{
                                    boxShadow: '0 0 12px rgba(34, 211, 238, 0.6)',
                                }}
                            />
                        </motion.div>
                    ))}

                    {/* Mobile particles - fewer */}
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={`particle-mobile-${i}`}
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: '110vh',
                                scale: 0,
                                opacity: 0
                            }}
                            animate={{
                                x: [
                                    Math.random() * window.innerWidth,
                                    Math.random() * window.innerWidth + Math.cos(i) * 40,
                                    Math.random() * window.innerWidth
                                ],
                                y: [
                                    '110vh',
                                    '50vh',
                                    '-20px'
                                ],
                                scale: [0, 0.8, 0],
                                opacity: [0, 0.6, 0]
                            }}
                            transition={{
                                duration: 10 + Math.random() * 6,
                                repeat: Infinity,
                                delay: i * 1.2,
                                ease: "easeOut"
                            }}
                            style={{
                                position: 'absolute',
                                zIndex: 5
                            }}
                            className="lg:hidden"
                        >
                            <div
                                className="w-1.5 h-1.5 rounded-full bg-cyan-400/50"
                                style={{
                                    boxShadow: '0 0 8px rgba(34, 211, 238, 0.5)',
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
                {/* Top: Logo */}
                <div className="relative z-20">
                    <div className="flex items-center gap-3 text-emerald-400 font-bold tracking-wider uppercase text-sm">
                        <Leaf size={18} />
                        <span>EcoWIPE System v2.0</span>
                    </div>
                </div>
                {/* Middle: Main Content */}
                <div className="relative z-20 max-w-lg">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-6xl font-extrabold leading-tight mb-6"
                    >
                        Secure Data. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Sustainable Future.
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-gray-400 text-lg leading-relaxed"
                    >
                        Join the revolution in certified data destruction. Professional, secure, and environmentally conscious.
                    </motion.p>
                </div>
                {/* Bottom: Badges */}
                <div className="relative z-20 flex gap-6 text-gray-500 text-sm font-mono">
                    <span className="flex items-center gap-2"><Globe size={14} /> GLOBAL COMPLIANCE</span>
                    <span>•</span>
                    <span>ISO 27001 CERTIFIED</span>
                </div>
            </div>

            {/* RIGHT PANEL: Professional Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10"
            >    <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-[#0f172a] z-0" />

                <motion.div
                    variants={formVariants}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="mb-8 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                            <div className="relative">
                                <Shield className="h-8 w-8 text-emerald-500" />
                                <Leaf className="absolute -right-1 -top-1 h-3 w-3 text-cyan-400" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                EcoWIPE
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">
                            {mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create an account' : 'Reset Password'}
                        </h2>
                        <p className="text-gray-400">
                            {mode === 'login' ? 'Please enter your details to sign in.' :
                                mode === 'register' && step === 1 ? 'Enter your email to verify.' :
                                    mode === 'register' && step === 2 ? 'Enter the OTP sent to your email.' :
                                        mode === 'register' && step === 3 ? 'Set up your password.' :
                                            mode === 'forgot' && step === 1 ? 'Enter your email to receive OTP.' :
                                                mode === 'forgot' && step === 2 ? 'Enter the OTP code.' :
                                                    'Enter your new password.'}
                        </p>
                    </div>

                    {/* Success Notification */}
                    <AnimatePresence>
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-center justify-center gap-3 text-emerald-400 font-medium"
                            >
                                <CheckCircle size={20} />
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Development OTP Display */}
                    {devOtp && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-yellow-500/20 border-2 border-yellow-500/50 rounded-lg"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-yellow-400 font-mono uppercase tracking-wider">Development Mode</span>
                                <span className="text-xs text-yellow-400/60">Auto-filled below</span>
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-sm text-yellow-400/80">Your OTP:</span>
                                <code className="text-2xl font-bold text-yellow-300 tracking-widest bg-yellow-500/10 px-4 py-2 rounded">
                                    {devOtp}
                                </code>
                            </div>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Step 1: Email (All modes) OR Login (Always) */}
                            {((step === 1) || mode === 'login') && (
                                <FloatingInput
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon={Mail}
                                    required
                                />
                            )}

                            {/* Step 2: OTP (Register/Forgot only) */}
                            {mode !== 'login' && step === 2 && (
                                <FloatingInput
                                    type="text"
                                    name="otp"
                                    placeholder="Enter 6-digit OTP"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    icon={Lock}
                                    required
                                />
                            )}

                            {/* Step 3: Full Name (Register Only) */}
                            {mode === 'register' && step === 3 && (
                                <FloatingInput
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    icon={User}
                                    required
                                />
                            )}

                            {/* Step 3: Password (Register/Forgot) OR Login (Always) */}
                            {((mode !== 'login' && step === 3) || (mode === 'login')) && (
                                <FloatingInput
                                    type="password"
                                    name="password"
                                    placeholder={mode === 'login' ? "Password" : "New Password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    icon={Lock}
                                    required
                                />
                            )}

                            {/* Confirm Password (Register/Forgot Step 3 only) */}
                            {mode !== 'login' && step === 3 && (
                                <FloatingInput
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    icon={Lock}
                                    required
                                />
                            )}

                            {/* Forgot Password Link (Login mode only) */}
                            {mode === 'login' && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => switchMode('forgot')}
                                        className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center"
                            >
                                {typeof error === 'string' ? error : 'Something went wrong'}
                            </motion.div>
                        )}

                        <div className="mt-8">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-lg shadow-lg shadow-emerald-500/25 transition-all text-sm uppercase tracking-wide flex items-center justify-center gap-2 group"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        {mode === 'login' ? 'Sign In' :
                                            step === 1 ? 'Send OTP' :
                                                step === 2 ? 'Verify OTP' :
                                                    mode === 'register' ? 'Create Account' : 'Reset Password'}
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </div>

                        {/* Google Sign In Section (Login mode only) */}
                        {mode === 'login' && (
                            <div className="mt-8 flex flex-col items-center">
                                <div className="relative flex items-center justify-center w-full mb-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-800"></div>
                                    </div>
                                    <div className="relative bg-[#0f172a] px-4 text-sm text-gray-500">Or continue with</div>
                                </div>
                                <GoogleLogin
                                    onSuccess={handleGoogleAuthSuccess}
                                    onError={() => {
                                        setError('Google Login Failed');
                                    }}
                                    theme="filled_black"
                                    text="signin_with"
                                    shape="rectangular"
                                    width="100%"
                                />
                            </div>
                        )}
                    </form>

                    <div className="mt-8 text-center border-t border-gray-800 pt-8">
                        <p className="text-gray-400 text-sm">
                            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors ml-1"
                            >
                                {mode === 'login' ? 'Sign up for free' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div >
    );
};

export default AuthPage;
