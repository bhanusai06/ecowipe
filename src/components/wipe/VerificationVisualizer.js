import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Shield, Check, FileText, Lock, Terminal } from 'lucide-react';

const VerificationVisualizer = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [logs, setLogs] = useState([]);

    const logSteps = [
        { text: "Initializing OCR Engine v2.4...", delay: 500, color: "text-gray-400" },
        { text: "Detecting text layers...", delay: 1200, color: "text-blue-400" },
        { text: "Analyzing image contrast & integrity...", delay: 2000, color: "text-blue-400" },
        { text: "Extracting session metadata...", delay: 2800, color: "text-purple-400" },
        { text: "MATCH FOUND: Session Salt verified", delay: 3500, color: "text-emerald-400" },
        { text: "Verifying DoD 5220.22-M patterns...", delay: 4200, color: "text-emerald-400" },
        { text: "VERIFICATION COMPLETE", delay: 5000, color: "text-green-500 font-bold" }
    ];

    useEffect(() => {
        let timeouts = [];

        logSteps.forEach((log, index) => {
            const timeout = setTimeout(() => {
                setLogs(prev => [...prev, log]);
                setStep(index + 1);
            }, log.delay);
            timeouts.push(timeout);
        });

        const completeTimeout = setTimeout(() => {
            onComplete && onComplete();
        }, 5500);
        timeouts.push(completeTimeout);

        return () => timeouts.forEach(clearTimeout);
    }, []);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-sm rounded-xl overflow-hidden">

            {/* Grid Background */}
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>

            <div className="relative w-full max-w-md p-6">

                {/* Central Scanner Animation */}
                <div className="relative h-64 w-full border-2 border-emerald-500/30 rounded-lg bg-black/50 overflow-hidden mb-6">
                    {/* Fake Document Content */}
                    <div className="absolute inset-0 p-4 opacity-30 font-mono text-[10px] text-emerald-500/50 leading-relaxed overflow-hidden">
                        {(Array(20).fill("0F A1 3C 8B 99 FF 12 00 AB CD EF 00 11 22 33")).map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>

                    {/* Scanning Line */}
                    <motion.div
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] z-10"
                    />

                    {/* Central Status Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Scan className="w-16 h-16 text-emerald-400" />
                        </motion.div>
                    </div>
                </div>

                {/* Terminal Log */}
                <div className="bg-black/80 rounded-lg p-4 font-mono text-xs h-40 overflow-hidden border border-gray-800 shadow-xl">
                    <div className="flex items-center gap-2 border-b border-gray-800 pb-2 mb-2">
                        <Terminal className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-500">AI Analysis Log</span>
                    </div>
                    <div className="flex flex-col justify-end h-[calc(100%-24px)]">
                        <AnimatePresence mode='popLayout'>
                            {logs.map((log, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`mb-1 ${log.color} flex items-center gap-2`}
                                >
                                    <span>{'>'}</span>
                                    {log.text}
                                    {index === logs.length - 1 && index < logSteps.length - 1 && (
                                        <span className="animate-pulse">_</span>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Status Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-6 text-emerald-400 font-mono text-sm tracking-widest uppercase animate-pulse"
                >
                    Processing Verification Data...
                </motion.div>

            </div>
        </div>
    );
};

export default VerificationVisualizer;
