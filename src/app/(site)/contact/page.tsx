'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import PageHero from '@/components/sections/PageHero';

// =============================================================================
// CONTACT PAGE
// =============================================================================

export default function ContactPage() {
  const contentRef = useRef<HTMLElement>(null);
  const contentInView = useInView(contentRef, { once: true, margin: '-100px' });

  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="Contact"
        title="Reach Out"
        description="We welcome your questions and inquiries. Whether you are exploring the programs, seeking clarity on the path, or simply feel called to connect — we are here."
      />

      {/* 2. Two-Column Layout */}
      <section ref={contentRef} className="section-padding">
        <div className="container-premium">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
            {/* Left: Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-serif text-2xl tracking-tight mb-6">
                Get in Touch
              </h2>

              <div className="space-y-8">
                {/* WhatsApp */}
                <div>
                  <p className="label-sacred mb-2">WhatsApp</p>
                  <a
                    href="https://wa.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center gap-2 text-[var(--color-foreground)]',
                      'underline underline-offset-4 decoration-[var(--color-rose-clay)]',
                      'hover:text-[var(--color-rose-clay)] transition-colors duration-200'
                    )}
                  >
                    Message Dara on WhatsApp
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>

                {/* Email */}
                <div>
                  <p className="label-sacred mb-2">Email</p>
                  <a
                    href="mailto:hello@rosesos.org"
                    className={cn(
                      'text-[var(--color-foreground)]',
                      'underline underline-offset-4 decoration-[var(--color-rose-clay)]',
                      'hover:text-[var(--color-rose-clay)] transition-colors duration-200'
                    )}
                  >
                    hello@rosesos.org
                  </a>
                </div>

                {/* Response Times */}
                <div>
                  <p className="label-sacred mb-2">Response Times</p>
                  <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed max-w-sm">
                    We aim to respond to all inquiries within 24-48 hours. For
                    enrollment questions, Dara is your primary point of contact
                    and is available via WhatsApp for the quickest response.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <h2 className="font-serif text-2xl tracking-tight mb-6">
                Send a Message
              </h2>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-5"
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="label-sacred block mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    className={cn(
                      'w-full rounded-lg border border-[var(--color-border)]',
                      'bg-[var(--color-background-subtle)]',
                      'px-4 py-3 text-sm text-[var(--color-foreground)]',
                      'placeholder:text-[var(--color-foreground-faint)]',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-clay)] focus:border-transparent',
                      'transition-all duration-200'
                    )}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="label-sacred block mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="you@example.com"
                    className={cn(
                      'w-full rounded-lg border border-[var(--color-border)]',
                      'bg-[var(--color-background-subtle)]',
                      'px-4 py-3 text-sm text-[var(--color-foreground)]',
                      'placeholder:text-[var(--color-foreground-faint)]',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-clay)] focus:border-transparent',
                      'transition-all duration-200'
                    )}
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="label-sacred block mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    placeholder="How can we support you?"
                    className={cn(
                      'w-full rounded-lg border border-[var(--color-border)]',
                      'bg-[var(--color-background-subtle)]',
                      'px-4 py-3 text-sm text-[var(--color-foreground)]',
                      'placeholder:text-[var(--color-foreground-faint)]',
                      'focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-clay)] focus:border-transparent',
                      'transition-all duration-200',
                      'resize-y'
                    )}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className={cn(
                    'w-full sm:w-auto px-8 py-3.5 rounded-full',
                    'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
                    'text-sm font-medium',
                    'hover:bg-[var(--color-accent-hover)]',
                    'transition-all duration-200',
                    'shadow-sm hover:shadow-md'
                  )}
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
