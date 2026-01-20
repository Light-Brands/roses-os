'use client';

import { forwardRef, useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type InputVariant = 'default' | 'filled' | 'ghost';
type InputSize = 'sm' | 'md' | 'lg';
type InputState = 'default' | 'success' | 'error' | 'loading';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  inputSize?: InputSize;
  state?: InputState;
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const variantStyles: Record<InputVariant, string> = {
  default: cn(
    'bg-white dark:bg-neutral-900',
    'border border-neutral-200 dark:border-neutral-800',
    'hover:border-neutral-300 dark:hover:border-neutral-700'
  ),
  filled: cn(
    'bg-neutral-100 dark:bg-neutral-800',
    'border border-transparent',
    'hover:bg-neutral-200 dark:hover:bg-neutral-700'
  ),
  ghost: cn(
    'bg-transparent',
    'border-b border-neutral-200 dark:border-neutral-800',
    'rounded-none',
    'hover:border-neutral-400 dark:hover:border-neutral-600'
  ),
};

const sizeStyles: Record<InputSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-base',
  lg: 'h-13 px-5 text-lg',
};

const labelSizeStyles: Record<InputSize, string> = {
  sm: 'text-xs mb-1.5',
  md: 'text-sm mb-2',
  lg: 'text-base mb-2.5',
};

const iconSizeStyles: Record<InputSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const stateStyles: Record<InputState, string> = {
  default: 'focus:border-primary-500 focus:ring-primary-500/20',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
  loading: 'border-primary-500/50',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      inputSize = 'md',
      state = 'default',
      label,
      hint,
      error,
      success,
      leftIcon,
      rightIcon,
      showPasswordToggle,
      className,
      type = 'text',
      disabled,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const generatedId = useId();
    const id = providedId || generatedId;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;

    const currentState = error ? 'error' : success ? 'success' : state;
    const inputType = showPasswordToggle && type === 'password'
      ? (showPassword ? 'text' : 'password')
      : type;

    const hasRightElement = rightIcon || showPasswordToggle || currentState === 'loading' || currentState === 'success' || currentState === 'error';

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <motion.label
            htmlFor={id}
            className={cn(
              'block font-medium',
              'text-neutral-700 dark:text-neutral-300',
              labelSizeStyles[inputSize],
              disabled && 'opacity-50'
            )}
            animate={{ y: isFocused ? -2 : 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {label}
          </motion.label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2',
                'text-neutral-400 dark:text-neutral-500',
                'pointer-events-none',
                isFocused && 'text-primary-500',
                iconSizeStyles[inputSize]
              )}
            >
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={id}
            type={inputType}
            disabled={disabled || currentState === 'loading'}
            aria-invalid={currentState === 'error'}
            aria-describedby={cn(
              error && errorId,
              (hint || success) && !error && hintId
            ) || undefined}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              'w-full',
              'text-neutral-900 dark:text-white',
              'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
              'transition-all duration-200 ease-smooth',
              'focus:outline-none focus:ring-4',
              variant !== 'ghost' && 'rounded-xl',
              variantStyles[variant],
              sizeStyles[inputSize],
              stateStyles[currentState],
              leftIcon && 'pl-10',
              hasRightElement && 'pr-10',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            {...props}
          />

          {/* Right element */}
          {hasRightElement && (
            <div
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'flex items-center gap-2'
              )}
            >
              {/* Loading spinner */}
              {currentState === 'loading' && (
                <Loader2
                  className={cn(
                    'animate-spin text-primary-500',
                    iconSizeStyles[inputSize]
                  )}
                />
              )}

              {/* Success icon */}
              {currentState === 'success' && !rightIcon && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Check
                    className={cn('text-green-500', iconSizeStyles[inputSize])}
                  />
                </motion.div>
              )}

              {/* Error icon */}
              {currentState === 'error' && !rightIcon && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <AlertCircle
                    className={cn('text-red-500', iconSizeStyles[inputSize])}
                  />
                </motion.div>
              )}

              {/* Password toggle */}
              {showPasswordToggle && type === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    'text-neutral-400 hover:text-neutral-600',
                    'dark:text-neutral-500 dark:hover:text-neutral-300',
                    'transition-colors duration-150',
                    'focus:outline-none focus:text-primary-500'
                  )}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className={iconSizeStyles[inputSize]} />
                  ) : (
                    <Eye className={iconSizeStyles[inputSize]} />
                  )}
                </button>
              )}

              {/* Custom right icon */}
              {rightIcon && !showPasswordToggle && currentState === 'default' && (
                <span
                  className={cn(
                    'text-neutral-400 dark:text-neutral-500',
                    iconSizeStyles[inputSize]
                  )}
                >
                  {rightIcon}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Hint/Error/Success message */}
        <AnimatePresence mode="wait">
          {(error || hint || success) && (
            <motion.p
              key={error ? 'error' : success ? 'success' : 'hint'}
              id={error ? errorId : hintId}
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={cn(
                'mt-2 text-sm',
                error && 'text-red-500',
                success && !error && 'text-green-500',
                hint && !error && !success && 'text-neutral-500'
              )}
              role={error ? 'alert' : undefined}
            >
              {error || success || hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
