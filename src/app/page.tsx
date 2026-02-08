'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

import { Navigation } from '@/components/ui/Navigation';
import HeroSphere from '@/components/three/HeroSphere';
import SelectedWork from '@/components/sections/SelectedWork';
import type { Project } from '@/components/sections/SelectedWork';
import ClientLogos from '@/components/sections/ClientLogos';
import Footer from '@/components/ui/Footer';
import { cn } from '@/lib/utils';

// =============================================================================
// SOCIAL ICONS
// =============================================================================

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

// =============================================================================
// SCROLL INDICATOR
// =============================================================================

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.6 }}
      className="flex flex-col items-center gap-2"
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
        Scroll
      </span>
      <motion.div
        className="w-[1px] h-8 bg-neutral-300 dark:bg-neutral-700 relative overflow-hidden"
      >
        <motion.div
          className="absolute top-0 left-0 w-full bg-neutral-600 dark:bg-neutral-400"
          animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}

// =============================================================================
// SIDE SOCIAL LINKS
// =============================================================================

function SocialSidebar() {
  const socials = [
    {
      icon: LinkedInIcon,
      href: 'https://linkedin.com',
      label: 'LinkedIn',
    },
    {
      icon: WhatsAppIcon,
      href: 'https://wa.me/',
      label: 'WhatsApp',
    },
    {
      icon: InstagramIcon,
      href: 'https://instagram.com',
      label: 'Instagram',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.6, duration: 0.6 }}
      className="absolute site-edge-left top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-5"
    >
      <div className="w-[1px] h-12 bg-neutral-400 dark:bg-neutral-600" />
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="group"
        >
          <social.icon
            className={cn(
              'w-[18px] h-[18px]',
              'text-neutral-500 dark:text-neutral-500',
              'group-hover:text-neutral-800 dark:group-hover:text-neutral-300',
              'transition-colors duration-200'
            )}
          />
        </a>
      ))}
      <div className="w-[1px] h-12 bg-neutral-400 dark:bg-neutral-600" />
    </motion.div>
  );
}

// =============================================================================
// VERTICAL TEXT
// =============================================================================

function VerticalText({
  text,
  side,
}: {
  text: string;
  side: 'left' | 'right';
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8, duration: 0.6 }}
      className={cn(
        'absolute top-1/2 -translate-y-1/2 z-20 hidden lg:block',
        side === 'right' ? 'site-edge-right' : 'site-edge-left'
      )}
    >
      <span
        className={cn(
          'text-[11px] font-medium uppercase tracking-[0.2em]',
          'text-neutral-500 dark:text-neutral-500',
          side === 'right' ? '[writing-mode:vertical-rl]' : '[writing-mode:vertical-lr] rotate-180'
        )}
      >
        {text}
      </span>
    </motion.div>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

const navItems = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// =============================================================================
// PROJECT DATA (placeholder — replace with CMS/Supabase data)
// =============================================================================

const projectCategories = [
  'Branding',
  'Art Direction',
  'Web Design',
  'Social Media',
  'Strategy',
  'Video',
  'Print',
  'Photography',
];

const projects: Project[] = [
  {
    id: '1',
    title: 'Olympus Resort',
    category: 'Branding',
    client: 'Branding',
    image: '/projects/project-1.svg',
    href: '/work/olympus-resort',
  },
  {
    id: '2',
    title: 'Kypria Digital',
    category: 'Web Design',
    client: 'Web Design',
    image: '/projects/project-2.svg',
    href: '/work/kypria-digital',
  },
  {
    id: '3',
    title: 'Amara Collection',
    category: 'Art Direction',
    client: 'Art Direction',
    image: '/projects/project-3.svg',
    href: '/work/amara-collection',
  },
  {
    id: '4',
    title: 'Limassol Marina',
    category: 'Social Media',
    client: 'Social Media',
    image: '/projects/project-4.svg',
    href: '/work/limassol-marina',
  },
  {
    id: '5',
    title: 'Paphos Estates',
    category: 'Photography',
    client: 'Photography',
    image: '/projects/project-5.svg',
    href: '/work/paphos-estates',
  },
  {
    id: '6',
    title: 'Nea Ventures',
    category: 'Strategy',
    client: 'Strategy',
    image: '/projects/project-6.svg',
    href: '/work/nea-ventures',
  },
  {
    id: '7',
    title: 'Kolossi Studio',
    category: 'Branding',
    client: 'Branding',
    image: '/projects/project-1.svg',
    href: '/work/kolossi-studio',
  },
  {
    id: '8',
    title: 'Petra & Co',
    category: 'Video',
    client: 'Video',
    image: '/projects/project-2.svg',
    href: '/work/petra-co',
  },
  {
    id: '9',
    title: 'Akamas Wild',
    category: 'Print',
    client: 'Print',
    image: '/projects/project-3.svg',
    href: '/work/akamas-wild',
  },
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  // GSAP entrance animations
  useEffect(() => {
    if (!titleRef.current) return;

    const ctx = gsap.context(() => {
      // Split title into words for staggered animation
      const title = titleRef.current;
      if (!title) return;

      const words = title.querySelectorAll('.hero-word');
      gsap.set(words, { opacity: 0, y: 60, filter: 'blur(6px)' });
      gsap.to(words, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.5,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Navigation - DC Styled */}
      <Navigation
        transparent
        items={navItems}
        cta={{ label: 'Get in Touch', href: '/contact' }}
      />

      <main>
        {/* ================================================================
            HERO SECTION
            ================================================================ */}
        <motion.section
          ref={heroRef}
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative min-h-[100svh] min-h-screen flex items-center justify-center"
        >
          {/* Side Social Links - fixed to hero only */}
          <SocialSidebar />

          {/* Vertical Text - fixed to hero only */}
          <VerticalText text="Digital Cultures — Paphos, Cyprus" side="right" />

          {/* Background - subtle noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '128px 128px',
            }}
          />

          {/* WebGL Shader Sphere - viewport-centered on both axes, 2x size when fully grown */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-[50vh] -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] sm:w-[900px] sm:h-[900px] md:w-[1200px] md:h-[1200px] lg:w-[1500px] lg:h-[1500px] xl:w-[1700px] xl:h-[1700px] max-w-[95vmin] max-h-[95vmin]">
              <HeroSphere />
            </div>
          </div>

          {/* Hero Content - centered */}
          <div className="relative z-10 container-premium flex flex-col items-center text-center">
            {/* Greeting / Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-sm sm:text-base font-medium text-neutral-900 dark:text-white tracking-wide mb-6 lg:mb-8"
            >
              Creative Agency — Paphos, Cyprus
            </motion.p>

            {/* Main Title */}
            <h1
              ref={titleRef}
              className="text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.05] tracking-tighter text-balance max-w-5xl"
            >
              <span className="hero-word inline-block mr-[0.25em]">From</span>
              <span className="hero-word inline-block mr-[0.25em]">concept</span>
              <span className="hero-word inline-block mr-[0.25em]">to</span>
              <span className="hero-word inline-block mr-[0.25em]">connection</span>
              <br className="hidden sm:block" />
              <span className="hero-word inline-block mr-[0.25em]">and</span>
              <span className="hero-word inline-block mr-[0.25em]">everything</span>
              <span className="hero-word inline-block mr-[0.25em]">in</span>
              <span className="hero-word inline-block">between</span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-8 lg:mt-10 text-lg sm:text-xl text-neutral-900 dark:text-white max-w-xl leading-relaxed"
            >
              Transforming ideas into impact
              <br />
              for brands ready to stand out.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="mt-10 lg:mt-12 flex flex-col sm:flex-row items-center gap-4"
            >
              <Link
                href="/work"
                className={cn(
                  'group px-8 py-3.5 rounded-full',
                  'bg-neutral-900 dark:bg-white',
                  'text-white dark:text-neutral-900',
                  'text-sm font-medium',
                  'hover:bg-neutral-800 dark:hover:bg-neutral-100',
                  'transition-all duration-200',
                  'shadow-sm hover:shadow-md',
                  'inline-flex items-center gap-2'
                )}
              >
                View Our Work
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href="/contact"
                className={cn(
                  'px-8 py-3.5 rounded-full',
                  'text-sm font-medium',
                  'text-neutral-900 dark:text-white',
                  'border-2 border-neutral-900 dark:border-white',
                  'hover:bg-neutral-100 dark:hover:bg-white/10',
                  'hover:border-neutral-900 dark:hover:border-white',
                  'transition-all duration-200'
                )}
              >
                Start a Project
              </Link>
            </motion.div>
          </div>

          {/* Scroll Indicator - bottom center */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <ScrollIndicator />
          </div>
        </motion.section>

        {/* ================================================================
            SELECTED WORK SECTION
            ================================================================ */}
        <SelectedWork
          heading="All Projects"
          categories={projectCategories}
          projects={projects}
        />

        {/* ================================================================
            CLIENT LOGOS SECTION
            ================================================================ */}
        <ClientLogos />
      </main>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <Footer />
    </>
  );
}
