import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Leaf, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BackgroundParticles from '../components/BackgroundParticles';

const WelcomePage = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = React.useState('');

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
            return;
        }

        // Simple token payload decode (for demo purposes)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            // Check if we have an ID, fetch user details if needed, or just show welcome
            // For now we'll just show the welcome message
        } catch (e) {
            console.error("Invalid token");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0f172a] text-white overflow-hidden font-inter">
            <BackgroundParticles />

            {/* Background Animation - Subtle Professional Gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-900/20 to-transparent" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10 text-center max-w-2xl px-6"
            >
                <div className="flex justify-center mb-8">
                    <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
                        <Shield size={48} className="text-emerald-400" />
                    </div>
                </div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                >
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">EcoWIPE</span>
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-gray-400 mb-10 font-light leading-relaxed"
                >
                    Your secure dashboard is ready. <br />
                    Certified data destruction for a sustainable future.
                </motion.p>

                <div className="flex justify-center gap-4 mb-12">
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-800">
                        <CheckCircle size={14} className="text-emerald-500" />
                        <span>Encrypted Session</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-800">
                        <Leaf size={14} className="text-emerald-500" />
                        <span>Eco-Friendly</span>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-all mx-auto backdrop-blur-md group"
                >
                    <LogOut size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                    <span className="font-medium">Sign Out</span>
                </motion.button>
            </motion.div>
        </div>
    );
};

export default WelcomePage;
