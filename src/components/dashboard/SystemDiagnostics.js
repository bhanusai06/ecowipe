import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Battery, BatteryCharging, Cpu, HardDrive, Wifi, Monitor, Activity, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const SystemDiagnostics = () => {
    const [stats, setStats] = useState({
        battery: null,
        cpuCores: navigator.hardwareConcurrency || 'N/A',
        memory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'N/A',
        connection: navigator.connection || null,
        platform: navigator.platform,
        screen: `${window.screen.width}x${window.screen.height}`,
        isOnline: navigator.onLine
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch Battery Data
        if (navigator.getBattery) {
            navigator.getBattery().then(battery => {
                const updateBattery = () => {
                    setStats(prev => ({
                        ...prev,
                        battery: {
                            level: Math.round(battery.level * 100),
                            charging: battery.charging,
                            chargingTime: battery.chargingTime,
                            dischargingTime: battery.dischargingTime
                        }
                    }));
                };
                updateBattery();
                battery.addEventListener('levelchange', updateBattery);
                battery.addEventListener('chargingchange', updateBattery);
            });
        }

        // Network Listener
        const updateOnlineStatus = () => {
            setStats(prev => ({ ...prev, isOnline: navigator.onLine }));
        };
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        // Simulate scanning delay for effect
        setTimeout(() => setLoading(false), 1500);

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, []);

    const StatCard = ({ icon: Icon, label, value, color, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3 }}
            className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all group`}
        >
            <div className={`w-12 h-12 rounded-full bg-${color}-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 text-${color}-500`} />
            </div>
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
                <div className="h-6 flex items-center">
                    {loading ? (
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    ) : (
                        <p className="text-lg font-bold text-gray-900">{value}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );

    return (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-white overflow-hidden mb-8">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-pulse" />

            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        System Diagnostics
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-ping' : 'bg-emerald-500'}`} />
                        {loading ? 'SCANNING HARDWARE...' : 'SYSTEM ONLINE'}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Battery */}
                    <StatCard
                        icon={stats.battery?.charging ? BatteryCharging : Battery}
                        label="Power Status"
                        value={stats.battery ? `${stats.battery.level}% ${stats.battery.charging ? '(Charging)' : ''}` : 'AC Power / Unknown'}
                        color={stats.battery?.level < 20 ? 'red' : 'green'}
                        delay={0.1}
                    />

                    {/* CPU */}
                    <StatCard
                        icon={Cpu}
                        label="Processor"
                        value={`${stats.cpuCores} Logical Cores`}
                        color="blue"
                        delay={0.2}
                    />

                    {/* Memory */}
                    <StatCard
                        icon={HardDrive}
                        label="Memory Estimate"
                        value={`~${stats.memory} RAM`}
                        color="purple"
                        delay={0.3}
                    />

                    {/* Network */}
                    <StatCard
                        icon={stats.isOnline ? Wifi : Zap}
                        label="Network Status"
                        value={stats.isOnline ? `Online (${stats.connection?.effectiveType?.toUpperCase() || 'WiFi'})` : 'Offline'}
                        color={stats.isOnline ? 'cyan' : 'gray'}
                        delay={0.4}
                    />
                </div>

                {/* Footer Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-6 text-xs text-gray-400 font-mono"
                >
                    <div className="flex items-center gap-2">
                        <Monitor className="w-3 h-3" />
                        Display: {stats.screen}
                    </div>
                    <div>
                        Platform: {stats.platform}
                    </div>
                    <div>
                        User Agent: {navigator.userAgent.split(')')[0]}
                    </div>
                </motion.div>
            </CardContent>
        </Card>
    );
};

export default SystemDiagnostics;
