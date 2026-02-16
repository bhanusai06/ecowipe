import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TestimonialsComponent from '../components/common/Testimonials';
import { Star, Quote, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const TestimonialsPage = () => {
    const stats = [
        { value: '10,000+', label: 'Satisfied Users' },
        { value: '4.9/5', label: 'Average Rating' },
        { value: '98%', label: 'Would Recommend' },
        { value: '50+', label: 'Partner Organizations' },
    ];

    const useCases = [
        {
            title: 'Enterprise IT Departments',
            description: 'Securely wipe devices before employee offboarding or equipment disposal',
            icon: '🏢'
        },
        {
            title: 'Healthcare Organizations',
            description: 'HIPAA-compliant data destruction for medical devices and patient records',
            icon: '🏥'
        },
        {
            title: 'Financial Institutions',
            description: 'SOX and regulatory compliance for sensitive financial data disposal',
            icon: '🏦'
        },
        {
            title: 'Small Businesses',
            description: 'Affordable, certified data wiping for upgrading or selling equipment',
            icon: '🏪'
        },
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
                        <div className="mb-6 flex justify-center">
                            <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-4 py-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="ml-2 text-sm font-semibold text-gray-700">4.9/5</span>
                            </div>
                        </div>
                        <h1 className="mb-6 text-5xl font-bold text-gray-900">
                            Trusted by Security
                            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                {' '}Professionals Worldwide
                            </span>
                        </h1>
                        <p className="mb-8 text-xl text-gray-600">
                            See why thousands of users choose EcoWIPE for secure data wiping
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="px-6 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-8 md:grid-cols-4">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="rounded-2xl border border-green-200 bg-white p-6 text-center shadow-sm"
                            >
                                <div className="mb-2 text-4xl font-bold text-green-600">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Component */}
            <TestimonialsComponent />

            {/* Use Cases */}
            <section className="px-6 py-16">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900">
                            Who Uses EcoWIPE?
                        </h2>
                        <p className="text-gray-600">
                            From enterprise IT to small businesses, EcoWIPE serves diverse needs
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {useCases.map((useCase, index) => (
                            <motion.div
                                key={useCase.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
                            >
                                <div className="mb-4 text-5xl">{useCase.icon}</div>
                                <h3 className="mb-2 text-xl font-bold text-gray-900">
                                    {useCase.title}
                                </h3>
                                <p className="text-gray-600">{useCase.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 p-12 text-white shadow-xl"
                    >
                        <Quote className="mx-auto mb-4 h-12 w-12 text-green-200" />
                        <h2 className="mb-4 text-4xl font-bold">
                            Join Our Community
                        </h2>
                        <p className="mb-8 text-lg text-green-50">
                            Experience the peace of mind that comes with certified, secure data wiping
                        </p>
                        <Link to="/wipe">
                            <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-xl shadow-lg text-lg font-semibold">
                                Get Started Today
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default TestimonialsPage;
