'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Navigation } from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import PageHero from '@/components/sections/PageHero';
import ContactCTA from '@/components/sections/ContactCTA';
import { navItems, services } from '@/lib/data';

function ServiceRow({ service, index }: { service: typeof services[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-[var(--color-border)] py-10 md:py-14"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr_1fr] gap-6 lg:gap-12">
        {/* Number */}
        <span className="text-[var(--color-foreground-faint)] text-sm font-medium">
          {service.number}
        </span>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl tracking-tight">
          {service.title}
        </h3>

        {/* Description + Capabilities */}
        <div>
          <p className="text-[var(--color-foreground-muted)] leading-relaxed">
            {service.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {service.capabilities.map((cap) => (
              <span
                key={cap}
                className="text-xs px-3 py-1 border border-[var(--color-border)] rounded-full text-[var(--color-foreground-muted)]"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Navigation
        items={navItems}
        cta={{ label: 'Get in Touch', href: '/contact' }}
      />

      <main>
        <PageHero
          eyebrow="What We Do"
          title="Services"
          description="Full-service creative — from strategy through execution. We work across disciplines to deliver cohesive brand experiences."
        />

        <section className="section-padding">
          <div className="container-premium">
            {services.map((service, i) => (
              <ServiceRow key={service.id} service={service} index={i} />
            ))}
          </div>
        </section>

        <ContactCTA />
      </main>

      <Footer />
    </>
  );
}
