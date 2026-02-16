import React from 'react';
import { Outlet } from 'react-router-dom';
import { useWipeWorkflow } from '../../context/WipeWorkflowContext';
import ProgressStepper from './ProgressStepper';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WipeLayout = () => {
    const { currentStep, resetWorkflow } = useWipeWorkflow();
    const navigate = useNavigate();

    const handleExit = () => {
        if (window.confirm('Are you sure you want to exit? Your progress will be saved.')) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/20 pt-20">
            {/* Progress Stepper */}
            {currentStep > 0 && <ProgressStepper currentStep={currentStep} />}

            {/* Exit Button */}
            <div className="mx-auto max-w-4xl px-6 py-4">
                <Button
                    onClick={handleExit}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900"
                >
                    <X className="mr-2 h-4 w-4" />
                    Exit Workflow
                </Button>
            </div>

            {/* Page Content */}
            <main className="mx-auto max-w-4xl px-6 pb-16">
                <Outlet />
            </main>
        </div>
    );
};

export default WipeLayout;
