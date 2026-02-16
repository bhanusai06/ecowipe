# EcoWIPE Agent - Safety Guide

## ⚠️ CRITICAL: Before Running Real Wipes

### Current Mode: SIMULATION

The agent is currently in **SIMULATION MODE** - it will NOT actually wipe drives.

### How to Enable Real Execution

**File:** `public/electron.js`

**Line 49:** Change this:
```javascript
const SIMULATION_MODE = true; // Change to false for real execution
```

To this:
```javascript
const SIMULATION_MODE = false; // ⚠️ REAL EXECUTION ENABLED
```

---

## Safety Features (Always Active)

### 1. System Drive Protection
The agent will **automatically block** these paths:
- ❌ `C:\` (Windows system)
- ❌ `/` (Linux root)
- ❌ `/dev/sda` (Primary Linux drive)
- ❌ `/dev/nvme0n1` (NVMe system drive)
- ❌ `/boot`, `/usr`, `/var`, `/home`

**Test blocked wipe:**
```bash
# This will be blocked even in real mode
cipher /w:C:\
```

### 2. Permission Dialog
Users MUST:
- ✅ Check "I backed up my data"
- ✅ Check "I understand this is irreversible"

### 3. Live Progress Monitoring
All output is streamed to the UI in real-time.

---

## Testing Strategy

### Phase 1: Simulation Testing (Current)
1. Test all device types
2. Test all wipe methods
3. Verify permission dialog works
4. Check progress display

### Phase 2: External Drive Testing
**ONLY test on external USB drives!**

1. Plug in a **non-critical USB drive** (8GB or less recommended)
2. Backup anything on it (it will be destroyed)
3. Set `SIMULATION_MODE = false`
4. Run wipe on the USB drive only

**Safe test command (Linux):**
```bash
# First identify your USB drive
lsblk

# Then test on USB only (e.g., /dev/sdc, NOT sda!)
shred -vfz -n 1 /dev/sdc
```

**Safe test command (Windows):**
```cmd
# Test on removable drive only  
cipher /w:E:\
```

### Phase 3: Production
Only after Phase 2 succeeds without errors.

---

## Error Handling

The agent handles:
- ✅ System drive detection (blocks automatically)
- ✅ Command execution failures
- ✅ Permission errors (prompts for admin/sudo)
- ✅ Non-existent paths
- ✅ Progress streaming

---

## Emergency Stop

If a wipe is running and you need to stop it:
1. Close the Electron window
2. OR: `Ctrl+C` in the terminal running `npm run electron-dev`

**Warning:** Stopping mid-wipe may leave data partially overwritten (still unrecoverable).
