import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useReducedMotionSafe } from '../hooks/useReducedMotionSafe';

export interface MotionListProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function MotionList({ children, staggerDelay = 0.04, className }: MotionListProps) {
  const reducedMotion = useReducedMotionSafe();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.03,
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export interface MotionListItemProps {
  children: ReactNode;
  className?: string;
}

export function MotionListItem({ children, className }: MotionListItemProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.18,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
