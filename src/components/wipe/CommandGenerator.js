import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Terminal,
  Copy,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Download,
  Shield,
  FileText
} from "lucide-react";
import PermissionDialog from "./PermissionDialog";
import ProgressBar from "./ProgressBar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import toast, { Toaster } from 'react-hot-toast';
import { generateCertificate, generateCertificateId } from "../../utils/certificateGenerator";

const wipeCommands = {
  windows: {
    quick: "cipher /w:C:",
    deep: "sdelete -p 3 -z C:",
    military: "sdelete -p 7 -z C:"
  },
  linux: {
    quick: "dd if=/dev/zero of=/dev/sda bs=1M",
    deep: "shred -vfz -n 3 /dev/sda",
    military: "shred -vfz -n 7 /dev/sda"
  },
  ubuntu: {
    quick: "dd if=/dev/zero of=/dev/sda bs=1M",
    deep: "shred -vfz -n 3 /dev/sda",
    military: "shred -vfz -n 7 /dev/sda"
  },
  android: {
    quick: "adb shell dd if=/dev/zero of=/dev/block/userdata",
    deep: "adb shell dd if=/dev/random of=/dev/block/userdata",
    military: "Factory reset + encryption wipe (manual process)"
  },
  ios: {
    quick: "Settings > General > Transfer or Reset iPhone > Erase All Content and Settings",
    deep: "Settings > General > Transfer or Reset iPhone > Erase All Content and Settings",
    military: "Settings > General > Transfer or Reset iPhone > Erase All Content and Settings",
    crypto: "Settings > General > Transfer or Reset iPhone > Erase All Content and Settings"
  }
};

// Add crypto commands for existing OSs
wipeCommands.windows.crypto = "manage-bde -force -off C:";
wipeCommands.linux.crypto = "blkdiscard /dev/sda";
wipeCommands.ubuntu.crypto = "blkdiscard /dev/sda";
wipeCommands.android.crypto = "fastboot -w";

const commandDescriptions = {
  windows: {
    quick: "Uses Windows cipher tool to overwrite free space",
    deep: "Uses sdelete with 3-pass overwrite for enhanced security",
    military: "Uses sdelete with 7-pass DoD standard overwrite"
  },
  linux: {
    quick: "Overwrites entire drive with zeros",
    deep: "Uses shred with 3 random passes",
    military: "Uses shred with 7 random passes (DoD standard)"
  },
  ubuntu: {
    quick: "Overwrites entire drive with zeros",
    deep: "Uses shred with 3 random passes",
    military: "Uses shred with 7 random passes (DoD standard)"
  },
  android: {
    quick: "ADB command to overwrite userdata partition",
    deep: "ADB command with random data overwrite",
    military: "Manual factory reset with encryption key destruction"
  },
  ios: {
    quick: "Standard iOS reset (Crypto Erase by default)",
    deep: "Standard iOS reset (Crypto Erase by default)",
    military: "Standard iOS reset (Crypto Erase by default)",
    crypto: "Instant destruction of File System Key (effaceable storage)"
  }
};

// Add crypto descriptions
commandDescriptions.windows.crypto = "Disables BitLocker and removes encryption keys (Instant)";
commandDescriptions.linux.crypto = "Issues TRIM/Discard command to SSD controller to wipe all data blocks";
commandDescriptions.ubuntu.crypto = "Issues TRIM/Discard command to SSD controller to wipe all data blocks";
commandDescriptions.android.crypto = "Fastboot command to wipe userdata and cache partitions (destroys keys)";

export default function CommandGenerator({ deviceType, os, method, onGenerated, onExecuted }) {
  const [command, setCommand] = useState("");
  const [copied, setCopied] = useState(false);
  const [description, setDescription] = useState("");
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [progress, setProgress] = useState(0);
  const [wipeStatus, setWipeStatus] = useState('idle'); // idle, running, success, error

  useEffect(() => {
    const generatedCommand = wipeCommands[os]?.[method] || "Command not available for this combination";
    const commandDesc = commandDescriptions[os]?.[method] || "";

    setCommand(generatedCommand);
    setDescription(commandDesc);

    // Call parent callback only when command actually changes
    if (generatedCommand) {
      onGenerated(generatedCommand);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceType, os, method]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      toast.success('Command copied to clipboard!', {
        icon: <CheckCircle className="w-5 h-5" />,
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy command. Please try again.');
    }
  };

  const isUnavailable = command.includes("not available") || command.includes("manual process");

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Generated Wipe Command
        </h2>
        <p className="text-gray-600 text-lg">
          Execute this command to securely wipe your {deviceType} device
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="shadow-xl border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {method.charAt(0).toUpperCase() + method.slice(1)} Wipe Command
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{os.charAt(0).toUpperCase() + os.slice(1)}</Badge>
                  <Badge variant="outline">{deviceType.toUpperCase()}</Badge>
                </div>
              </div>
            </div>

            {/* Command Explanation Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-100 p-1 rounded-lg">
                  <Terminal className="w-4 h-4 text-blue-700" />
                </div>
                <h4 className="font-semibold text-blue-900">What does this command do?</h4>
              </div>
              <p className="text-blue-800 text-sm mb-3">
                {description}
              </p>

              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 text-xs text-blue-700">
                  <CheckCircle className="w-3 h-3" />
                  <span>Target: <strong>{deviceType.toUpperCase()}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-700">
                  <CheckCircle className="w-3 h-3" />
                  <span>Algorithm: <strong>{method.toUpperCase()}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-700">
                  <Shield className="w-3 h-3" />
                  <span>Safety: <strong>Simulation Mode Active</strong></span>
                </div>
              </div>
            </div>

            {!isUnavailable ? (
              <div className="bg-gray-900 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-400 text-sm font-mono">Command to Execute:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-white"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <code className="text-white font-mono text-sm break-all">
                  {command}
                </code>
              </div>
            ) : (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {command}. Please follow manual procedures for this device type.
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Safety Notice</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Ensure you have backed up any important data</li>
                    <li>• This process will permanently delete ALL data on the device</li>
                    <li>• Run as administrator/root for proper permissions</li>
                    <li>• Process may take several hours to a few hours to complete</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button
                onClick={onExecuted}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CheckCircle className="mr-2 w-5 h-5" />
                Finish Wipe Process
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
