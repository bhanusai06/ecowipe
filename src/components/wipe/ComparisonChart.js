import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, Shield, Zap, Award } from 'lucide-react';
import Tooltip from '../common/Tooltip';

const comparisonData = {
    features: [
        { name: 'Time to Complete', key: 'time', icon: Clock },
        { name: 'Number of Passes', key: 'passes', icon: Zap },
        { name: 'Security Level', key: 'security', icon: Shield },
        { name: 'Compliance Standard', key: 'compliance', icon: Award },
        { name: 'Recommended For', key: 'usage', icon: Check },
    ],
    methods: {
        quick: {
            name: 'Quick Wipe',
            color: 'blue',
            badge: 'Basic Security',
            time: '5-15 minutes',
            passes: '1 pass',
            security: 'Basic',
            compliance: 'Basic sanitization',
            usage: 'Personal files, non-sensitive data',
            price: 'Free'
        },
        deep: {
            name: 'Deep Wipe',
            color: 'purple',
            badge: 'High Security',
            time: '30-60 minutes',
            passes: '3 passes',
            security: 'High',
            compliance: 'GDPR, HIPAA compliant',
            usage: 'Business data, confidential files',
            price: 'Free'
        },
        military: {
            name: 'Military Grade',
            color: 'red',
            badge: 'Maximum Security',
            time: '2-4 hours',
            passes: '7+ passes',
            security: 'Maximum',
            compliance: 'DoD 5220.22-M',
            usage: 'Classified data, maximum security needs',
            price: 'Free'
        },
        crypto: {
            name: 'Crypto Erase',
            color: 'teal',
            badge: 'Instant Security',
            time: '< 1 minute',
            passes: 'Key Destroy',
            security: 'Maximum',
            compliance: 'NIST Purge',
            usage: 'Modern SSDs, Encrypted Mobile Devices',
            price: 'Free'
        }
    }
};

const colorVariants = {
    blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-700'
    },
    purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        badge: 'bg-purple-100 text-purple-700'
    },
    red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        badge: 'bg-red-100 text-red-700'
    },
    teal: {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        text: 'text-teal-700',
        badge: 'bg-teal-100 text-teal-700'
    }
};

const ComparisonChart = () => {
    return (
        <div className="w-full overflow-x-auto">
            <div className="mb-8 text-center">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    Choose the Right Wipe Method
                </h3>
                <p className="text-gray-600">
                    Compare security levels, time requirements, and use cases
                </p>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
                <table className="w-full border-collapse overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border-b border-r border-gray-200 p-4 text-left font-semibold text-gray-900">
                                Features
                            </th>
                            {Object.entries(comparisonData.methods).map(([key, method]) => {
                                const colors = colorVariants[method.color];
                                return (
                                    <th
                                        key={key}
                                        className={`border-b border-gray-200 p-4 text-center ${colors.bg}`}
                                    >
                                        <div className="mb-2 text-lg font-bold text-gray-900">
                                            {method.name}
                                        </div>
                                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${colors.badge}`}>
                                            {method.badge}
                                        </span>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonData.features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.tr
                                    key={feature.key}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                                >
                                    <td className="border-r border-gray-200 p-4">
                                        <div className="flex items-center gap-2 font-medium text-gray-700">
                                            <Icon className="h-4 w-4 text-gray-500" />
                                            <Tooltip content={`Compare ${feature.name.toLowerCase()} across all methods`}>
                                                <span className="cursor-help">{feature.name}</span>
                                            </Tooltip>
                                        </div>
                                    </td>
                                    {Object.entries(comparisonData.methods).map(([key, method]) => {
                                        const value = method[feature.key];
                                        return (
                                            <td key={key} className="p-4 text-center text-gray-700">
                                                {value}
                                            </td>
                                        );
                                    })}
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid gap-4 md:hidden">
                {Object.entries(comparisonData.methods).map(([key, method], methodIndex) => {
                    const colors = colorVariants[method.color];
                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: methodIndex * 0.1 }}
                            className={`overflow-hidden rounded-xl border ${colors.border} ${colors.bg}`}
                        >
                            <div className="bg-white p-4">
                                <h3 className="mb-2 text-xl font-bold text-gray-900">
                                    {method.name}
                                </h3>
                                <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${colors.badge}`}>
                                    {method.badge}
                                </span>
                            </div>
                            <div className="space-y-3 p-4">
                                {comparisonData.features.map((feature) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div key={feature.key} className="flex items-start justify-between border-b border-gray-200 pb-2 last:border-b-0">
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {feature.name}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                {method[feature.key]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-6 rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-600">
                    <strong>Pro Tip:</strong> For most users, Deep Wipe offers the best balance between security and time.
                    Military Grade is recommended only for highly sensitive or classified data.
                </p>
            </div>
        </div>
    );
};

export default ComparisonChart;
