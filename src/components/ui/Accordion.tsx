'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type AccordionType = 'single' | 'multiple';
type AccordionVariant = 'default' | 'bordered' | 'separated';

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
  variant: AccordionVariant;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

// Accordion Root
interface AccordionProps {
  type?: AccordionType;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  variant?: AccordionVariant;
  children: React.ReactNode;
  className?: string;
}

export function Accordion({
  type = 'single',
  defaultValue = [],
  value,
  onValueChange,
  variant = 'default',
  children,
  className,
}: AccordionProps) {
  const normalizeValue = (v: string | string[] | undefined): string[] => {
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };

  const [internalValue, setInternalValue] = useState<string[]>(
    normalizeValue(defaultValue)
  );
  const openItems = value !== undefined ? normalizeValue(value) : internalValue;

  const toggleItem = useCallback(
    (itemValue: string) => {
      let newValue: string[];

      if (type === 'single') {
        newValue = openItems.includes(itemValue) ? [] : [itemValue];
      } else {
        newValue = openItems.includes(itemValue)
          ? openItems.filter((v) => v !== itemValue)
          : [...openItems, itemValue];
      }

      setInternalValue(newValue);
      onValueChange?.(type === 'single' ? (newValue[0] || '') : newValue);
    },
    [openItems, type, onValueChange]
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, variant }}>
      <div
        className={cn(
          variant === 'separated' && 'space-y-3',
          className
        )}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// Accordion Item
interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function AccordionItem({
  value,
  children,
  className,
  disabled = false,
}: AccordionItemProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionItem must be used within Accordion');

  const { openItems, variant } = context;
  const isOpen = openItems.includes(value);

  const variantStyles = {
    default: cn(
      'border-b border-neutral-200 dark:border-neutral-800',
      'last:border-b-0'
    ),
    bordered: cn(
      'border border-neutral-200 dark:border-neutral-800',
      'first:rounded-t-xl last:rounded-b-xl',
      '-mt-px first:mt-0'
    ),
    separated: cn(
      'border border-neutral-200 dark:border-neutral-800',
      'rounded-xl',
      'bg-white dark:bg-neutral-900'
    ),
  };

  return (
    <div
      data-state={isOpen ? 'open' : 'closed'}
      data-disabled={disabled || undefined}
      className={cn(
        'overflow-hidden',
        variantStyles[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </div>
  );
}

// Accordion Trigger
interface AccordionTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function AccordionTrigger({
  value,
  children,
  className,
}: AccordionTriggerProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used within Accordion');

  const { openItems, toggleItem } = context;
  const isOpen = openItems.includes(value);

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      aria-expanded={isOpen}
      className={cn(
        'flex w-full items-center justify-between',
        'py-4 px-4',
        'text-left font-medium',
        'text-neutral-900 dark:text-white',
        'hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
        'transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset',
        'focus-visible:ring-primary-500',
        className
      )}
    >
      <span>{children}</span>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex-shrink-0 ml-4"
      >
        <ChevronDown className="w-5 h-5 text-neutral-500" />
      </motion.span>
    </button>
  );
}

// Accordion Content
interface AccordionContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function AccordionContent({
  value,
  children,
  className,
}: AccordionContentProps) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionContent must be used within Accordion');

  const { openItems } = context;
  const isOpen = openItems.includes(value);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              'px-4 pb-4',
              'text-neutral-600 dark:text-neutral-400',
              'text-sm leading-relaxed',
              className
            )}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Accordion;
