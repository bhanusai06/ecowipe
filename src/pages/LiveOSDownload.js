import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Usb, Terminal, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import toast from 'react-hot-toast';

export default function LiveOSDownloadPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadISO = () => {
    setIsDownloading(true);
    toast.loading('Starting download...', { id: 'iso-download' });

    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '/ecowipe.iso';
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 bg-emerald-100/50 rounded-2xl mb-6">
            <Usb className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Download Live OS
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Flash this file to a USB drive to securely wipe any computer without needing an operating system installed.
          </p>
        </motion.div>

        {/* Instructions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-8">
            <Terminal className="w-6 h-6 text-emerald-600" />
            How to Use Live OS
          </h2>

          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-6 items-start"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">
              1
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Download the File</h4>
              <p className="text-gray-600 leading-relaxed">
                Click the Download button below to download the Live OS file to your computer.
              </p>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-6 items-start"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">
              2
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Get a Flashing Tool</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                Download one of these flashing tools to write the file to your USB drive:
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://rufus.ie/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
                >
                  Rufus (Windows) <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="https://balena.io/etcher/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
                >
                  BalenaEtcher (All OS) <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-6 items-start"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">
              3
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Flash to USB Drive</h4>
              <p className="text-gray-600 leading-relaxed mb-3">
                Insert a USB drive (minimum 4GB). Open your flashing tool, select the downloaded file, select your USB drive, and click Flash.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 text-orange-800 text-sm font-medium border border-orange-100">
                <AlertCircle className="w-4 h-4" />
                <span><span className="font-bold">WARNING:</span> This will erase all data on the USB drive.</span>
              </div>
            </div>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-6 items-start"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">
              4
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Boot from USB</h4>
              <p className="text-gray-600 leading-relaxed mb-4">
                Insert the flashed USB into the computer you want to wipe. Turn it on and repeatedly press the Boot Menu key (usually F12, F10, F8, or ESC).
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Select your USB drive from the boot menu
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Choose "Live OS" from the bootloader menu
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Follow the on-screen prompts to start wiping
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Step 5 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 shadow-sm border border-emerald-200 flex gap-6 items-start"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-lg">
              5
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Verify Completion</h4>
              <p className="text-gray-600 leading-relaxed">
                After the wipe completes, the system will display a verification message. Keep your verification code safe for future compliance records.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl p-8 md:p-12 shadow-xl text-center mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Download?</h3>
          <p className="text-emerald-100 mb-8">
            File size: ~2.5 GB | Supports multiple architectures
          </p>
          <Button
            onClick={handleDownloadISO}
            disabled={isDownloading}
            className="h-16 px-12 text-lg bg-white text-emerald-700 hover:bg-gray-100 rounded-xl shadow-lg font-semibold flex items-center justify-center gap-3 mx-auto disabled:opacity-75"
          >
            {isDownloading ? (
              <>
                <div className="w-6 h-6 border-2 border-emerald-700/30 border-t-emerald-700 rounded-full animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Download Live OS
              </>
            )}
          </Button>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Why Use Live OS?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🔒', title: 'No OS Required', desc: 'Works on any computer, even without an operating system' },
              { icon: '⚡', title: 'Fast & Reliable', desc: 'Direct hardware access for maximum wiping speed' },
              { icon: '🌐', title: 'Air-Gapped Ready', desc: 'Operate completely offline with no internet needed' },
              { icon: '✅', title: 'Certified Secure', desc: 'Military-grade data destruction standards' },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-3xl flex-shrink-0">{feature.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
