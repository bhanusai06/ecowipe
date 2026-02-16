import React, { useState } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ children, content, side = 'top', delayDuration = 200 }) => {
    const [open, setOpen] = useState(false);

    return (
        <TooltipPrimitive.Provider delayDuration={delayDuration}>
            <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
                <TooltipPrimitive.Trigger asChild>
                    {children}
                </TooltipPrimitive.Trigger>
                <AnimatePresence>
                    {open && (
                        <TooltipPrimitive.Portal forceMount>
                            <TooltipPrimitive.Content
                                side={side}
                                align="center"
                                sideOffset={5}
                                asChild
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: side === 'top' ? 5 : -5, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: side === 'top' ? 5 : -5, scale: 0.96 }}
                                    transition={{ duration: 0.15, ease: 'easeOut' }}
                                    className="tooltip-content"
                                >
                                    <div className="tooltip-inner">
                                        {content}
                                    </div>
                                    <TooltipPrimitive.Arrow className="tooltip-arrow" />
                                </motion.div>
                            </TooltipPrimitive.Content>
                        </TooltipPrimitive.Portal>
                    )}
                </AnimatePresence>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
};

export default Tooltip;
