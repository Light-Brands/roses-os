'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';

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
  const { toast, dismiss } = useToast();
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const hasShown = useRef(false);

  const handleInstallClick = useCallback(async () => {
    const prompt = deferredPrompt.current;
    if (!prompt) return;

    await prompt.prompt();
    const { outcome } = await prompt.userChoice;

    if (outcome === 'accepted') {
      deferredPrompt.current = null;
    } else {
      setDismissed();
    }
  }, []);

  useEffect(() => {
    if (isStandalone() || !isMobile() || wasDismissedRecently() || hasShown.current) {
      return;
    }

    // Android / Chrome: listen for the native install prompt
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;

      if (hasShown.current) return;
      hasShown.current = true;

      const id = toast({
        type: 'info',
        title: 'Install ROSES OS',
        description: 'Add to your home screen for the full experience.',
        duration: 0, // persistent
        action: {
          label: 'Install',
          onClick: () => {
            handleInstallClick();
            dismiss(id);
          },
        },
      });
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    // iOS Safari: no beforeinstallprompt, show manual instructions
    if (isIOSSafari()) {
      hasShown.current = true;

      // Small delay so the page settles before showing
      const timer = setTimeout(() => {
        toast({
          type: 'info',
          title: 'Install ROSES OS',
          description: 'Tap the share button, then "Add to Home Screen" to install.',
          duration: 8000,
        });
        setDismissed();
      }, 3000);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, [toast, dismiss, handleInstallClick]);

  // Listen for successful install
  useEffect(() => {
    const onInstalled = () => {
      deferredPrompt.current = null;
    };

    window.addEventListener('appinstalled', onInstalled);
    return () => window.removeEventListener('appinstalled', onInstalled);
  }, []);

  return null;
}
