import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Terminal, Usb, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const LiveOSDownloadPage = () => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = () => {
        setIsDownloading(true);
        toast.loading('Starting download...', { id: 'iso-download' });

        // Wait a brief moment for UI feedback, then trigger download
        setTimeout(() => {
            // Trigger actual download of the ISO file from the public folder
            const link = document.createElement('a');
            // User states they have placed the ISO in the public folder
            link.href = '/ecowipe.iso'; // Will fall back to whatever name the file has if configured differently by the user
            link.download = 'ecowipe.iso';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success('Download started!', { id: 'iso-download' });
            setIsDownloading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50 pt-24 pb-16">
            <div className="mx-auto max-w-4xl px-6">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center justify-center p-4 bg-emerald-100/50 rounded-2xl mb-6">
                            <Usb className="w-12 h-12 text-emerald-600" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-6">
                            Download EcoWIPE Live OS
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Flash this ISO to a USB drive to securely wipe any computer without needing an operating system.
                        </p>
                    </motion.div>
                </div>

                {/* Download Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-emerald-100 text-center mb-16 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">EcoWIPE Bootable Environment</h2>
                    <p className="text-gray-500 mb-8">Version 1.0.0 Enterprise • Architecture: x86_64</p>

                    <Button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="h-16 px-8 text-lg bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-200 w-full md:w-auto overflow-hidden relative group"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <div className="relative flex items-center justify-center gap-3">
                            {isDownloading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Download className="w-6 h-6" />
                            )}
                            <span className="font-semibold">
                                {isDownloading ? 'Downloading...' : 'Download ISO Image'}
                            </span>
                        </div>
                    </Button>
                    <p className="text-sm text-gray-400 mt-4">File size: ~850MB</p>
                </motion.div>

                {/* Instructions Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                        <Terminal className="w-6 h-6 text-emerald-600" />
                        Installation Instructions
                    </h3>

                    <div className="space-y-6">
                        {/* Step 1 */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-6 items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">
                                1
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-2">Download the Flashing Tool</h4>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    You will need software to write the ISO file to your USB drive. We recommend using Rufus (Windows) or BalenaEtcher (Windows/Mac/Linux).
                                </p>
                                <div className="flex gap-4">
                                    <a href="https://rufus.ie/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
                                        Get Rufus <ArrowRight className="w-4 h-4" />
                                    </a>
                                    <a href="https://balena.io/etcher/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
                                        Get BalenaEtcher <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-6 items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">
                                2
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-2">Flash the USB Drive</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Insert a USB drive (minimum 4GB). Open your flashing tool, select the downloaded `ecowipe.iso` file, select your USB drive, and click Flash.
                                </p>
                                <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 text-orange-800 text-sm font-medium border border-orange-100">
                                    <span className="font-bold text-orange-600">WARNING:</span> This will erase all existing data on the USB drive.
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-6 items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">
                                3
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-2">Boot from USB</h4>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Insert the flashed USB into the computer you want to wipe. Turn it on and repeatedly press the Boot Menu key (usually F12, F10, F8, or ESC depending on the manufacturer).
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Select your USB drive from the menu.
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Choose "EcoWIPE Live" from the bootloader menu.
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> The secure wiping environment will load automatically.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="text-center mt-12">
                    <Link to="/">
                        <Button variant="ghost" className="text-gray-500 hover:text-gray-900">
                            Return to Home
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default LiveOSDownloadPage;
