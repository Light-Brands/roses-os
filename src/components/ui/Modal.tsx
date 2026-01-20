'use client';

import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/utils';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  overlayClassName?: string;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]',
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
};

const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className,
  overlayClassName,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const reducedMotion = prefersReducedMotion();

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) {
      onClose();
    }
  };

  // Focus management and scroll lock
  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus the modal content
      setTimeout(() => {
        contentRef.current?.focus();
      }, 0);

      // Lock scroll
      document.body.style.overflow = 'hidden';

      // Add keydown listener
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      // Restore scroll
      document.body.style.overflow = '';

      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }

      // Remove keydown listener
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Use portal to render modal at document root
  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
          onClick={handleOverlayClick}
          variants={reducedMotion ? reducedMotionVariants : overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn(
            'fixed inset-0 z-modal',
            'flex items-center justify-center',
            'p-4',
            'bg-black/50 backdrop-blur-sm',
            overlayClassName
          )}
        >
          <motion.div
            ref={contentRef}
            tabIndex={-1}
            variants={reducedMotion ? reducedMotionVariants : contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            className={cn(
              'relative w-full',
              'bg-white dark:bg-neutral-900',
              'rounded-2xl shadow-2xl',
              'overflow-hidden',
              'focus:outline-none',
              sizeStyles[size],
              className
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div
                className={cn(
                  'flex items-start justify-between',
                  'p-6 pb-0',
                  !title && 'justify-end'
                )}
              >
                {title && (
                  <div className="pr-8">
                    <h2
                      id="modal-title"
                      className="text-xl font-semibold text-neutral-900 dark:text-white"
                    >
                      {title}
                    </h2>
                    {description && (
                      <p
                        id="modal-description"
                        className="mt-1 text-sm text-neutral-500 dark:text-neutral-400"
                      >
                        {description}
                      </p>
                    )}
                  </div>
                )}

                {showCloseButton && (
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'p-2 -m-2',
                      'rounded-lg',
                      'text-neutral-400 hover:text-neutral-600',
                      'dark:text-neutral-500 dark:hover:text-neutral-300',
                      'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                      'transition-colors duration-150',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500'
                    )}
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Modal Footer helper component
interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3',
        'pt-4 mt-2',
        'border-t border-neutral-200 dark:border-neutral-800',
        className
      )}
    >
      {children}
    </div>
  );
}

export default Modal;
