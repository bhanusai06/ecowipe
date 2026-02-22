import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Shield,
  Leaf,
  Award,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Laptop,
  HardDrive,
  Usb,
  FileText,
  Cloud,
  Terminal,
  Cpu
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import GeometricBackground from "../components/common/GeometricBackground";
import { User } from "../entities/User";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth-token');
    if (token) {
      // In a real app we'd fetch the user profile here if we didn't use context
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <GeometricBackground />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full mb-8">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-700">Certified Secure Wiping</span>
              <Leaf className="w-5 h-5 text-green-600" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-slate-900 via-green-800 to-emerald-700 bg-clip-text text-transparent leading-tight">
              EcoWipe
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 mb-8 font-light max-w-3xl mx-auto leading-relaxed">
              Securely wipe any device with our <span className="font-semibold text-green-600">3-Pillar Architecture</span>: Cloud Dashboard, Desktop Agent, and Live OS.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { icon: Shield, text: "Military-Grade Security" },
                { icon: Award, text: "Certified Compliance" },
                { icon: Leaf, text: "Eco-Conscious" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100"
                >
                  <feature.icon className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Access Cloud Dashboard
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/wipe')}
                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Run Web Simulator
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3 Pillar Architecture Section */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The 3-Pillar Architecture
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              EcoWipe's comprehensive suite ensures absolute data destruction across any hardware environment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar 1: Cloud Dashboard */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all flex flex-col"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Cloud className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cloud Dashboard</h3>
              <p className="text-gray-600 mb-8 flex-grow">
                Centralized fleet management. Generate certified tamper-proof reports, view real-time analytics, and track your organization's eco-impact.
              </p>
              <Button
                onClick={() => navigate('/')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl text-lg mt-auto"
              >
                Access Dashboard
              </Button>
            </motion.div>

            {/* Pillar 2: Desktop Agent */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all flex flex-col"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Terminal className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Desktop Agent</h3>
              <p className="text-gray-600 mb-8 flex-grow">
                Native hardware access application. Install directly to your operating system to securely wipe connected external drives and USBs.
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-xl text-lg mt-auto"
              >
                Get Agent via Dashboard
                Download Agent
              </Button>
            </motion.div>

            {/* Pillar 3: Live OS */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all flex flex-col"
            >
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Cpu className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Live OS</h3>
              <p className="text-gray-600 mb-8 flex-grow">
                Bootable Linux environment. Flash to a USB to perform bare-metal data destruction on host computers, securely in air-gapped environments.
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-xl text-lg mt-auto"
              >
                Get ISO via Dashboard
                Download ISO
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certificate Preview Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Receive an Official Certificate of Destruction
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Upon successful verification, you'll receive a tamper-proof digital certificate.
              Perfect for compliance, record-keeping, or peace of mind.
            </p>
            <ul className="space-y-3">
              {[
                { icon: CheckCircle, text: "AI-Verified Proof of Wipe" },
                { icon: Award, text: "Industry Standard Compliance" },
                { icon: Leaf, text: "Quantified Eco-Impact" },
              ].map(item => (
                <li key={item.text} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring" }}
            className="w-full max-w-lg mx-auto"
          >
            <div className="p-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-2xl transform lg:rotate-3">
              <div className="bg-white rounded-xl p-6 border-4 border-gray-100 aspect-[1.414/1] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Shield className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="font-bold text-green-700 text-lg">EcoWipe</h3>
                      <p className="text-xs text-gray-500">Data Destruction Certificate</p>
                    </div>
                  </div>
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">This certifies that</p>
                  <p className="font-bold text-lg text-gray-800">Your Name Here</p>
                  <p className="text-sm text-gray-600 mt-2">
                    has successfully completed a secure data wipe.
                  </p>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-xs">
                    <p className="font-bold">Date: {new Date().toLocaleDateString()}</p>
                    <p className="text-gray-500">ID: EW-CERT-SAMPLE</p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold text-sm">AI VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* End of Marketing Sections */}
    </div>
  );
}