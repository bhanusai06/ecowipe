const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// --- IPC Handlers for Wipe Commands ---

// CONFIGURATION: Toggle between simulation and real execution
// IMPORTANT: Set to false ONLY when you're ready to actually wipe drives
const SIMULATION_MODE = true; // Change to false for real execution

// System drive detection - CRITICAL SAFETY CHECK
function isSystemDrive(command) {
    const dangerousPaths = [
        'C:\\',           // Windows system drive
        'c:',             // Windows (case insensitive)
        '/dev/sda',       // Linux primary drive (usually)
        '/dev/nvme0n1',   // Linux NVMe primary
        '/dev/sdb',       // Could be system on some setups
        '/',              // Root filesystem
        '/home',          // User home directory
        '/boot',          // Boot partition
        '/usr',           // System files
        '/var',           // System files
    ];

    // Check if command contains any dangerous path
    const commandLower = command.toLowerCase();
    return dangerousPaths.some(path => commandLower.includes(path.toLowerCase()));
}

// Parse target path from command for detailed checks
function extractTargetPath(command) {
    // Windows cipher command: cipher /w:D:\
    if (command.includes('cipher /w:')) {
        const match = command.match(/cipher \/w:([A-Za-z]:\\?)/i);
        return match ? match[1] : null;
    }

    // Linux shred: shred -vfz /dev/sdX
    if (command.includes('shred')) {
        const match = command.match(/shred\s+.*\s+(\/dev\/\S+|\/\S+)/);
        return match ? match[1] : null;
    }

    // Linux dd: dd if=/dev/zero of=/dev/sdX
    if (command.includes('dd')) {
        const match = command.match(/of=(\/dev\/\S+|\/\S+)/);
        return match ? match[1] : null;
    }

    return null;
}

ipcMain.on('execute-wipe', (event, { command }) => {
    console.log('Received wipe command:', command);

    // SAFETY CHECK 1: Detect system drives
    if (isSystemDrive(command)) {
        console.error('[BLOCKED] Attempted to wipe system drive!');
        event.reply('wipe-progress', '[ERROR] BLOCKED: Cannot wipe system drive (C:\\ or /)');
        event.reply('wipe-progress', '[ERROR] This would destroy your operating system!');
        event.reply('wipe-complete', {
            success: false,
            code: 1,
            error: 'System drive detected - operation blocked for safety'
        });
        return;
    }

    const targetPath = extractTargetPath(command);
    console.log('[INFO] Target path:', targetPath);

    if (SIMULATION_MODE) {
        // === SIMULATION MODE ===
        console.log(`[SIMULATION] Would execute: ${command}`);
        event.reply('wipe-progress', `[SIMULATION] Starting execution of: ${command}`);

        if (targetPath) {
            event.reply('wipe-progress', `[CHECK] Target drive: ${targetPath}`);
        }

        event.reply('wipe-progress', `[SIMULATION] Verifying target path safely...`);

        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 20;
            event.reply('wipe-progress', `[SIMULATION] Wiping... ${progress}% completed`);

            if (progress >= 100) {
                clearInterval(interval);
                event.reply('wipe-progress', `[SIMULATION] Success! Drive wiped (Simulated).`);
                event.reply('wipe-complete', { success: true, code: 0 });
            }
        }, 800);

    } else {
        // === REAL EXECUTION MODE ===
        console.log(`[REAL] Executing: ${command}`);
        event.reply('wipe-progress', `[REAL] ⚠️ EXECUTING DESTRUCTIVE COMMAND`);

        if (targetPath) {
            event.reply('wipe-progress', `[REAL] Target: ${targetPath}`);
        }

        // Execute the actual command
        const child = exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('[ERROR] Execution failed:', error);
                event.reply('wipe-progress', `[ERROR] ${error.message}`);
                event.reply('wipe-complete', {
                    success: false,
                    code: error.code || 1,
                    error: error.message
                });
                return;
            }

            // Success
            console.log('[SUCCESS] Command completed');
            event.reply('wipe-progress', `[SUCCESS] Wipe completed successfully`);
            event.reply('wipe-complete', { success: true, code: 0 });
        });

        // Stream stdout progress
        child.stdout.on('data', (data) => {
            console.log('[OUTPUT]', data);
            event.reply('wipe-progress', `[OUTPUT] ${data.toString().trim()}`);
        });

        // Stream stderr progress (many wipe tools write to stderr)
        child.stderr.on('data', (data) => {
            console.log('[STDERR]', data);
            event.reply('wipe-progress', `[PROGRESS] ${data.toString().trim()}`);
        });
    }
});

