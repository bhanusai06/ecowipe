import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Shield, ArrowRight } from 'lucide-react';
import { useWipeWorkflow } from '../../context/WipeWorkflowContext';

const WipeLanding = () => {
    const { resetWorkflow } = useWipeWorkflow();

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8 rounded-full bg-green-100 p-8"
            >
                <Shield className="h-20 w-20 text-green-600" />
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 text-4xl font-bold text-gray-900"
            >
                Secure Data Wipe Workflow
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 max-w-lg text-lg text-gray-600"
            >
                Follow our certified 4-step process to securely wipe your device and generate
                a verified proof of destruction.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4"
            >
                <Link to="/wipe/device">
                    <Button
                        onClick={resetWorkflow}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-lg hover:from-green-700 hover:to-emerald-700"
                    >
                        Start New Wipe
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 grid grid-cols-1 gap-6 text-left md:grid-cols-3"
            >
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-2 font-semibold text-gray-900">1. Select Device</div>
                    <p className="text-sm text-gray-600">Choose your device type and operating system</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-2 font-semibold text-gray-900">2. Choose Method</div>
                    <p className="text-sm text-gray-600">Select standard, deep, or military-grade wipe</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-2 font-semibold text-gray-900">3. Verify & Proof</div>
                    <p className="text-sm text-gray-600">Upload proof and get your certificate</p>
                </div>
            </motion.div>
        </div>
    );
};

export default WipeLanding;
