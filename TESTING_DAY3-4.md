# Testing the Real Execution Mode

## ⚠️ BEFORE YOU START

**Current Mode:** SIMULATION (safe)  
**Location:** `public/electron.js`, line 48

---

## Test 1: System Drive Protection (Safe to Test Now)

Even in simulation, you can verify the system drive blocker works:

**Try to wipe C:\ or /**
1. Run the app
2. Select Windows device, any method
3. Click "Run Automatically" → Confirm dialog
4. **Expected result:** `[ERROR] BLOCKED: Cannot wipe system drive`

This proves the safety check works!

---

## Test 2: Real Wipe on External USB (⚠️ DESTRUCTIVE)

**Prerequisites:**
- [ ] You have a USB drive you don't need (8GB or less recommended)
- [ ] You've backed up everything on it
- [ ] You understand it will be permanently erased

### Step 1: Enable Real Mode
Edit `public/electron.js`:
```javascript
// Line 48: Change this
const SIMULATION_MODE = true;

// To this
const SIMULATION_MODE = false; // ⚠️ REAL EXECUTION
```

### Step 2: Identify Your USB Drive

**Linux:**
```bash
lsblk
# Look for your USB (e.g., sdc, sdd - NOT sda!)
```

**Windows:**
```cmd
# Check in File Explorer - note the drive letter (e.g., E:\, F:\)
```

### Step 3: Modify Command (Temporarily)

**Option A:** Edit `src/components/wipe/CommandGenerator.js` to hard-code your USB:
```javascript
// Line 18: Quick wipe test
quick: "shred -vfz -n 1 /dev/sdc"  // Replace sdc with YOUR USB
```

**Option B:** Select "Linux" device in UI and it will generate commands for /dev/sda (which will be blocked)

### Step 4: Run the Wipe
1. Click "Run Automatically"
2. Check both boxes
3. Click "Execute Wipe"
4. **Watch the live console** - you should see real output

### Step 5: Verify
```bash
# After completion, try to mount the drive
sudo mount /dev/sdc /mnt
# Should fail - drive is wiped
```

---

## Test 3: Error Handling

Try these to verify error handling:

### Non-existent Path
```javascript
quick: "shred -vfz /dev/sdz999"  // Doesn't exist
```
**Expected:** `[ERROR] No such file or directory`

### Permission Error
```javascript
quick: "shred -vfz /dev/sdc"  // Run WITHOUT sudo
```
**Expected:** `[ERROR] Permission denied`

---

## Day 5 Next Steps

Once Day 3-4 testing is complete:
- Add progress percentage display
- Generate PDF certificates
- Add success animations
- Polish error messages
