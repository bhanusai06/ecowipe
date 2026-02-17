import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, ArrowRight, Loader2, Leaf, Globe, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FloatingInput from '../components/FloatingInput';

const AuthPage = () => {
    // Modes: 'login', 'register', 'forgot'
    const [mode, setMode] = useState('login');
    // Steps: 1 (Email/Initial), 2 (OTP), 3 (Password/Final Details)
    const [step, setStep] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        password: '',
        confirmPassword: ''
    });

    const [tempToken, setTempToken] = useState(''); // Token received after OTP verification

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const resetForm = () => {
        setFormData({ email: '', otp: '', password: '', confirmPassword: '' });
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
        try {
            await axios.post('http://localhost:5001/api/auth/send-otp', {
                email: formData.email,
                type: mode === 'register' ? 'register' : 'reset'
            });
            setSuccess(`OTP sent to ${formData.email}`);
            setStep(2);
        } catch (err) {
            setError(err.response?.data || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5001/api/auth/verify-otp', {
                email: formData.email,
                otp: formData.otp
            });
            setSuccess('OTP Verified!');
            setTempToken(res.data.token);
            setStep(3);
        } catch (err) {
            setError(err.response?.data || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5001/api/auth/login', {
                email: formData.email,
                password: formData.password
            });
            localStorage.setItem('token', res.data.token);
            setSuccess('Sign in successful! Redirecting...');
            setTimeout(() => navigate('/welcome'), 1500);
        } catch (err) {
            setError(err.response?.data || 'Login failed');
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
            const res = await axios.post('http://localhost:5001/api/auth/register-complete', {
                email: formData.email,
                password: formData.password,
                token: tempToken
            });
            localStorage.setItem('token', res.data.token);
            setSuccess('Account created! Redirecting...');
            setTimeout(() => navigate('/welcome'), 1500);
        } catch (err) {
            setError(err.response?.data || 'Registration failed');
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
            await axios.post('http://localhost:5001/api/auth/reset-password', {
                email: formData.email,
                password: formData.password,
                token: tempToken
            });
            setSuccess('Password reset successful! Please login.');
            setTimeout(() => switchMode('login'), 2000);
        } catch (err) {
            setError(err.response?.data || 'Reset failed');
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
    const handleGoogleAuth = () => {
        const mockGoogleLogin = async () => {
            setLoading(true);
            try {
                const mockGoogleId = "google-user-" + Date.now();
                const mockEmail = `googleuser${Date.now()}@gmail.com`;

                const res = await axios.post('http://localhost:5001/api/auth/google', {
                    email: mockEmail,
                    googleId: mockGoogleId
                });

                localStorage.setItem('token', res.data.token);
                setSuccess('Google Sign-In successful! Redirecting...');
                setTimeout(() => navigate('/welcome'), 1500);
            } catch (err) {
                setError("Google Sign-In failed (Mock)");
                setLoading(false);
            }
        }
        mockGoogleLogin();
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
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen w-full flex bg-[#0f172a] text-white overflow-hidden"
        >
            {/* LEFT PANEL: Cinematic Visuals (Unchanged) */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-gray-900 overflow-hidden">
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
                </div>
                {/* Content */}
                <div className="relative z-20">
                    <div className="flex items-center gap-3 text-emerald-400 font-bold tracking-wider uppercase text-sm">
                        <Leaf size={18} />
                        <span>EcoWIPE System v2.0</span>
                    </div>
                </div>
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
                <div className="relative z-20 flex gap-6 text-gray-500 text-sm font-mono">
                    <span className="flex items-center gap-2"><Globe size={14} /> GLOBAL COMPLIANCE</span>
                    <span>•</span>
                    <span>ISO 27001 CERTIFIED</span>
                </div>
            </div>

            {/* RIGHT PANEL: Professional Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative">
                <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-[#0f172a] z-0" />

                <motion.div
                    variants={formVariants}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="mb-12">
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
                            <div className="mt-8">
                                <div className="relative flex items-center justify-center mb-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-800"></div>
                                    </div>
                                    <div className="relative bg-[#0f172a] px-4 text-sm text-gray-500">Or continue with</div>
                                </div>

                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleGoogleAuth}
                                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-3 transition-all"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span>Sign in with Google</span>
                                </motion.button>
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
            </div >
        </motion.div >
    );
};

export default AuthPage;
