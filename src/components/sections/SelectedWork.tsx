'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// =============================================================================
// TYPES
// =============================================================================

export interface Project {
  id: string;
  title: string;
  category: string;
  client?: string;
  image: string;
  href: string;
}

interface SelectedWorkProps {
  heading?: string;
  categories?: string[];
  projects: Project[];
  className?: string;
}

// =============================================================================
// PROJECT CARD
// =============================================================================

function ProjectCard({
  project,
  index,
  isWide,
}: {
  project: Project;
  index: number;
  isWide?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(isWide && 'lg:col-span-2')}
    >
      <Link href={project.href} className="group block">
        {/* Image Container — fixed height, all cards share the same row height */}
        <div className="relative h-[420px] md:h-[520px] lg:h-[600px] overflow-hidden bg-neutral-300 dark:bg-neutral-800" data-cursor-text="View">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes={
              isWide
                ? '(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw'
                : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
            }
            className={cn(
              'object-cover',
              'transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
              'group-hover:scale-[1.03]'
            )}
          />
          {/* Subtle overlay on hover */}
          <div
            className={cn(
              'absolute inset-0',
              'bg-black/0 group-hover:bg-black/10',
              'transition-colors duration-500'
            )}
          />
        </div>

        {/* Project Info */}
        <div className="pt-4 pb-1">
          <h3 className="text-sm font-medium text-[var(--color-foreground)] leading-snug">
            {project.title}
          </h3>
          <p className="text-sm text-[var(--color-foreground-muted)] mt-0.5">
            {project.client || project.category}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

// =============================================================================
// SELECTED WORK SECTION
// =============================================================================

export default function SelectedWork({
  heading = 'All Projects',
  categories = [],
  projects,
  className,
}: SelectedWorkProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const filteredProjects = activeCategory
    ? projects.filter((p) => p.category === activeCategory)
    : projects;

  return (
    <section
      ref={sectionRef}
      className={cn('section-padding', className)}
    >
      <div className="container-premium">
        {/* Header Row: Title + Category Filters */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-12 mb-10 md:mb-14">
          {/* Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2rem,4vw,3rem)] tracking-tight leading-tight text-[var(--color-foreground)]"
          >
            {heading}
          </motion.h2>

          {/* Category Filters — small, subtle, arranged in a grid */}
          {categories.length > 0 && (
            <motion.nav
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-1.5 lg:max-w-[55%]"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setActiveCategory(activeCategory === cat ? null : cat)
                  }
                  className={cn(
                    'text-[13px] text-left transition-colors duration-200',
                    activeCategory === cat
                      ? 'text-[var(--color-foreground)]'
                      : 'text-[var(--color-foreground-faint)] hover:text-[var(--color-foreground-muted)]'
                  )}
                >
                  {cat}
                </button>
              ))}
            </motion.nav>
          )}
        </div>

        {/* Projects Grid — 4-col, alternating rows:
            Row 0: [1col] [1col] [2col]
            Row 1: [2col] [1col] [1col]
            Row 2: [1col] [1col] [2col]  …and so on */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-1.5 gap-y-10 md:gap-y-14">
          {filteredProjects.map((project, i) => {
            const row = Math.floor(i / 3);
            const posInRow = i % 3;
            const isEvenRow = row % 2 === 0;
            // Even rows: 3rd card wide. Odd rows: 1st card wide.
            const isWide = isEvenRow ? posInRow === 2 : posInRow === 0;
            return (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                isWide={isWide}
              />
            );
          })}
        </div>

        {/* Bottom Divider */}
        <div className="mt-14 md:mt-20 border-t border-[var(--color-border)]" />
      </div>
    </section>
  );
}
