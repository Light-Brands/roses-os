'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormStepperProps {
  currentStep: number;
  steps: string[];
  className?: string;
}

export function FormStepper({ currentStep, steps, className }: FormStepperProps) {
  return (
    <nav
      aria-label="Enrollment progress"
      className={cn('w-full', className)}
    >
      <ol className="flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <li
              key={label}
              className="flex flex-1 items-center"
            >
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isCompleted || isActive
                      ? 'var(--color-rose-500, #9C6F6E)'
                      : 'var(--color-background-elevated, #FFFFFF)',
                    borderColor: isCompleted || isActive
                      ? 'var(--color-rose-500, #9C6F6E)'
                      : 'var(--color-border, #E8E0D8)',
                  }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className={cn(
                    'relative flex h-10 w-10 items-center justify-center rounded-full border-2',
                    'transition-shadow duration-300',
                    isActive && 'shadow-[0_0_0_4px_rgba(156,111,110,0.15)]'
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <Check
                        className="h-5 w-5 text-white"
                        strokeWidth={2.5}
                      />
                    </motion.div>
                  ) : (
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        isActive
                          ? 'text-white'
                          : 'text-[var(--color-foreground-muted)]'
                      )}
                    >
                      {stepNumber}
                    </span>
                  )}
                </motion.div>

                {/* Label */}
                <span
                  className={cn(
                    'text-xs font-medium text-center max-w-[100px] leading-tight',
                    isActive
                      ? 'text-[var(--color-foreground)]'
                      : isCompleted
                        ? 'text-[var(--color-rose-clay)]'
                        : 'text-[var(--color-foreground-faint)]'
                  )}
                >
                  {label}
                </span>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="relative mx-2 mt-[-1.5rem] h-0.5 flex-1 self-start top-[1.25rem] bg-[var(--color-border)]">
                  <motion.div
                    initial={false}
                    animate={{
                      scaleX: isCompleted ? 1 : 0,
                    }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0 origin-left bg-[var(--color-rose-500,#9C6F6E)]"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default FormStepper;
