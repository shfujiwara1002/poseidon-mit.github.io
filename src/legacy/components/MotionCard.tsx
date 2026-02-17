import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { useReducedMotionSafe } from '../hooks/useReducedMotionSafe';

export interface MotionCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  delay?: number;
  animationType?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'none';
}

const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 }
  },
  slideDown: {
    initial: { opacity: 0, y: -6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 6 }
  },
  slideLeft: {
    initial: { opacity: 0, x: 6 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -6 }
  },
  slideRight: {
    initial: { opacity: 0, x: -6 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 6 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }
  },
  none: {
    initial: {},
    animate: {},
    exit: {}
  }
};

export function MotionCard({
  children,
  delay = 0,
  animationType = 'fadeIn',
  ...motionProps
}: MotionCardProps) {
  const reducedMotion = useReducedMotionSafe();
  const animation = animations[animationType];

  return (
    <motion.div
      initial={reducedMotion ? undefined : animation.initial}
      animate={reducedMotion ? undefined : animation.animate}
      exit={reducedMotion ? undefined : animation.exit}
      transition={{
        duration: reducedMotion ? 0 : 0.16,
        delay,
        ease: [0.2, 0.8, 0.2, 1]
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
