import React from 'react';
import { useNavigate } from 'react-router-dom';
import DeviceSelector from '../../components/wipe/DeviceSelector';
import { useWipeWorkflow } from '../../context/WipeWorkflowContext';

const DeviceSelectionPage = () => {
    const navigate = useNavigate();
    const { setDeviceData } = useWipeWorkflow();

    const handleDeviceSelect = (deviceType, os) => {
        setDeviceData(deviceType, os);
        navigate('/wipe/method');
    };

    return (
        <div className="py-8">
            <DeviceSelector onSelect={handleDeviceSelect} />
        </div>
    );
};

export default DeviceSelectionPage;
