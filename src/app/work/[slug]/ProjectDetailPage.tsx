'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Navigation } from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { cn } from '@/lib/utils';
import { navItems } from '@/lib/data';
import type { ProjectDetail } from '@/lib/data';

// =============================================================================
// SECTION COMPONENTS
// =============================================================================

function HeroImage({ project }: { project: ProjectDetail }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 1.02 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full aspect-[16/9] lg:aspect-[21/9] bg-neutral-300 dark:bg-neutral-800 overflow-hidden"
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        priority
        className="object-cover"
      />
    </motion.div>
  );
}

function MetadataBar({ project }: { project: ProjectDetail }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const items = [
    { label: 'Client', value: project.client || project.title },
    { label: 'Year', value: project.year },
    { label: 'Services', value: project.services.join(', ') },
    { label: 'Location', value: project.location },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container-premium py-10 md:py-14 border-t border-b border-[var(--color-border)]"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-foreground-faint)] mb-2">
              {item.label}
            </p>
            <p className="text-sm text-[var(--color-foreground)]">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Overview({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="container-premium section-padding"
    >
      <p className="max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed text-center text-[var(--color-foreground)]">
        {text}
      </p>
    </motion.div>
  );
}

function Gallery({ images }: { images: ProjectDetail['gallery'] }) {
  return (
    <div className="container-premium pb-10 md:pb-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
        {images.map((img, i) => {
          const ref = useRef<HTMLDivElement>(null);
          const isInView = useInView(ref, { once: true, margin: '-60px' });

          return (
            <motion.div
              key={`${img.src}-${i}`}
              ref={ref}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'relative aspect-[4/3] bg-neutral-300 dark:bg-neutral-800 overflow-hidden',
                img.wide && 'md:col-span-2'
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function NarrativeBlock({
  label,
  text,
  index,
}: {
  label: string;
  text: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-[var(--color-border)] py-10 md:py-14"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4 lg:gap-12">
        <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-[var(--color-foreground-faint)]">
          {label}
        </h3>
        <p className="text-[var(--color-foreground-muted)] leading-relaxed max-w-2xl">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

function Narrative({ project }: { project: ProjectDetail }) {
  const sections = [
    { label: 'Challenge', text: project.challenge },
    { label: 'Approach', text: project.approach },
    { label: 'Result', text: project.result },
  ];

  return (
    <section className="container-premium section-padding">
      {sections.map((s, i) => (
        <NarrativeBlock key={s.label} label={s.label} text={s.text} index={i} />
      ))}
    </section>
  );
}

function ProjectNav({
  prevProject,
  nextProject,
}: {
  prevProject: ProjectDetail;
  nextProject: ProjectDetail;
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.nav
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-[var(--color-border)]"
    >
      <div className="container-premium">
        <div className="grid grid-cols-2">
          {/* Previous */}
          <Link
            href={prevProject.href}
            className="group flex items-center gap-4 py-10 md:py-14 pr-4 border-r border-[var(--color-border)] hover:opacity-70 transition-opacity duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-foreground-faint)] group-hover:-translate-x-1 transition-transform duration-200" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-foreground-faint)] mb-1">
                Previous
              </p>
              <p className="text-sm font-medium text-[var(--color-foreground)]">
                {prevProject.title}
              </p>
            </div>
          </Link>

          {/* Next */}
          <Link
            href={nextProject.href}
            className="group flex items-center justify-end gap-4 py-10 md:py-14 pl-4 hover:opacity-70 transition-opacity duration-200"
          >
            <div className="text-right">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-foreground-faint)] mb-1">
                Next
              </p>
              <p className="text-sm font-medium text-[var(--color-foreground)]">
                {nextProject.title}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-[var(--color-foreground-faint)] group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

// =============================================================================
// PROJECT DETAIL PAGE
// =============================================================================

export default function ProjectDetailPage({
  project,
  prevProject,
  nextProject,
}: {
  project: ProjectDetail;
  prevProject: ProjectDetail;
  nextProject: ProjectDetail;
}) {
  return (
    <>
      <Navigation
        items={navItems}
        cta={{ label: 'Get in Touch', href: '/contact' }}
      />

      <main className="pt-16 lg:pt-[72px]">
        <HeroImage project={project} />
        <MetadataBar project={project} />
        <Overview text={project.overview} />
        <Gallery images={project.gallery} />
        <Narrative project={project} />
        <ProjectNav prevProject={prevProject} nextProject={nextProject} />
      </main>

      <Footer />
    </>
  );
}
