'use client';

import { createContext, useContext, useState, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type TabsVariant = 'default' | 'pills' | 'underline' | 'bordered';
type TabsSize = 'sm' | 'md' | 'lg';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant: TabsVariant;
  size: TabsSize;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

// Tabs Root
interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  variant = 'default',
  size = 'md',
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value ?? internalValue;
  const baseId = useId();

  const setActiveTab = useCallback(
    (id: string) => {
      setInternalValue(id);
      onValueChange?.(id);
    },
    [onValueChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant, size, baseId }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// Tabs List
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

const listVariantStyles: Record<TabsVariant, string> = {
  default: cn(
    'bg-neutral-100 dark:bg-neutral-800',
    'p-1 rounded-xl'
  ),
  pills: 'gap-2',
  underline: cn(
    'border-b border-neutral-200 dark:border-neutral-800',
    'gap-0'
  ),
  bordered: cn(
    'border border-neutral-200 dark:border-neutral-800',
    'p-1 rounded-xl',
    'bg-white dark:bg-neutral-900'
  ),
};

export function TabsList({ children, className }: TabsListProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsList must be used within Tabs');

  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center',
        listVariantStyles[context.variant],
        className
      )}
    >
      {children}
    </div>
  );
}

// Tab Trigger
interface TabTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const triggerSizeStyles: Record<TabsSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const triggerVariantStyles: Record<TabsVariant, { base: string; active: string; inactive: string }> = {
  default: {
    base: 'rounded-lg',
    active: 'bg-white dark:bg-neutral-900 shadow-sm',
    inactive: 'hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50',
  },
  pills: {
    base: 'rounded-full border border-transparent',
    active: 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900',
    inactive: 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
  },
  underline: {
    base: 'border-b-2 border-transparent -mb-px',
    active: 'border-primary-500 text-primary-600 dark:text-primary-400',
    inactive: 'hover:border-neutral-300 dark:hover:border-neutral-600',
  },
  bordered: {
    base: 'rounded-lg',
    active: 'bg-neutral-100 dark:bg-neutral-800',
    inactive: 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
  },
};

export function TabTrigger({
  value,
  children,
  disabled = false,
  className,
}: TabTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabTrigger must be used within Tabs');

  const { activeTab, setActiveTab, variant, size, baseId } = context;
  const isActive = activeTab === value;
  const styles = triggerVariantStyles[variant];

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-trigger-${value}`}
      aria-controls={`${baseId}-content-${value}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn(
        'relative',
        'font-medium',
        'transition-all duration-200 ease-smooth',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        triggerSizeStyles[size],
        styles.base,
        isActive
          ? cn(styles.active, 'text-neutral-900 dark:text-white')
          : cn(styles.inactive, 'text-neutral-600 dark:text-neutral-400'),
        className
      )}
    >
      {/* Active indicator for smooth transitions */}
      {isActive && variant === 'default' && (
        <motion.span
          layoutId={`${baseId}-active-bg`}
          className="absolute inset-0 bg-white dark:bg-neutral-900 rounded-lg shadow-sm"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}

      <span className="relative z-10">{children}</span>
    </button>
  );
}

// Tab Content
interface TabContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  forceMount?: boolean;
}

export function TabContent({
  value,
  children,
  className,
  forceMount = false,
}: TabContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabContent must be used within Tabs');

  const { activeTab, baseId } = context;
  const isActive = activeTab === value;

  if (!forceMount && !isActive) return null;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={value}
          id={`${baseId}-content-${value}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-trigger-${value}`}
          tabIndex={0}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn(
            'mt-4',
            'focus:outline-none',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Tabs;
