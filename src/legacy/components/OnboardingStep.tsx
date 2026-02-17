import { ReactNode } from 'react';
import { Button } from './Button';
import { theme } from '../shared/theme';

export interface OnboardingStepProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  illustration?: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  isLastStep?: boolean;
}

export function OnboardingStep({
  step,
  totalSteps,
  title,
  description,
  illustration,
  onNext,
  onBack,
  onSkip,
  nextLabel = 'Next',
  isLastStep = false
}: OnboardingStepProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020410] to-[#0a0e1a] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-2xl w-full">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Step {step} / {totalSteps}
            </span>
            {onSkip && (
              <button
                onClick={onSkip}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Skip →
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className="h-1 rounded-full flex-1 transition-all"
                style={{
                  backgroundColor: i < step ? theme.colors.info : 'rgba(255,255,255,0.1)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Card */}
        <div
          className="p-8 sm:p-12 rounded-2xl"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Illustration */}
          {illustration && (
            <div className="mb-8 flex justify-center">
              {illustration}
            </div>
          )}

          {/* Content */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {title}
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {onBack && step > 1 && (
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex-1"
              >
                ← Back
              </Button>
            )}
            <Button
              variant="primary"
              onClick={onNext}
              className="flex-1"
              style={{
                backgroundColor: isLastStep ? theme.colors.success : theme.colors.info
              }}
            >
              {isLastStep ? 'Get Started' : nextLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
