import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
    User as UserIcon,
    Award,
    Shield,
    FileText,
    Download,
    Calendar,
    Building,
    Mail,
    HardDrive,
    Lock
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { WipeRecord } from "../entities/WipeRecord";
import { format } from "date-fns";

const BADGE_DEFINITIONS = {
    first_wipe: { label: "First Wipe", icon: Shield, color: "bg-blue-100 text-blue-800", desc: "Completed your first secure data wipe" },
    eco_warrior: { label: "Eco Warrior", icon: Award, color: "bg-green-100 text-green-800", desc: "Saved 10+ devices from landfill" },
    data_guardian: { label: "Data Guardian", icon: Lock, color: "bg-purple-100 text-purple-800", desc: "Wiped over 1TB of data" }
};

export default function UserProfile() {
    const { user } = useAuth();
    const [userWipes, setUserWipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserWipes = async () => {
            if (!user) return;
            try {
                const records = await WipeRecord.filter({ user_id: user._id });
                // Sort newest first
                records.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
                setUserWipes(records);
            } catch (error) {
                console.error("Failed to fetch user's certificates:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserWipes();
    }, [user]);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    const handleDownloadCertificate = (record) => {
        // In a real app, this would hit an API endpoint that generates a PDF
        // For now, we simulate a download
        const certNumber = `CERT-${record.id.substring(0, 8).toUpperCase()}`;
        alert(`Simulating download for ${certNumber} (Generated for: ${user.full_name})`);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-8">

                {/* Left Column: Profile Card & Badges */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Main Identity Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                            <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-500 relative">
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                    <div className="w-24 h-24 bg-white rounded-full p-1 shadow-xl">
                                        <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center">
                                            <UserIcon className="w-12 h-12 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="pt-16 pb-8 text-center px-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                    {user.full_name || "User"}
                                </h2>
                                <div className="flex items-center justify-center gap-2 text-gray-500 mb-6 font-medium">
                                    {user.organization ? (
                                        <>
                                            <Building className="w-4 h-4" />
                                            <span>{user.organization}</span>
                                        </>
                                    ) : (
                                        <span>Individual User</span>
                                    )}
                                </div>

                                <div className="space-y-4 text-left border-t border-slate-100 pt-6">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm font-medium">{user.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-600">
                                        <div className="flex items-center gap-3">
                                            <Award className="w-4 h-4 text-emerald-500" />
                                            <span className="text-sm font-medium">Eco Points</span>
                                        </div>
                                        <span className="font-bold text-emerald-600">{user.total_eco_points || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-600">
                                        <div className="flex items-center gap-3">
                                            <HardDrive className="w-4 h-4 text-amber-500" />
                                            <span className="text-sm font-medium">Devices Wiped</span>
                                        </div>
                                        <span className="font-bold text-amber-600">{user.total_devices_wiped || 0}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Badges Earned */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Award className="w-5 h-5 text-emerald-500" />
                                    Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4">
                                    {user.eco_badges && user.eco_badges.length > 0 ? (
                                        user.eco_badges.map((badgeId, i) => {
                                            const badge = BADGE_DEFINITIONS[badgeId];
                                            if (!badge) return null;
                                            const Icon = badge.icon;
                                            return (
                                                <div key={i} className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                    <div className={`${badge.color} p-3 rounded-lg flex items-center justify-center`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">{badge.label}</h4>
                                                        <p className="text-xs text-slate-500 mt-1">{badge.desc}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-6 text-slate-500 italic text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            Complete wipes to earn eco-badges
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Right Column: Certificates Vault */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="h-full"
                    >
                        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm h-full flex flex-col">
                            <CardHeader className="bg-slate-900 text-white rounded-t-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-6 h-6 text-emerald-400" />
                                        <CardTitle className="text-2xl font-bold">Certificate Vault</CardTitle>
                                    </div>
                                    <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">
                                        {userWipes.length} Certificates
                                    </Badge>
                                </div>
                                <p className="text-slate-400 text-sm mt-2">
                                    Access and download verifiable proof of destruction for all your wiped devices.
                                </p>
                            </CardHeader>

                            <CardContent className="flex-1 p-6">
                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="animate-pulse flex gap-4 p-4 border rounded-xl">
                                                <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : userWipes.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-20 px-6">
                                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                            <FileText className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Your vault is empty</h3>
                                        <p className="text-slate-500 max-w-sm mb-8">
                                            You haven't generated any Certificates of Destruction yet. Run your first secure wipe to start building your compliance history.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {userWipes.map((record) => (
                                            <div
                                                key={record.id}
                                                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-slate-200 hover:border-emerald-300 rounded-xl hover:shadow-md transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                                                        <Shield className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold text-slate-900 capitalize">
                                                                {record.device_type} Wipe Certificate
                                                            </h4>
                                                            {record.status === 'completed' && (
                                                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 text-xs px-2 py-0">Verified</Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                {format(new Date(record.created_date), "MMM d, yyyy")}
                                                            </span>
                                                            <span className="flex items-center gap-1 font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                                                ID: {record.id.substring(0, 8).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={() => handleDownloadCertificate(record)}
                                                    variant="outline"
                                                    className="w-full sm:w-auto shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200 transition-colors"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    View Document
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
