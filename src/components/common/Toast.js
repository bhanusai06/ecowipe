import React from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Check, X, AlertCircle, Info } from 'lucide-react';

export const showToast = {
    success: (message, options = {}) => {
        return toast.success(message, {
            icon: <Check className="w-5 h-5" />,
            duration: 3000,
            position: 'top-center',
            style: {
                background: '#10b981',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
            },
            ...options,
        });
    },

    error: (message, options = {}) => {
        return toast.error(message, {
            icon: <X className="w-5 h-5" />,
            duration: 4000,
            position: 'top-center',
            style: {
                background: '#ef4444',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
            },
            ...options,
        });
    },

    info: (message, options = {}) => {
        return toast(message, {
            icon: <Info className="w-5 h-5" />,
            duration: 3000,
            position: 'top-center',
            style: {
                background: '#3b82f6',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
            },
            ...options,
        });
    },

    warning: (message, options = {}) => {
        return toast(message, {
            icon: <AlertCircle className="w-5 h-5" />,
            duration: 3500,
            position: 'top-center',
            style: {
                background: '#f59e0b',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
            },
            ...options,
        });
    },
};

export const ToastContainer = () => {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                className: '',
                duration: 3000,
            }}
        />
    );
};

export default showToast;
