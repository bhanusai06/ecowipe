import React, { createContext, useState, useContext, useEffect } from 'react';

const WipeWorkflowContext = createContext();

const STORAGE_KEY = 'ecowipe_workflow_state';

const initialState = {
    deviceType: null,
    os: null,
    wipeMethod: null,
    command: null,
    executionConfirmed: false,
    proofUploaded: false,
    certificate: null,
    currentStep: 0,
};

export const WipeWorkflowProvider = ({ children }) => {
    const [state, setState] = useState(() => {
        // Load from localStorage on init
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : initialState;
        } catch (error) {
            console.error('Failed to load workflow state:', error);
            return initialState;
        }
    });

    // Save to localStorage whenever state changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error('Failed to save workflow state:', error);
        }
    }, [state]);

    const setDeviceData = (deviceType, os) => {
        setState((prev) => ({
            ...prev,
            deviceType,
            os,
            currentStep: Math.max(prev.currentStep, 1),
        }));
    };

    const setWipeMethod = (method) => {
        setState((prev) => ({
            ...prev,
            wipeMethod: method,
            currentStep: Math.max(prev.currentStep, 2),
        }));
    };

    const setCommand = (command) => {
        setState((prev) => ({
            ...prev,
            command,
            currentStep: Math.max(prev.currentStep, 3),
        }));
    };

    const confirmExecution = () => {
        setState((prev) => ({
            ...prev,
            executionConfirmed: true,
            currentStep: Math.max(prev.currentStep, 4),
        }));
    };

    const uploadProof = (file, certificate = null) => {
        setState((prev) => ({
            ...prev,
            proofUploaded: true,
            certificate,
            currentStep: 5,
        }));
    };

    const resetWorkflow = () => {
        setState(initialState);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear workflow state:', error);
        }
    };

    const value = {
        ...state,
        setDeviceData,
        setWipeMethod,
        setCommand,
        confirmExecution,
        uploadProof,
        resetWorkflow,
    };

    return (
        <WipeWorkflowContext.Provider value={value}>
            {children}
        </WipeWorkflowContext.Provider>
    );
};

export const useWipeWorkflow = () => {
    const context = useContext(WipeWorkflowContext);
    if (!context) {
        throw new Error('useWipeWorkflow must be used within WipeWorkflowProvider');
    }
    return context;
};

export default WipeWorkflowContext;
