import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

type AnimationVariant = 'snap' | 'fade-up' | 'glow-reveal' | 'typewriter';

const animTextCva = cva('', {
  variants: {
    variant: {
      snap: 'anim-text-snap',
      'fade-up': 'anim-text-fade-up',
      'glow-reveal': 'anim-text-glow-reveal',
      typewriter: 'anim-text-typewriter',
    },
    color: {
      cyan: 'anim-text-cyan',
      teal: 'anim-text-teal',
      violet: 'anim-text-violet',
      amber: 'anim-text-amber',
      blue: 'anim-text-blue',
      red: 'anim-text-red',
    },
  },
  defaultVariants: { variant: 'fade-up' },
});

interface AnimatedTextProps {
  variant?: AnimationVariant;
  color?: 'cyan' | 'teal' | 'violet' | 'amber' | 'blue' | 'red';
  delay?: number;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  variant = 'fade-up',
  color,
  delay = 0,
  as: Tag = 'span',
  className,
  style,
  children,
}) => {
  return (
    <Tag
      className={cn(animTextCva({ variant, color }), className)}
      style={{ animationDelay: delay ? `${delay}ms` : undefined, ...style }}
    >
      {children}
    </Tag>
  );
};
