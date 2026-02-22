import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TrustBadges from '../components/common/TrustBadges';
import DownloadOSSection from '../components/common/DownloadOSSection';
import { Shield, Zap, Lock, Award, Check, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const Features = () => {
    const features = [
        {
            icon: Shield,
            title: 'Military-Grade Security',
            description: 'DoD 5220.22-M compliant wiping ensures data is permanently destroyed beyond recovery.',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Zap,
            title: 'Fast & Efficient',
            description: 'Choose from Quick, Deep, or Military-grade wipes based on your time and security needs.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Lock,
            title: 'Complete Privacy',
            description: 'All wiping happens locally on your device. We never access your data.',
            color: 'from-purple-500 to-indigo-500'
        },
        {
            icon: Award,
            title: 'Certified Proof',
            description: 'AI-verified certificates provide legally-valid proof of data destruction.',
            color: 'from-orange-500 to-red-500'
        },
    ];

    const complianceStandards = [
        { name: 'DoD 5220.22-M', description: 'US Department of Defense standard' },
        { name: 'ISO 27001', description: 'Information Security Management' },
        { name: 'NIST 800-88', description: 'Media Sanitization Guidelines' },
        { name: 'GDPR', description: 'EU Data Protection Regulation' },
        { name: 'HIPAA', description: 'Healthcare Data Protection' },
        { name: 'SOX', description: 'Financial Data Compliance' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/20">
            {/* Hero Section */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-5xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="mb-6 text-5xl font-bold text-gray-900">
                            Enterprise-Grade Features for
                            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                {' '}Secure Data Wiping
                            </span>
                        </h1>
                        <p className="mb-8 text-xl text-gray-600">
                            Built with security professionals in mind, trusted by organizations worldwide
                        </p>
                        <Link to="/wipe">
                            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg text-lg">
                                Start Secure Wipe
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Main Features */}
            <section className="px-6 py-16">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-8 md:grid-cols-2">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg"
                                >
                                    <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="mb-2 text-2xl font-bold text-gray-900">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <TrustBadges />

            {/* Compliance Standards */}
            <section className="px-6 py-16">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900">
                            Industry Compliance Standards
                        </h2>
                        <p className="text-gray-600">
                            EcoWIPE meets and exceeds international data destruction standards
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {complianceStandards.map((standard, index) => (
                            <motion.div
                                key={standard.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="rounded-xl border border-green-200 bg-white p-6 shadow-sm"
                            >
                                <div className="mb-2 flex items-center gap-2">
                                    <Check className="h-5 w-5 text-green-600" />
                                    <h3 className="font-bold text-gray-900">{standard.name}</h3>
                                </div>
                                <p className="text-sm text-gray-600">{standard.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 p-12 text-white shadow-xl"
                    >
                        <h2 className="mb-4 text-4xl font-bold">
                            Ready to Secure Your Data?
                        </h2>
                        <p className="mb-8 text-lg text-green-50">
                            Join thousands of users who trust EcoWIPE for secure data wiping
                        </p>
                        <Link to="/wipe">
                            <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-xl shadow-lg text-lg font-semibold">
                                Start Wiping Now
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Features;
