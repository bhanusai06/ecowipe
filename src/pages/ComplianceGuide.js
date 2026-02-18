import React from 'react';
import { motion } from 'framer-motion';
import ComplianceChecklist from '../components/wipe/ComplianceChecklist';
import { Shield, BookOpen, AlertTriangle } from 'lucide-react';

const ComplianceGuide = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
                        <Shield className="w-4 h-4" />
                        Official Standards
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Data Destruction Compliance
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Determine the correct sanitization method for your storage media based on the
                        <span className="font-semibold text-emerald-600"> NIST 800-88 Guidelines</span>.
                    </p>
                </motion.div>

                {/* Educational Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Clear (Overwrite)</h3>
                        <p className="text-gray-600 text-sm">
                            Replaces written data with random data. Suitable for HDDs and non-sensitive data.
                            Standard 3-pass overwrite is common.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Purge (Block Erase)</h3>
                        <p className="text-gray-600 text-sm">
                            Physical or cryptographic erasure that renders data unrecoverable even with lab techniques.
                            Mandatory for SSDs.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Destroy (Physical)</h3>
                        <p className="text-gray-600 text-sm">
                            Ultimate destruction (shredding/incineration). Required for Top Secret data
                            or damaged drives that cannot be purged.
                        </p>
                    </motion.div>
                </div>

                {/* Interactive Tool */}
                <ComplianceChecklist />

                {/* Footnote */}
                <div className="text-center mt-12 text-sm text-gray-500">
                    <p>
                        Reference: National Institute of Standards and Technology (NIST) Special Publication 800-88 Revision 1,
                        "Guidelines for Media Sanitization".
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ComplianceGuide;
