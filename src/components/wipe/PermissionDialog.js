import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Shield, HardDrive, Clock } from 'lucide-react';
import { Button } from '../ui/button';

export default function PermissionDialog({
    isOpen,
    onClose,
    onConfirm,
    command,
    deviceType,
    method,
    estimatedTime = "2-4 hours"
}) {
    const [backupConfirmed, setBackupConfirmed] = React.useState(false);
    const [understandConfirmed, setUnderstandConfirmed] = React.useState(false);

    const canProceed = backupConfirmed && understandConfirmed;

    const handleConfirm = () => {
        if (canProceed) {
            onConfirm();
            // Reset checkboxes for next time
            setBackupConfirmed(false);
            setUnderstandConfirmed(false);
        }
    };

    const handleClose = () => {
        setBackupConfirmed(false);
        setUnderstandConfirmed(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Dialog */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-2xl relative">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <AlertTriangle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Confirm Destructive Action
                                </h2>
                                <p className="text-red-100 text-sm mt-1">
                                    This operation cannot be undone
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Operation Details */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                <HardDrive className="w-5 h-5 text-gray-700 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-700">Target Device</p>
                                    <p className="text-gray-900 font-mono text-sm">
                                        {deviceType.toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                <Shield className="w-5 h-5 text-gray-700 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-700">Wipe Method</p>
                                    <p className="text-gray-900">
                                        {method.charAt(0).toUpperCase() + method.slice(1)}
                                        {method === 'military' && ' (DoD 5220.22-M Standard)'}
                                        {method === 'deep' && ' (3-pass overwrite)'}
                                        {method === 'quick' && ' (Single pass)'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                <Clock className="w-5 h-5 text-gray-700 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-700">Estimated Time</p>
                                    <p className="text-gray-900">{estimatedTime}</p>
                                </div>
                            </div>
                        </div>

                        {/* Warning Box */}
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                            <p className="font-semibold text-red-900 mb-2">
                                ⚠️ This will PERMANENTLY DELETE:
                            </p>
                            <ul className="text-sm text-red-800 space-y-1 ml-4">
                                <li>• All files and folders on the target device</li>
                                <li>• Photos, documents, videos, and applications</li>
                                <li>• Operating system files (if system drive)</li>
                                <li>• <strong>Recovery will be IMPOSSIBLE</strong></li>
                            </ul>
                        </div>

                        {/* Command Preview */}
                        <div className="bg-gray-900 rounded-xl p-3">
                            <p className="text-xs text-gray-400 mb-1">Command to Execute:</p>
                            <code className="text-green-400 font-mono text-xs break-all">
                                {command}
                            </code>
                        </div>

                        {/* Confirmation Checkboxes */}
                        <div className="space-y-3 border-t pt-4">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={backupConfirmed}
                                    onChange={(e) => setBackupConfirmed(e.target.checked)}
                                    className="mt-1 w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                                />
                                <span className="text-gray-700 group-hover:text-gray-900 transition-colors select-none">
                                    I have backed up all important data from this device
                                </span>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={understandConfirmed}
                                    onChange={(e) => setUnderstandConfirmed(e.target.checked)}
                                    className="mt-1 w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                                />
                                <span className="text-gray-700 group-hover:text-gray-900 transition-colors select-none">
                                    I understand this action is <strong>irreversible</strong> and cannot be undone
                                </span>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                onClick={handleClose}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold transition-colors"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={!canProceed}
                                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${canProceed
                                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {canProceed ? '🔥 Execute Wipe' : 'Complete Confirmations Above'}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
