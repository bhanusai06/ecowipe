import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Smartphone, Shield, Terminal } from 'lucide-react';

const steps = [
    { number: 1, title: 'Select Device', icon: Smartphone },
    { number: 2, title: 'Choose Method', icon: Shield },
    { number: 3, title: 'Execute Wipe', icon: Terminal },
];

const ProgressStepper = ({ currentStep }) => {
    return (
        <div className="w-full bg-white/50 backdrop-blur-sm border-y border-gray-100 py-6">
            <div className="mx-auto max-w-4xl px-6">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = currentStep > step.number;
                        const isCurrent = currentStep === step.number;
                        const isUpcoming = currentStep < step.number;

                        return (
                            <div key={step.number} className="flex items-center">
                                {/* Step Circle */}
                                <motion.div
                                    className={`relative flex items-center justify-center rounded-full border-2 transition-all duration-300 ${isCompleted
                                        ? 'h-12 w-12 border-green-600 bg-green-600 text-white'
                                        : isCurrent
                                            ? 'h-14 w-14 border-green-600 bg-green-50 text-green-700'
                                            : 'h-12 w-12 border-gray-300 bg-white text-gray-400'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="h-6 w-6" />
                                    ) : (
                                        <Icon className={`${isCurrent ? 'h-7 w-7' : 'h-6 w-6'}`} />
                                    )}

                                    {/* Pulse effect for current step */}
                                    {isCurrent && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-2 border-green-400"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.5, 0, 0.5],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }}
                                        />
                                    )}
                                </motion.div>

                                {/* Step Title (Desktop) */}
                                <div className="ml-3 hidden sm:block">
                                    <p
                                        className={`text-sm font-semibold ${isCompleted || isCurrent ? 'text-green-700' : 'text-gray-500'
                                            }`}
                                    >
                                        {step.title}
                                    </p>
                                </div>

                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={`mx-4 hidden h-1 w-16 rounded-full transition-all duration-300 sm:block ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Mobile Step Title */}
                <div className="mt-4 text-center sm:hidden">
                    <p className="text-sm font-semibold text-green-700">
                        {steps[currentStep - 1]?.title || 'Complete'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProgressStepper;
