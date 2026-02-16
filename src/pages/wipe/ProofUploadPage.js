import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProofUpload from '../../components/wipe/ProofUpload';
import { useWipeWorkflow } from '../../context/WipeWorkflowContext';

const ProofUploadPage = () => {
    const navigate = useNavigate();
    const {
        deviceType,
        os,
        wipeMethod,
        uploadProof,
        resetWorkflow,
        executionConfirmed
    } = useWipeWorkflow();

    useEffect(() => {
        if (!executionConfirmed) {
            navigate('/wipe/execute');
        }
    }, [executionConfirmed, navigate]);

    const handleUploaded = async (data) => {
        uploadProof(data.proof_screenshot_url);
        // Note: The ProofUpload component handles the navigation to certificate
        // We might want to standardize this, but for now we'll let it handle the certificate view
    };

    const handleReset = () => {
        resetWorkflow();
        navigate('/wipe');
    };

    if (!executionConfirmed) return null;

    // Construct wipeData object expected by ProofUpload
    const wipeData = {
        id: Date.now().toString(), // Temporary ID for session
        device_type: deviceType,
        operating_system: os,
        wipe_method: wipeMethod,
        status: 'pending_verification'
    };

    return (
        <div className="py-8">
            <ProofUpload
                wipeData={wipeData}
                onUploaded={handleUploaded}
                onReset={handleReset}
            />
        </div>
    );
};

export default ProofUploadPage;
