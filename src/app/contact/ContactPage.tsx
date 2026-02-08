'use client';

import { useRef, useState, type FormEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import { Navigation } from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import PageHero from '@/components/sections/PageHero';
import { Input } from '@/components/ui/Input';
import { navItems, services } from '@/lib/data';
import { cn } from '@/lib/utils';

// =============================================================================
// CONTACT DETAILS
// =============================================================================

const contactDetails = [
  { label: 'Email', value: 'hello@digitalcultures.co', href: 'mailto:hello@digitalcultures.co' },
  { label: 'Phone', value: '+357 99 123 456', href: 'tel:+35799123456' },
  {
    label: 'Address',
    value: 'Paphos, Cyprus',
    href: undefined,
  },
];

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'WhatsApp', href: 'https://wa.me/' },
];

// =============================================================================
// CONTACT PAGE
// =============================================================================

export default function ContactPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const formInView = useInView(formRef, { once: true, margin: '-80px' });
  const sideInView = useInView(sideRef, { once: true, margin: '-80px' });

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: Connect to backend / Supabase
    console.log('Form submitted:', formState);
  }

  return (
    <>
      <Navigation
        items={navItems}
        cta={{ label: 'Get in Touch', href: '/contact' }}
      />

      <main>
        <PageHero
          eyebrow="Get in Touch"
          title="Contact"
          description="Have a project in mind? We'd love to hear about it."
          compact
        />

        <section className="pb-20 md:pb-28 lg:pb-32">
          <div className="container-premium">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-20">
              {/* Form */}
              <motion.div
                ref={formRef}
                initial={{ opacity: 0, y: 24 }}
                animate={formInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                  <Input
                    variant="ghost"
                    label="Name"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  />

                  <Input
                    variant="ghost"
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  />

                  {/* Service Select */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Service
                    </label>
                    <select
                      value={formState.service}
                      onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                      className={cn(
                        'w-full h-11 px-0 text-base',
                        'bg-transparent',
                        'border-b border-neutral-400 dark:border-neutral-700',
                        'hover:border-neutral-600 dark:hover:border-neutral-500',
                        'focus:border-[var(--color-foreground)] focus:outline-none',
                        'text-neutral-900 dark:text-white',
                        'transition-colors duration-200',
                        'appearance-none rounded-none',
                        !formState.service && 'text-neutral-400 dark:text-neutral-500'
                      )}
                    >
                      <option value="" disabled>Select a service</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message Textarea */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your project"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className={cn(
                        'w-full px-0 py-3 text-base resize-none',
                        'bg-transparent',
                        'border-b border-neutral-400 dark:border-neutral-700',
                        'hover:border-neutral-600 dark:hover:border-neutral-500',
                        'focus:border-[var(--color-foreground)] focus:outline-none',
                        'text-neutral-900 dark:text-white',
                        'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
                        'transition-colors duration-200'
                      )}
                    />
                  </div>

                  <button
                    type="submit"
                    className={cn(
                      'px-8 py-3.5 rounded-full',
                      'bg-[var(--color-accent)]',
                      'text-[var(--color-accent-foreground)]',
                      'text-sm font-medium',
                      'hover:opacity-90',
                      'transition-opacity duration-200'
                    )}
                  >
                    Send Message
                  </button>
                </form>
              </motion.div>

              {/* Contact Details (sticky sidebar) */}
              <motion.div
                ref={sideRef}
                initial={{ opacity: 0, y: 24 }}
                animate={sideInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="lg:sticky lg:top-32 lg:self-start"
              >
                {/* Contact info blocks */}
                <div className="space-y-8">
                  {contactDetails.map((detail) => (
                    <div key={detail.label}>
                      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-foreground-faint)] mb-2">
                        {detail.label}
                      </p>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-foreground-muted)] transition-colors duration-200"
                        >
                          {detail.value}
                        </a>
                      ) : (
                        <p className="text-sm text-[var(--color-foreground)]">{detail.value}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-foreground-faint)] mb-4">
                    Follow Us
                  </p>
                  <div className="flex flex-col gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
