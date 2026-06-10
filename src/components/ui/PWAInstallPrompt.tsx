'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share } from 'lucide-react';
import { cn } from '@/lib/utils';

const PWA_DISMISS_KEY = 'pwa-install-dismissed';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (navigator as unknown as Record<string, unknown>).standalone === true)
  );
}

function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 0 && window.innerWidth < 768);
}

function isIOSSafari(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isWebkit = /AppleWebKit/i.test(ua);
  const isChrome = /CriOS/i.test(ua);
  const isFirefox = /FxiOS/i.test(ua);
  // iOS Safari = iOS + WebKit but not Chrome or Firefox
  return isIOS && isWebkit && !isChrome && !isFirefox;
}

function wasDismissedRecently(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const dismissed = localStorage.getItem(PWA_DISMISS_KEY);
    if (!dismissed) return false;
    const timestamp = parseInt(dismissed, 10);
    return Date.now() - timestamp < DISMISS_DURATION_MS;
  } catch {
    return false;
  }
}

function setDismissed(): void {
  try {
    localStorage.setItem(PWA_DISMISS_KEY, Date.now().toString());
  } catch {
    // localStorage unavailable
  }
}

export function PWAInstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setDismissed();
  }, []);

  const handleInstallClick = useCallback(async () => {
    const prompt = deferredPrompt.current;
    if (!prompt) return;

    await prompt.prompt();
    const { outcome } = await prompt.userChoice;

    if (outcome === 'accepted') {
      deferredPrompt.current = null;
      setVisible(false);
    } else {
      handleDismiss();
    }
  }, [handleDismiss]);

  useEffect(() => {
    if (isStandalone() || !isMobile() || wasDismissedRecently()) {
      return;
    }

    // Android / Chrome: listen for the native install prompt
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    // iOS Safari: no beforeinstallprompt, show manual instructions
    if (isIOSSafari()) {
      const timer = setTimeout(() => {
        setIsIOS(true);
        setVisible(true);
      }, 3000);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, []);

  // Listen for successful install
  useEffect(() => {
    const onInstalled = () => {
      deferredPrompt.current = null;
      setVisible(false);
    };

    window.addEventListener('appinstalled', onInstalled);
    return () => window.removeEventListener('appinstalled', onInstalled);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-toast',
            'safe-area-bottom'
          )}
        >
          <div
            className={cn(
              'mx-3 mb-3 sm:mx-4 sm:mb-4',
              'rounded-2xl',
              'bg-neutral-900 dark:bg-white',
              'shadow-2xl',
              'border border-neutral-800 dark:border-neutral-200',
              'overflow-hidden'
            )}
          >
            <div className="flex items-center gap-3 p-4 sm:p-5">
              {/* Icon */}
              <div
                className={cn(
                  'flex-shrink-0',
                  'w-11 h-11 rounded-xl',
                  'bg-white/10 dark:bg-neutral-900/10',
                  'flex items-center justify-center'
                )}
              >
                {isIOS ? (
                  <Share className="w-5 h-5 text-white dark:text-neutral-900" />
                ) : (
                  <Download className="w-5 h-5 text-white dark:text-neutral-900" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white dark:text-neutral-900 text-[15px] leading-tight">
                  Add International Aura and Dream School to Home Screen
                </p>
                <p className="mt-0.5 text-sm text-neutral-300 dark:text-neutral-600 leading-snug">
                  {isIOS
                    ? 'Tap Share, then "Add to Home Screen"'
                    : 'Install for the full experience'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {!isIOS && (
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className={cn(
                      'px-5 py-2.5',
                      'bg-white dark:bg-neutral-900',
                      'text-neutral-900 dark:text-white',
                      'text-sm font-semibold',
                      'rounded-xl',
                      'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                      'active:scale-95',
                      'transition-all duration-150'
                    )}
                  >
                    Install
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDismiss}
                  className={cn(
                    'p-2 rounded-xl',
                    'text-neutral-400 dark:text-neutral-500',
                    'hover:text-white dark:hover:text-neutral-900',
                    'hover:bg-white/10 dark:hover:bg-neutral-900/10',
                    'active:scale-90',
                    'transition-all duration-150'
                  )}
                  aria-label="Dismiss"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
