'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'gradient';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends Omit<HTMLMotionProps<'span'>, 'children'> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  dot?: boolean;
  pulse?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: cn(
    'bg-primary-100 dark:bg-primary-900/30',
    'text-primary-700 dark:text-primary-300',
    'border border-primary-200 dark:border-primary-800'
  ),
  secondary: cn(
    'bg-neutral-100 dark:bg-neutral-800',
    'text-neutral-700 dark:text-neutral-300',
    'border border-neutral-200 dark:border-neutral-700'
  ),
  outline: cn(
    'bg-transparent',
    'text-neutral-700 dark:text-neutral-300',
    'border border-neutral-300 dark:border-neutral-600'
  ),
  success: cn(
    'bg-green-100 dark:bg-green-900/30',
    'text-green-700 dark:text-green-300',
    'border border-green-200 dark:border-green-800'
  ),
  warning: cn(
    'bg-yellow-100 dark:bg-yellow-900/30',
    'text-yellow-700 dark:text-yellow-300',
    'border border-yellow-200 dark:border-yellow-800'
  ),
  error: cn(
    'bg-red-100 dark:bg-red-900/30',
    'text-red-700 dark:text-red-300',
    'border border-red-200 dark:border-red-800'
  ),
  gradient: cn(
    'bg-gradient-to-r from-primary-500 to-secondary-500',
    'text-white',
    'border border-transparent'
  ),
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2',
};

const iconSizeStyles: Record<BadgeSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
};

const dotSizeStyles: Record<BadgeSize, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      children,
      icon,
      removable = false,
      onRemove,
      dot = false,
      pulse = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <motion.span
        ref={ref}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className={cn(
          'inline-flex items-center justify-center',
          'font-medium rounded-full',
          'whitespace-nowrap',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {/* Dot indicator */}
        {dot && (
          <span className="relative flex">
            <span
              className={cn(
                'rounded-full',
                dotSizeStyles[size],
                variant === 'gradient'
                  ? 'bg-white'
                  : variant === 'success'
                  ? 'bg-green-500'
                  : variant === 'warning'
                  ? 'bg-yellow-500'
                  : variant === 'error'
                  ? 'bg-red-500'
                  : 'bg-current'
              )}
            />
            {pulse && (
              <span
                className={cn(
                  'absolute inset-0 rounded-full animate-ping opacity-75',
                  dotSizeStyles[size],
                  variant === 'gradient'
                    ? 'bg-white'
                    : variant === 'success'
                    ? 'bg-green-500'
                    : variant === 'warning'
                    ? 'bg-yellow-500'
                    : variant === 'error'
                    ? 'bg-red-500'
                    : 'bg-current'
                )}
              />
            )}
          </span>
        )}

        {/* Icon */}
        {icon && <span className={iconSizeStyles[size]}>{icon}</span>}

        {/* Content */}
        <span>{children}</span>

        {/* Remove button */}
        {removable && (
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'ml-0.5 -mr-1',
              'rounded-full p-0.5',
              'hover:bg-black/10 dark:hover:bg-white/10',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-1'
            )}
            aria-label="Remove"
          >
            <X className={iconSizeStyles[size]} />
          </motion.button>
        )}
      </motion.span>
    );
  }
);

Badge.displayName = 'Badge';

// Notification Badge (for icons)
interface NotificationBadgeProps {
  count?: number;
  max?: number;
  show?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function NotificationBadge({
  count,
  max = 99,
  show = true,
  children,
  className,
}: NotificationBadgeProps) {
  const displayCount = count && count > max ? `${max}+` : count;

  return (
    <span className={cn('relative inline-flex', className)}>
      {children}
      {show && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className={cn(
            'absolute -top-1 -right-1',
            'flex items-center justify-center',
            'min-w-[1.25rem] h-5 px-1.5',
            'text-xs font-semibold text-white',
            'bg-red-500 rounded-full',
            'border-2 border-white dark:border-neutral-900'
          )}
        >
          {displayCount || ''}
        </motion.span>
      )}
    </span>
  );
}

export default Badge;
