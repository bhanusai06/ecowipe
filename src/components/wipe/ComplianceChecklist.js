import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, HardDrive, FileText, AlertTriangle, CheckCircle, ArrowRight, RefreshCcw, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const ComplianceChecklist = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const questions = [
        {
            id: 'storage_type',
            title: 'What type of storage device is it?',
            options: [
                { value: 'hdd', label: 'Hard Disk Drive (HDD)', icon: HardDrive, description: 'Traditional spinning disk' },
                { value: 'ssd', label: 'Solid State Drive (SSD)', icon: FileText, description: 'Modern fast storage (NVMe/SATA)' },
                { value: 'hybrid', label: 'Hybrid / Unknown', icon: AlertTriangle, description: 'SSHD or unsure of type' }
            ]
        },
        {
            id: 'sensitivity',
            title: 'How sensitive is the data?',
            options: [
                { value: 'low', label: 'Low / Personal', icon: CheckCircle, description: 'Photos, movies, non-sensitive files' },
                { value: 'medium', label: 'Medium / Business', icon: Shield, description: 'Internal documents, emails, financial records' },
                { value: 'high', label: 'High / Top Secret', icon: AlertTriangle, description: 'PII, trade secrets, classified data' }
            ]
        },
        {
            id: 'outcome',
            title: 'What is the device destination?',
            options: [
                { value: 'reuse', label: 'Internal Reuse', icon: RefreshCcw, description: 'Giving to another employee or family member' },
                { value: 'recycle', label: 'External Recycle/Sale', icon: ArrowRight, description: 'Donating, selling, or returning to vendor' },
                { value: 'destroy', label: 'Physical Destruction', icon: Trash2, description: 'Device is broken or end-of-life' }
            ]
        }
    ];

    const determineRecommendation = (answers) => {
        const { storage_type, sensitivity, outcome } = answers;

        if (outcome === 'destroy') {
            return {
                method: 'Physical Destruction',
                type: 'DESTROY',
                color: 'red',
                steps: ['Shredding', 'Disintegration', 'Pulverization', 'Incineration'],
                note: 'Ensure debris size is reduced to < 2mm for high security.'
            };
        }

        if (storage_type === 'ssd') {
            if (sensitivity === 'high' && outcome === 'recycle') {
                return {
                    method: 'Cryptographic Erase + Purge',
                    type: 'PURGE',
                    color: 'purple',
                    steps: ['Perform Crypto Erase', 'Overwrite headers', 'Verify with random sampling'],
                    note: 'Standard overwrite is NOT effective on SSDs due to wear leveling.'
                };
            }
            return {
                method: 'Secure Erase (ATA/NVMe)',
                type: 'CLEAR',
                color: 'blue',
                steps: ['Invoke built-in Secure Erase command', 'Verify emptiness'],
                note: 'Uses the drive\'s internal controller to reset all cells.'
            };
        }

        if (storage_type === 'hdd') {
            if (sensitivity === 'high') {
                return {
                    method: 'Secure Erase (Purge) or Degauss',
                    type: 'PURGE',
                    color: 'purple',
                    steps: ['Use ATA Secure Erase', 'Or Degauss if not reusing', 'Verify 100% of blocks'],
                    note: 'Degaussing renders the drive unusable.'
                };
            }
            return {
                method: '3-Pass Overwrite',
                type: 'CLEAR',
                color: 'green',
                steps: ['Pass 1: Zeros', 'Pass 2: Ones', 'Pass 3: Random', 'Verify 10% of blocks'],
                note: 'Sufficient for most personal and business use cases.'
            };
        }

        return {
            method: '3-Pass Overwrite + Verification',
            type: 'CLEAR',
            color: 'yellow',
            steps: ['3-Pass Overwrite', 'Verify 100% of blocks'],
            note: 'Treating as HDD to be safe, but verification is critical.'
        };
    };

    const handleSelect = (option) => {
        const newAnswers = { ...answers, [questions[step].id]: option.value };
        setAnswers(newAnswers);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            const result = determineRecommendation(newAnswers);
            setResult(result);
        }
    };

    const resetForm = () => {
        setStep(0);
        setAnswers({});
        setResult(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {!result ? (
                <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            NIST 800-88 Compliance Guide
                        </CardTitle>
                        <CardDescription>
                            Answer 3 questions to get the recommended sanitization method.
                        </CardDescription>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 h-2 rounded-full mt-4 overflow-hidden">
                            <motion.div
                                className="h-full bg-emerald-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                                    {questions[step].title}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {questions[step].options.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSelect(option)}
                                            className="group flex flex-col items-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <option.icon className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <span className="font-semibold text-gray-900 mb-2">{option.label}</span>
                                            <span className="text-sm text-gray-500 text-center">{option.description}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-0 shadow-xl overflow-hidden">
                    <div className={`h-2 w-full bg-${result.color}-500`} />
                    <CardHeader className="text-center bg-gray-50 pb-8">
                        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <CardTitle className="text-2xl text-gray-900">Recommended Method</CardTitle>
                        <CardDescription>Based on NIST 800-88 Guidelines</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="text-center mb-8">
                            <Badge className={`bg-${result.color}-100 text-${result.color}-800 px-4 py-1 text-sm mb-4 border-${result.color}-200`}>
                                {result.type}
                            </Badge>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{result.method}</h2>
                            <p className="text-gray-600 max-w-lg mx-auto">{result.note}</p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 max-w-2xl mx-auto">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-emerald-500" />
                                Execution Steps
                            </h4>
                            <ul className="space-y-3">
                                {result.steps.map((step, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-gray-500 shadow-sm">
                                            {index + 1}
                                        </div>
                                        <span className="text-gray-700">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex justify-center gap-4 mt-8">
                            <Button onClick={resetForm} variant="outline" className="gap-2">
                                <RefreshCcw className="w-4 h-4" /> Start Over
                            </Button>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2 text-white">
                                <ArrowRight className="w-4 h-4" /> Proceed to Wiping
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ComplianceChecklist;
