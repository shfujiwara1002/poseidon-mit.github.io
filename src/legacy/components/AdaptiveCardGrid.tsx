/**
 * Adaptive card grid that reorders cards based on usage behavior
 * Uses Framer Motion for smooth layout transitions
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { behaviorTracker } from '../services/behaviorTracking';
import { useIsTablet, useIsDesktop } from '../hooks/useMediaQuery';
import { theme } from '../shared/theme';
import { logger } from '../utils/logger';

interface AdaptiveCardGridProps {
  children: React.ReactNode[];
  featureIds: string[];
}

export function AdaptiveCardGrid({
  children,
  featureIds
}: AdaptiveCardGridProps) {
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  // Determine grid columns based on breakpoints
  const columns = useMemo(() => {
    if (isDesktop) return 3;
    if (isTablet) return 2;
    return 1;
  }, [isDesktop, isTablet]);

  // Reorder children based on feature usage
  const orderedChildren = useMemo(() => {
    if (children.length === 0 || featureIds.length === 0) {
      return children;
    }

    if (children.length !== featureIds.length) {
      logger.warn('AdaptiveCardGrid: children and featureIds length mismatch');
      return children;
    }

    // Get top features sorted by engagement score
    const topFeatures = behaviorTracker.getTopFeatures(children.length);
    const featureOrder: Record<string, number> = {};

    topFeatures.forEach((feature, index) => {
      featureOrder[feature.featureId] = index;
    });

    // Create array of [index, featureId] pairs
    const indexedFeatures = featureIds.map((id, idx) => ({
      originalIndex: idx,
      featureId: id,
      score: featureOrder[id] ?? children.length + idx
    }));

    // Sort by usage score (lower score = more used = appears first)
    indexedFeatures.sort((a, b) => a.score - b.score);

    // Map back to original children array
    return indexedFeatures.map(({ originalIndex }) => children[originalIndex]);
  }, [children, featureIds]);

  return (
    <LayoutGroup>
      <motion.div
        layout
        className="grid w-full"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: theme.layout.gridGap,
          width: '100%'
        }}
      >
        <AnimatePresence mode="popLayout">
          {orderedChildren.map((child, index) => (
            <motion.div
              key={featureIds[featureIds.indexOf(
                featureIds.find((_, idx) => children[idx] === child) || ''
              )] || index}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
                delay: index * 0.05
              }}
            >
              {child}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
