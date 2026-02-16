import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';

const AnimatedCard = ({
    children,
    className = '',
    hoverScale = 1.02,
    hoverShadow = 'xl',
    delay = 0,
    onClick,
    ...props
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.3 }}
            whileHover={{
                scale: hoverScale,
                boxShadow: `0 ${hoverShadow === 'xl' ? '20px 25px' : '10px 15px'} -3px rgba(0, 0, 0, 0.1), 0 ${hoverShadow === 'xl' ? '10px 10px' : '4px 6px'} -2px rgba(0, 0, 0, 0.05)`
            }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`transition-all duration-300 ease-out cursor-pointer ${className}`}
            onClick={onClick}
            {...props}
        >
            <Card className="h-full border-2 transition-colors duration-300">
                <CardContent className="relative overflow-hidden p-6">
                    {children}

                    {/* Gradient Overlay on Hover */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 0.05 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500"
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AnimatedCard;
