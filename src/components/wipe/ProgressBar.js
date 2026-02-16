import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ProgressBar({ progress, status = 'running' }) {
    const getStatusColor = () => {
        switch (status) {
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            case 'running':
                return 'bg-blue-500';
            default:
                return 'bg-gray-300';
        }
    };

    const getIcon = () => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-600" />;
            case 'running':
                return <AlertCircle className="w-5 h-5 text-blue-600 animate-pulse" />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {getIcon()}
                    <span className="text-sm font-semibold text-gray-700">
                        {status === 'running' && 'Wiping in progress...'}
                        {status === 'success' && 'Wipe completed successfully!'}
                        {status === 'error' && 'Wipe failed'}
                    </span>
                </div>
                <span className="text-sm font-mono text-gray-600">{progress}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${getStatusColor()} ${status === 'running' ? 'animate-pulse' : ''
                        }`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
