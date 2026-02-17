import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
    {
        id: 1,
        question: 'How secure is each wipe method?',
        answer: 'Our wipe methods follow industry standards: Quick Wipe (1 pass) is suitable for personal files, Deep Wipe (3 passes) meets most business requirements, and Military Grade (7+ passes) follows the DoD 5220.22-M standard used by government agencies for classified data destruction.'
    },
    {
        id: 2,
        question: 'Will this delete my operating system?',
        answer: 'No, our commands are specifically designed to target data partitions only. Your operating system and essential system files remain intact. However, always back up important data before performing any wipe operation.'
    },
    {
        id: 3,
        question: 'How long does AI verification take?',
        answer: 'AI verification typically takes 30-60 seconds. Our system analyzes your uploaded proof (screenshot or log file) to verify the wipe was completed successfully. You\'ll receive your certificate immediately after verification.'
    },
    {
        id: 4,
        question: 'What if I don\'t know how to use terminal commands?',
        answer: 'We provide detailed step-by-step instructions for each command. You can also download our video tutorials that show exactly how to execute commands on different operating systems. If you\'re still unsure, consider seeking help from a technical professional.'
    },
    {
        id: 5,
        question: 'Is my data really gone after wiping?',
        answer: 'Yes! Wiping overwrites your data with zeros or random data, making it unrecoverable. Quick Wipe provides basic security, while Deep Wipe and Military Grade ensure even advanced forensic tools cannot recover your data. We provide certification as proof.'
    },
    {
        id: 6,
        question: 'Can I wipe only specific files or folders?',
        answer: 'Currently, EcoWIPE is designed for complete device or partition wiping to ensure thorough data destruction. For secure file deletion, consider using dedicated file shredding tools.'
    },
    {
        id: 7,
        question: 'What operating systems are supported?',
        answer: 'We support Android for mobile devices, and Windows, Linux, and Ubuntu for laptops/PCs and storage drives. Each OS has specific commands tailored to work safely and effectively on that platform.'
    },
    {
        id: 8,
        question: 'Why do you need proof of the wipe?',
        answer: 'Proof ensures accountability and enables us to generate a verified Data Destruction Certificate. This certificate is crucial for compliance, recycling programs, and demonstrating responsible data handling practices.'
    }
];

const FAQItem = ({ faq, isOpen, onToggle }) => {
    return (
        <div className="faq-item">
            <button
                onClick={onToggle}
                className="faq-trigger focus-visible-ring group flex w-full items-center justify-between py-4 text-left"
                aria-expanded={isOpen}
            >
                <span className="flex-1 text-left">{faq.question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="h-5 w-5 text-gray-500 transition-colors group-hover:text-green-600" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="faq-content"
                    >
                        <div className="pb-4 pr-12 text-gray-600">
                            {faq.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQSection = () => {
    const [openId, setOpenId] = useState(null);

    const handleToggle = (id) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className="w-full bg-white py-16 px-6">
            <div className="mx-auto max-w-4xl">
                <div className="mb-10 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-green-100 p-3">
                            <HelpCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <h2 className="mb-3 text-3xl font-bold text-gray-900">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600">
                        Everything you need to know about secure data wiping
                    </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="divide-y divide-gray-200">
                        {faqData.map((faq) => (
                            <FAQItem
                                key={faq.id}
                                faq={faq}
                                isOpen={openId === faq.id}
                                onToggle={() => handleToggle(faq.id)}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Still have questions?{' '}
                        <a
                            href="#contact"
                            className="font-medium text-green-600 hover:text-green-700 transition-colors"
                        >
                            Contact our support team
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
