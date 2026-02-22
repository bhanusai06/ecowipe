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
            toast.success('Download starting...', { id: 'download-os' });
            setIsDownloading(false);
        }, 1500);
    };

    return (
        <section id="downloads" className="py-24 bg-gray-900 relative overflow-hidden">
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
                            v1.0.0 Enterprise Release
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Military-Grade Wiping.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                Native Hardware Access.
                            </span>
                        </h2>

                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Download the **Desktop Agent** to wipe connected external drives, or flash the **Live OS** to a USB to completely destroy the host computer's data—even without an internet connection.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            {/* Desktop Agent Button */}
                            <Button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="h-14 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-base font-medium shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-3 transition-all flex-1"
                            >
                                {isDownloading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <Terminal className="w-5 h-5" />
                                        <div className="flex flex-col items-start leading-none">
                                            <span>Desktop Agent</span>
                                            <span className="text-xs opacity-70 font-normal">(.exe / .deb)</span>
                                        </div>
                                    </>
                                )}
                            </Button>

                            {/* Live OS Button */}
                            <Button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                variant="outline"
                                className="h-14 px-6 border-emerald-500/30 bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40 hover:text-emerald-300 rounded-xl text-base font-medium flex items-center justify-center gap-3 transition-all flex-1"
                            >
                                <Download className="w-5 h-5" />
                                <div className="flex flex-col items-start leading-none">
                                    <span>Live OS</span>
                                    <span className="text-xs opacity-70 font-normal">(.iso)</span>
                                </div>
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
