# Building EcoWIPE as a Standalone Desktop App

## Quick Start

### Option 1: Development Mode (Testing)
```bash
npm run electron-dev
```
This opens a dev window with "Run Automatically" button visible.

---

## Option 2: Create Installable App

### Step 1: Build the App
```bash
npm run electron:build
```

This will:
1. Build the React app (`npm run build`)
2. Package it with Electron
3. Create installers in the `dist/` folder

### Output Files (Linux)
- `dist/EcoWIPE-1.0.0.AppImage` - Portable app (no installation needed)
- `dist/ecowipe_1.0.0_amd64.deb` - Debian installer for Ubuntu/Debian

### Step 2: Install
**AppImage (Recommended - No Install Required)**:
```bash
chmod +x dist/EcoWIPE-1.0.0.AppImage
./dist/EcoWIPE-1.0.0.AppImage
```

**Debian Package**:
```bash
sudo dpkg -i dist/ecowipe_1.0.0_amd64.deb
```

---

## Testing Without Building (Quick Pack)

To test the packaging without creating installers:
```bash
npm run electron:pack
```
This creates an unpacked directory in `dist/linux-unpacked/` that you can run directly.

---

## Troubleshooting

### Error: "wait-on: not found"
✅ Fixed - we just installed it

### Build fails
Make sure you have these installed:
```bash
sudo apt-get install -y rpm
```

### App won't start
Check the console logs in the Electron dev tools (Ctrl+Shift+I in the app)
