import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FAQSection from '../components/common/FAQSection';
import { MessageCircle, Mail, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const FAQPage = () => {
    const supportOptions = [
        {
            icon: HelpCircle,
            title: 'Check FAQs',
            description: 'Browse our comprehensive FAQ section below',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: MessageCircle,
            title: 'Community Forum',
            description: 'Ask questions and get help from the community',
            color: 'from-purple-500 to-indigo-500'
        },
        {
            icon: Mail,
            title: 'Email Support',
            description: 'Contact our support team directly',
            color: 'from-green-500 to-emerald-500'
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
                            <div className="rounded-full bg-green-100 p-4">
                                <HelpCircle className="h-12 w-12 text-green-600" />
                            </div>
                        </div>
                        <h1 className="mb-6 text-5xl font-bold text-gray-900">
                            How Can We
                            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                {' '}Help You?
                            </span>
                        </h1>
                        <p className="mb-8 text-xl text-gray-600">
                            Find answers to common questions about secure data wiping
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Support Options */}
            <section className="px-6 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-6 md:grid-cols-3">
                        {supportOptions.map((option, index) => {
                            const Icon = option.icon;
                            return (
                                <motion.div
                                    key={option.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all hover:shadow-lg"
                                >
                                    <div className={`mx-auto mb-4 inline-flex rounded-xl bg-gradient-to-br ${option.color} p-3`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                                        {option.title}
                                    </h3>
                                    <p className="text-gray-600">{option.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <div className="bg-white">
                <FAQSection />
            </div>

            {/* Still Have Questions? */}
            <section className="px-6 py-16">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-12 text-center"
                    >
                        <h2 className="mb-4 text-3xl font-bold text-gray-900">
                            Still Have Questions?
                        </h2>
                        <p className="mb-6 text-lg text-gray-600">
                            Our support team is here to help you with any questions or concerns
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <a href="mailto:support@ecowipe.com">
                                <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl">
                                    <Mail className="h-5 w-5" />
                                    Email Support
                                </Button>
                            </a>
                            <Link to="/wipe">
                                <Button variant="outline" className="flex items-center gap-2 px-6 py-3 rounded-xl">
                                    Try It Now
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Quick Links */}
            <section className="px-6 py-12">
                <div className="mx-auto max-w-4xl text-center">
                    <p className="mb-6 text-sm font-semibold text-gray-500">HELPFUL RESOURCES</p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <Link to="/features" className="text-green-600 hover:underline">
                            View Features
                        </Link>
                        <Link to="/testimonials" className="text-green-600 hover:underline">
                            Read Testimonials
                        </Link>
                        <Link to="/" className="text-green-600 hover:underline">
                            Back to Home
                        </Link>
                        <a href="#" className="text-green-600 hover:underline">
                            Documentation
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQPage;
