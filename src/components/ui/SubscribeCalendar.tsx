'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SubscribeCalendarProps {
  /** Google Calendar subscribe URL (the ?cid= format) */
  googleCalendarUrl: string;
  /** The raw .ics URL for Apple/Outlook/Copy */
  icsUrl: string;
}

function getWebcalUrl(icsUrl: string) {
  return icsUrl.replace(/^https?:\/\//, 'webcal://');
}

function getOutlookUrl(icsUrl: string) {
  return `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(icsUrl)}`;
}

const calendarOptions = [
  {
    key: 'google',
    label: 'Google Calendar',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.316 5.684H24v12.632h-5.684V5.684zM5.684 24h12.632v-5.684H5.684V24zM18.316 5.684V0H5.684v5.684h12.632zM0 18.316h5.684V5.684H0v12.632zM5.684 5.684V0H2.526A2.526 2.526 0 000 2.526v3.158h5.684zM21.474 0h-3.158v5.684H24V2.526A2.526 2.526 0 0021.474 0zM5.684 24v-5.684H0v3.158A2.526 2.526 0 002.526 24h3.158zM18.316 18.316V24h3.158A2.526 2.526 0 0024 21.474v-3.158h-5.684z" />
      </svg>
    ),
    getUrl: (props: SubscribeCalendarProps) => props.googleCalendarUrl,
  },
  {
    key: 'apple',
    label: 'Apple Calendar',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
      </svg>
    ),
    getUrl: (props: SubscribeCalendarProps) => getWebcalUrl(props.icsUrl),
  },
  {
    key: 'outlook',
    label: 'Outlook',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.01V2.68q0-.46.33-.8.33-.32.8-.32h14.54q.46 0 .8.33.32.33.32.8zM7.13 18H6V7.01H1v10h5.13zM14.88 12q0-.67-.18-1.23-.18-.56-.54-.96-.35-.4-.89-.62-.53-.22-1.23-.22-.69 0-1.22.22-.53.21-.88.62-.36.4-.56.96-.18.56-.18 1.23 0 .68.18 1.24.18.56.53.97.35.41.88.63.53.22 1.24.22t1.24-.22q.52-.22.88-.63.35-.41.54-.97.17-.56.17-1.24zm9.12 7.76V6.89H7.96v.11h5.67q.46 0 .8.33.32.33.32.8v10.02h1.17V8.12h7.08z" />
      </svg>
    ),
    getUrl: (props: SubscribeCalendarProps) => getOutlookUrl(props.icsUrl),
  },
] as const;

export default function SubscribeCalendar({ googleCalendarUrl, icsUrl }: SubscribeCalendarProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(icsUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = icsUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const props: SubscribeCalendarProps = { googleCalendarUrl, icsUrl };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-2 px-5 py-2.5 rounded-full',
          'bg-[var(--color-foreground)] text-[var(--color-background)]',
          'dark:bg-white dark:text-neutral-900',
          'text-sm font-medium',
          'hover:opacity-90',
          'transition-all duration-200',
          'shadow-sm hover:shadow-md',
          'cursor-pointer'
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Subscribe to Calendar
        <svg
          className={cn('w-3 h-3 transition-transform duration-200', open && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'absolute left-0 top-full mt-2 z-50',
              'min-w-[200px] rounded-xl overflow-hidden',
              'bg-white dark:bg-neutral-900',
              'border border-neutral-200 dark:border-neutral-700',
              'shadow-lg shadow-black/10 dark:shadow-black/30'
            )}
            role="menu"
          >
            {calendarOptions.map((option) => (
              <a
                key={option.key}
                href={option.getUrl(props)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-3 px-4 py-3',
                  'text-sm text-neutral-700 dark:text-neutral-200',
                  'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                  'transition-colors duration-150'
                )}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                {option.icon}
                {option.label}
              </a>
            ))}
            <button
              onClick={handleCopyLink}
              className={cn(
                'flex items-center gap-3 px-4 py-3 w-full text-left',
                'text-sm text-neutral-700 dark:text-neutral-200',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                'transition-colors duration-150',
                'border-t border-neutral-100 dark:border-neutral-800',
                'cursor-pointer'
              )}
              role="menuitem"
            >
              {copied ? (
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              )}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
