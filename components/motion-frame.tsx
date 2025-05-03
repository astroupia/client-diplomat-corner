    // components/MotionFrame.tsx
    import { motion,MotionProps  } from 'framer-motion';
    import React from 'react';

    interface AnimatedImageProps extends MotionProps {
    src: string;
    alt: string;
    className: string;
    initial?: MotionProps["initial"];
    animate?: MotionProps["animate"];
    transition?: MotionProps["transition"];
    }

    const AnimatedImage: React.FC<AnimatedImageProps> = ({
    src,
    alt,
    className,
    initial,
    animate,
    transition,
    }) => {
    return (
        <motion.img
        src={src}
        alt={alt}
        className={className}
        initial={initial}
        animate={animate}
        transition={transition}
        />
    );
    };

    export default AnimatedImage;  // Make sure it's exported as default
