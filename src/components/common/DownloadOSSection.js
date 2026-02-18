import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Download, Shield, Cpu, Zap, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import toast from 'react-hot-toast';

const DownloadOSSection = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = () => {
        setIsDownloading(true);
        toast.loading('Initializing secure download...', { id: 'download-os' });

        setTimeout(() => {
            toast.error('Beta Access Restricted: Please join the waitlist.', { id: 'download-os' });
            setIsDownloading(false);
        }, 2000);
    };

    return (
        <section className="py-24 bg-gray-900 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            v0.9.2 Beta Live
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Military-Grade Wiping.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                Zero OS Dependencies.
                            </span>
                        </h2>

                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            EcoWIPE OS is a custom Linux-based distinct operating system designed solely for data destruction.
                            Boot directly from USB to wipe any supported device without aggressive host OS interference.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-lg font-medium shadow-lg shadow-emerald-900/20 flex items-center gap-3 transition-all"
                            >
                                {isDownloading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5" />
                                        Download .ISO
                                        <span className="text-xs opacity-70 font-normal ml-1">(650MB)</span>
                                    </>
                                )}
                            </Button>

                            <Button variant="outline" className="h-14 px-8 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl text-lg font-medium">
                                Documentation
                            </Button>
                        </div>

                        <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-emerald-500" />
                                Malware Proof
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-emerald-500" />
                                Instant Boot
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-emerald-500" />
                                Air-Gapped Ready
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Terminal Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-20"></div>

                        <div className="relative bg-[#0f172a] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden font-mono text-sm">
                            {/* Terminal Header */}
                            <div className="bg-gray-800/50 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="ml-4 text-gray-400 text-xs flex items-center gap-1">
                                    <Terminal className="w-3 h-3" />
                                    root@ecowipe-os:~
                                </div>
                            </div>

                            {/* Terminal Content */}
                            <div className="p-6 text-gray-300 space-y-4">
                                <div>
                                    <span className="text-emerald-400">➜</span> <span className="text-cyan-400">~</span> <span className="text-yellow-400">ecowipe-cli scan</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-gray-400">Scanning for attached storage devices...</div>
                                    <div className="text-emerald-500">✓ Found: NVMe Samsung SSD 980 PRO (1TB)</div>
                                    <div className="text-emerald-500">✓ Found: SATA Crucial MX500 (500GB)</div>
                                </div>

                                <div>
                                    <span className="text-emerald-400">➜</span> <span className="text-cyan-400">~</span> <span className="text-yellow-400">ecowipe-cli wipe --device /dev/nvme0n1 --level military</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Initiating DoD 5220.22-M 3-Pass Wipe...</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mt-2">
                                        <div className="bg-emerald-500 h-full w-[75%]"></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 uppercase mt-1">
                                        <span>Pass 2/3</span>
                                        <span>75% Complete</span>
                                    </div>
                                </div>

                                <div className="animate-pulse">
                                    <span className="text-emerald-400">➜</span> <span className="text-cyan-400">~</span> <span className="inline-block w-2 H-4 bg-gray-400 ml-1 align-middle"></span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default DownloadOSSection;
