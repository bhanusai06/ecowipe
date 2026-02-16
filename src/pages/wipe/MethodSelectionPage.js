import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WipeMethodSelector from '../../components/wipe/WipeMethodSelector';
import { useWipeWorkflow } from '../../context/WipeWorkflowContext';

const MethodSelectionPage = () => {
    const navigate = useNavigate();
    const { deviceType, setWipeMethod } = useWipeWorkflow();

    useEffect(() => {
        if (!deviceType) {
            navigate('/wipe/device');
        }
    }, [deviceType, navigate]);

    const handleMethodSelect = (method) => {
        setWipeMethod(method);
        navigate('/wipe/execute');
    };

    if (!deviceType) return null;

    return (
        <div className="py-8">
            <WipeMethodSelector deviceType={deviceType} onSelect={handleMethodSelect} />
        </div>
    );
};

export default MethodSelectionPage;
