'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FAQItem } from '@/lib/data/types';

interface FAQSectionProps {
  faqs: FAQItem[];
  className?: string;
}

export default function FAQSection({ faqs, className }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="text-center mb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-rose-500/70 mb-3">
          Frequently Asked Questions
        </p>
      </div>

      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className={cn(
              'rounded-xl border transition-colors duration-300',
              isOpen
                ? 'border-rose-300 dark:border-rose-700/40'
                : 'border-rose-200/50 dark:border-rose-800/20'
            )}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-base text-[var(--color-foreground)] pr-4">
                {faq.question}
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 shrink-0 text-rose-400 transition-transform duration-300',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
