import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '../components/ui/button';

const NotFound = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/20 px-6 pt-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                {/* 404 Icon */}
                <div className="mb-8 flex items-center justify-center">
                    <div className="relative">
                        <Search className="h-32 w-32 text-gray-300" />
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            animate={{
                                rotate: [0, 10, -10, 10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3,
                            }}
                        >
                            <span className="text-6xl font-bold text-gray-500">404</span>
                        </motion.div>
                    </div>
                </div>

                {/* Message */}
                <h1 className="mb-4 text-4xl font-bold text-gray-900">
                    Page Not Found
                </h1>
                <p className="mb-8 text-lg text-gray-600">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Link to="/">
                        <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg">
                            <Home className="h-5 w-5" />
                            Go to Homepage
                        </Button>
                    </Link>
                    <Button
                        onClick={() => window.history.back()}
                        variant="outline"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Go Back
                    </Button>
                </div>

                {/* Helpful Links */}
                <div className="mt-12">
                    <p className="mb-4 text-sm text-gray-500">Helpful Links:</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link to="/features" className="text-green-600 hover:underline">
                            Features
                        </Link>
                        <Link to="/testimonials" className="text-green-600 hover:underline">
                            Testimonials
                        </Link>
                        <Link to="/faq" className="text-green-600 hover:underline">
                            FAQ
                        </Link>
                        <Link to="/wipe" className="text-green-600 hover:underline">
                            Start Wipe
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
