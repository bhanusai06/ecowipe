import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'IT Manager, Tech Corp',
        company: 'Fortune 500 Company',
        avatar: '👩‍💼',
        rating: 5,
        text: 'EcoWIPE has transformed how we handle device retirement. The certification process is seamless, and compliance officers love the detailed reports.',
        highlight: 'certification process is seamless'
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Data Privacy Officer',
        company: 'Healthcare Solutions Inc',
        avatar: '👨‍💻',
        rating: 5,
        text: 'HIPAA compliance is critical for us. EcoWIPE\'s military-grade wiping with AI verification gives us complete confidence in our data destruction.',
        highlight: 'complete confidence'
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        role: 'Sustainability Lead',
        company: 'Green Recycling Co',
        avatar: '👩‍🔬',
        rating: 5,
        text: 'As an e-waste recycling partner, EcoWIPE helps us ensure data security while promoting sustainable practices. The eco-impact tracking is a bonus!',
        highlight: 'eco-impact tracking is a bonus'
    },
    {
        id: 4,
        name: 'David Park',
        role: 'Small Business Owner',
        company: 'Park & Associates',
        avatar: '👨‍💼',
        rating: 5,
        text: 'Simple, secure, and gives me peace of mind. I wiped an old laptop in 30 minutes and got a professional certificate. Perfect for small businesses!',
        highlight: 'peace of mind'
    }
];

const Testimonials = () => {
    return (
        <section className="w-full bg-gradient-to-br from-white via-green-50/30 to-white py-16 px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-12 text-center">
                    <h2 className="mb-3 text-3xl font-bold text-gray-900">
                        Trusted by Security Professionals
                    </h2>
                    <p className="text-gray-600">
                        See how EcoWIPE is helping organizations and individuals secure their data
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="group relative"
                        >
                            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-green-300 hover:shadow-lg">
                                {/* Quote Icon */}
                                <div className="absolute right-4 top-4 opacity-10 transition-opacity group-hover:opacity-20">
                                    <Quote className="h-16 w-16 text-green-600" />
                                </div>

                                {/* Rating */}
                                <div className="mb-4 flex items-center gap-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>

                                {/* Testimonial Text */}
                                <p className="relative z-10 mb-6 text-gray-700 leading-relaxed">
                                    "{testimonial.text}"
                                </p>

                                {/* Author Info */}
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-blue-100 text-2xl">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {testimonial.role}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {testimonial.company}
                                        </p>
                                    </div>
                                </div>

                                {/* Gradient Background on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <p className="text-lg text-gray-600">
                        Join thousands of satisfied users.{' '}
                        <span className="font-semibold text-green-600">
                            Start your secure wipe today
                        </span>
                        .
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;
