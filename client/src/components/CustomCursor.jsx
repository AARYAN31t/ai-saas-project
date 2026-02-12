import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

const CustomCursor = () => {
    const [isPointer, setIsPointer] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring configuration for smooth "liquid" motion
    const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    // Multiple trailing dots for the 3D depth effect
    // We vary size, lag, and opacity to create a "comet trail" in 3D space
    const particleCount = 12;
    const particles = Array.from({ length: particleCount });

    useEffect(() => {
        const handleMouseMove = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            const target = e.target;
            const isClickable = window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a');
            setIsPointer(isClickable);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [cursorX, cursorY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* 3D Global Glow (Moving Light Source) */}
            <motion.div
                className="absolute w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]"
                style={{
                    x: useSpring(cursorX, { damping: 50, stiffness: 50 }),
                    y: useSpring(cursorY, { damping: 50, stiffness: 50 }),
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />

            {/* The Trail - Each dot has unique physics for a 3D feel */}
            {particles.map((_, i) => (
                <TrailingParticle
                    key={i}
                    x={cursorX}
                    y={cursorY}
                    index={i}
                    total={particleCount}
                    isPointer={isPointer}
                />
            ))}

            {/* Main Interactive Orb (3D Sphere Look) */}
            <motion.div
                className="absolute w-10 h-10 rounded-full border border-primary/50 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                    scale: isPointer ? 1.5 : 1,
                    background: isPointer ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    backdropFilter: isPointer ? 'blur(4px)' : 'none',
                    borderColor: isPointer ? 'rgba(99, 102, 241, 0.8)' : 'rgba(99, 102, 241, 0.3)',
                }}
            >
                {/* Inner Core (Highly responsive) */}
                <motion.div
                    className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff]"
                    animate={{
                        scale: isPointer ? 0.3 : 1
                    }}
                />
            </motion.div>
        </div>
    );
};

const TrailingParticle = ({ x, y, index, total, isPointer }) => {
    // Each dot gets more "lazy" as it gets further from the head
    const damping = 15 + (index * 4);
    const stiffness = 200 - (index * 15);

    const dotX = useSpring(x, { damping, stiffness });
    const dotY = useSpring(y, { damping, stiffness });

    // Calculate 3D effects based on index
    const opacity = (1 - index / total) * 0.5;
    const scale = (1 - index / total);
    const size = 12 - (index * 0.8);

    return (
        <motion.div
            className="absolute rounded-full"
            style={{
                x: dotX,
                y: dotY,
                width: size,
                height: size,
                translateX: '-50%',
                translateY: '-50%',
                opacity: isPointer ? opacity * 2 : opacity,
                scale: scale,
                // Gradient depth effect: Head is bright, tail fades to purple
                background: `rgba(${99 + index * 5}, ${102 - index * 2}, ${241}, ${opacity})`,
                boxShadow: index < 3 ? `0 0 ${15 - index * 3}px rgba(99, 102, 241, 0.4)` : 'none',
                // This creates the "3D whip" effect
                zIndex: total - index
            }}
        />
    );
};

export default CustomCursor;
