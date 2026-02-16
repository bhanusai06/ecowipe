import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Users, TrendingUp } from 'lucide-react';

const statisticsData = [
    {
        id: 1,
        icon: Shield,
        value: '10,000+',
        label: 'Devices Securely Wiped',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
    },
    {
        id: 2,
        icon: Award,
        value: '100%',
        label: 'Compliance Rate',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
    },
    {
        id: 3,
        icon: Users,
        value: '5,000+',
        label: 'Trusted Users',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
    },
    {
        id: 4,
        icon: TrendingUp,
        value: '50+',
        label: 'Partner Organizations',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
    }
];

const certifications = [
    {
        id: 1,
        name: 'DoD 5220.22-M',
        description: 'US Department of Defense Standard',
        badge: '🛡️'
    },
    {
        id: 2,
        name: 'ISO 27001',
        description: 'Information Security Management',
        badge: '✅'
    },
    {
        id: 3,
        name: 'NIST 800-88',
        description: 'Media Sanitization Guidelines',
        badge: '🔒'
    },
    {
        id: 4,
        name: 'GDPR Compliant',
        description: 'Data Protection Regulation',
        badge: '🇪🇺'
    }
];

const TrustBadges = () => {
    return (
        <section className="w-full bg-gradient-to-br from-gray-50 to-white py-16 px-6">
            <div className="mx-auto max-w-6xl">
                {/* Statistics Section */}
                <div className="mb-16">
                    <div className="mb-8 text-center">
                        <h2 className="mb-3 text-3xl font-bold text-gray-900">
                            Trusted by Thousands
                        </h2>
                        <p className="text-gray-600">
                            Join our growing community of security-conscious users
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        {statisticsData.map((stat, index) => (
                            <motion.div
                                key={stat.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-lg"
                            >
                                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${stat.bgColor}`}>
                                    <stat.icon className={`h-7 w-7 ${stat.color}`} />
                                </div>
                                <div className="mb-1 text-3xl font-bold text-gray-900">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Certifications Section */}
                <div>
                    <div className="mb-8 text-center">
                        <h2 className="mb-3 text-3xl font-bold text-gray-900">
                            Industry-Leading Certifications
                        </h2>
                        <p className="text-gray-600">
                            Our data wiping methods follow internationally recognized standards
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {certifications.map((cert, index) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-green-300 hover:shadow-md"
                            >
                                <div className="mb-3 text-4xl">
                                    {cert.badge}
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-gray-900">
                                    {cert.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {cert.description}
                                </p>
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-8 text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <Shield className="h-6 w-6 text-green-600" />
                        <h3 className="text-xl font-bold text-gray-900">
                            100% Secure & Verified
                        </h3>
                    </div>
                    <p className="mx-auto max-w-2xl text-gray-600">
                        Every data wipe is AI-verified and certified. We provide legally-valid certificates
                        that prove your data was destroyed according to industry standards.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TrustBadges;
