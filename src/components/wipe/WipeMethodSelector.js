import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Zap,
  Shield,
  ShieldCheck,
  Clock,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Lock
} from "lucide-react";
import ComparisonChart from "./ComparisonChart";

const wipeMethods = [
  {
    type: "quick",
    icon: Zap,
    title: "Quick Wipe",
    description: "Fast single-pass overwrite for basic security",
    duration: "5-15 minutes",
    security: "Basic",
    color: "from-blue-500 to-cyan-500",
    passes: "1 pass",
    recommended: "Personal files, non-sensitive data"
  },
  {
    type: "deep",
    icon: Shield,
    title: "Deep Wipe",
    description: "Multi-pass overwrite for enhanced security",
    duration: "30-60 minutes",
    security: "High",
    color: "from-purple-500 to-indigo-500",
    passes: "3 passes",
    recommended: "Business data, confidential files"
  },
  {
    type: "military",
    icon: ShieldCheck,
    title: "Military Grade",
    description: "DoD 5220.22-M standard wiping protocol",
    duration: "2-4 hours",
    security: "Maximum",
    color: "from-red-500 to-orange-500",
    passes: "7+ passes",
    recommended: "Classified data, maximum security needed"
  },
  {
    type: "crypto",
    icon: Lock,
    title: "Crypto Erase",
    description: "Instant destruction of encryption keys (SSD/Mobile)",
    duration: "< 1 minute",
    security: "Maximum",
    color: "from-emerald-500 to-teal-500",
    passes: "Key Destroy",
    recommended: "Modern SSDs, Encrypted Mobile Devices"
  }
];

export default function WipeMethodSelector({ deviceType, onSelect }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleNext = () => {
    if (selectedMethod) {
      onSelect(selectedMethod.type);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Wipe Method
        </h2>
        <p className="text-gray-600 text-lg mb-4">
          Select the security level that matches your needs
        </p>
        <Button
          onClick={() => setShowComparison(!showComparison)}
          variant="outline"
          className="mb-4 flex items-center gap-2 mx-auto px-4 py-2"
        >
          <BarChart3 className="w-4 h-4" />
          {showComparison ? 'Hide' : 'Show'} Detailed Comparison
        </Button>
      </div>

      {showComparison && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8"
        >
          <ComparisonChart />
        </motion.div>
      )}

      <div className="grid gap-4 md:gap-6">
        {wipeMethods.map((method, index) => (
          <motion.div
            key={method.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${selectedMethod?.type === method.type
                ? 'ring-2 ring-green-500 shadow-lg'
                : 'hover:shadow-lg'
                }`}
              onClick={() => handleMethodSelect(method)}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-lg shrink-0`}>
                    <method.icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row items-center md:justify-between gap-2 mb-2">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900">
                        {method.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={`${method.security === 'Basic'
                          ? 'bg-blue-100 text-blue-800'
                          : method.security === 'High'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {method.security} Security
                      </Badge>
                    </div>

                    <p className="text-gray-600 text-sm md:text-base mb-4">
                      {method.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-lg">
                      <div className="flex flex-col md:flex-row items-center md:gap-2">
                        <div className="flex items-center gap-1 text-gray-500 mb-1 md:mb-0">
                          <Clock className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="text-xs md:hidden">Time</span>
                        </div>
                        <span className="text-gray-900 font-medium md:font-normal md:text-gray-700">{method.duration}</span>
                      </div>
                      <div className="flex flex-col md:flex-row items-center md:gap-2">
                        <div className="flex items-center gap-1 text-gray-500 mb-1 md:mb-0">
                          <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="text-xs md:hidden">Passes</span>
                        </div>
                        <span className="text-gray-900 font-medium md:font-normal md:text-gray-700">{method.passes}</span>
                      </div>
                      <div className="col-span-2 text-center md:text-left border-t border-gray-100 md:border-0 pt-2 md:pt-0 mt-1 md:mt-0">
                        <p className="text-xs text-gray-500">
                          <strong className="block md:inline mb-1 md:mb-0">Recommended:</strong> {method.recommended}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedMethod && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {selectedMethod.title} Selected
          </h3>
          <p className="text-gray-600 mb-4">
            This will perform a {selectedMethod.security.toLowerCase()} security wipe
            taking approximately {selectedMethod.duration}
          </p>
          <Button
            onClick={handleNext}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Generate Wipe Command
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}