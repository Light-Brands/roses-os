'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<HTMLMotionProps<'button'>, keyof ButtonBaseProps> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-neutral-900 dark:bg-white',
    'text-white dark:text-neutral-900',
    'hover:bg-neutral-800 dark:hover:bg-neutral-100',
    'shadow-sm hover:shadow-md',
    'border border-transparent'
  ),
  secondary: cn(
    'bg-neutral-100 dark:bg-neutral-800',
    'text-neutral-900 dark:text-white',
    'hover:bg-neutral-200 dark:hover:bg-neutral-700',
    'border border-transparent'
  ),
  outline: cn(
    'bg-transparent',
    'text-neutral-700 dark:text-neutral-300',
    'hover:bg-neutral-50 dark:hover:bg-neutral-800',
    'border-2 border-neutral-200 dark:border-neutral-700',
    'hover:border-neutral-300 dark:hover:border-neutral-600'
  ),
  ghost: cn(
    'bg-transparent',
    'text-neutral-700 dark:text-neutral-300',
    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
    'border border-transparent'
  ),
  gradient: cn(
    'bg-gradient-to-r from-primary-500 to-secondary-500',
    'text-white',
    'hover:from-primary-600 hover:to-secondary-600',
    'shadow-primary hover:shadow-primary-lg',
    'border border-transparent'
  ),
  destructive: cn(
    'bg-red-500',
    'text-white',
    'hover:bg-red-600',
    'shadow-sm hover:shadow-md',
    'border border-transparent'
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
  xl: 'px-8 py-4 text-base gap-2.5',
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-5 h-5',
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'right',
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseStyles = cn(
      'inline-flex items-center justify-center',
      'font-medium rounded-xl',
      'transition-all duration-200 ease-smooth',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      className
    );

    const iconElement = loading ? (
      <Loader2 className={cn(iconSizeStyles[size], 'animate-spin')} />
    ) : icon ? (
      <span className={iconSizeStyles[size]}>{icon}</span>
    ) : null;

    const content = (
      <>
        {iconPosition === 'left' && iconElement}
        <span>{children}</span>
        {iconPosition === 'right' && iconElement}
      </>
    );

    if ('href' in props && props.href) {
      const { href, ...linkProps } = props as ButtonAsLink;
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={baseStyles}
          {...linkProps}
        >
          {content}
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        className={baseStyles}
        disabled={isDisabled}
        {...(props as ButtonAsButton)}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
