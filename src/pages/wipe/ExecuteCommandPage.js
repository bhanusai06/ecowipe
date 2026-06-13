import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommandGenerator from '../../components/wipe/CommandGenerator';
import { useWipeWorkflow } from '../../context/WipeWorkflowContext';

const ExecuteCommandPage = () => {
    const navigate = useNavigate();
    const { deviceType, os, wipeMethod, setCommand, confirmExecution } = useWipeWorkflow();

    useEffect(() => {
        if (!deviceType || !os || !wipeMethod) {
            navigate('/wipe');
        }
    }, [deviceType, os, wipeMethod, navigate]);

    const handleCommandGenerated = (cmd) => {
        setCommand(cmd);
    };

    const handleExecuted = () => {
        confirmExecution();
        navigate('/wipe');
    };

    if (!deviceType || !os || !wipeMethod) return null;

    return (
        <div className="py-8">
            <CommandGenerator
                deviceType={deviceType}
                os={os}
                method={wipeMethod}
                onGenerated={handleCommandGenerated}
                onExecuted={handleExecuted}
            />
        </div>
    );
};

export default ExecuteCommandPage;
