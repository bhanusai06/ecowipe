const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Methods to trigger actions in Main process
    runWipe: (command) => ipcRenderer.send('execute-wipe', { command }),

    // Methods to listen for events from Main process
    onWipeProgress: (callback) => {
        const subscription = (event, data) => callback(data);
        ipcRenderer.on('wipe-progress', subscription);
        return () => ipcRenderer.removeListener('wipe-progress', subscription);
    },

    onWipeComplete: (callback) => {
        const subscription = (event, data) => callback(data);
        ipcRenderer.on('wipe-complete', subscription);
        return () => ipcRenderer.removeListener('wipe-complete', subscription);
    }
});
