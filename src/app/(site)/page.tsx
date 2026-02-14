'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import HeroSphere from '@/components/three/HeroSphere';
import { cn } from '@/lib/utils';
import { brandQuotes, messagingPillars } from '@/lib/data';

// =============================================================================
// SCROLL INDICATOR
// =============================================================================

function ScrollIndicator({ ready }: { ready: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ delay: 2, duration: 0.6 }}
      className="flex flex-col items-center gap-2"
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-foreground-faint)]">
        Scroll
      </span>
      <motion.div className="w-[1px] h-8 bg-rose-300/40 relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full bg-rose-500"
          animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}

// =============================================================================
// ANIMATED COUNTER
// =============================================================================

function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <p className="font-serif text-[clamp(2rem,4vw,3.5rem)] tracking-tight text-rose-500">
        {value}
      </p>
      <p className="text-sm text-white/60 mt-1 tracking-wide uppercase">
        {label}
      </p>
    </motion.div>
  );
}

// =============================================================================
// SECTION: Two Core Questions
// =============================================================================

function CoreQuestions() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const questions = [
    'Are you aware of your inner state at this moment?',
    'Do you feel coherent inside? If not, how can you restore it?',
  ];

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Soft radial rose glow behind */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-400/[0.06] dark:bg-rose-400/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="container-premium max-w-3xl mx-auto text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="label-sacred mb-10 text-rose-500/80"
        >
          Two Questions That Change Everything
        </motion.p>

        <div className="space-y-8">
          {questions.map((q, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif italic text-[clamp(1.25rem,2.5vw,1.75rem)] leading-relaxed text-[var(--color-foreground)]"
            >
              {q}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 mx-auto w-24 h-[1px] bg-gradient-to-r from-transparent via-rose-400/60 to-transparent"
        />
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: Brand Essence
// =============================================================================

function BrandEssence() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-[var(--color-section-dark)] text-white overflow-hidden">
      {/* Rose-gold gradient orb */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#9E956B]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-premium max-w-4xl mx-auto text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-rose-400/70 mb-6"
        >
          What We Believe
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[clamp(1.75rem,4vw,3rem)] leading-tight mb-8"
        >
          What if the intelligence you seek is already within you,{' '}
          <span className="text-rose-400">waiting to be remembered?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto"
        >
          ROSES OS is a living ecosystem of practices, teachings, and community —
          designed to help you remember what you already know and live from that
          place. Not a course. Not a cure. A way home.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          <AnimatedStat value="30+" label="Years" delay={0.5} />
          <AnimatedStat value="6,000+" label="Practitioners" delay={0.6} />
          <AnimatedStat value="50+" label="Countries" delay={0.7} />
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: Three Pillars
// =============================================================================

const pillarIcons = [
  // Rose icon
  <svg key="rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 7c-1.5 2-3 3.5-3 5.5a3 3 0 0 0 6 0c0-2-1.5-3.5-3-5.5z" />
  </svg>,
  // Eye/Aura icon
  <svg key="aura" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>,
  // Heart/Journey icon
  <svg key="heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>,
];

function ThreePillars() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 lg:py-32">
      <div className="container-premium">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="label-sacred text-center mb-4"
        >
          Three Pillars
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-[clamp(1.5rem,3vw,2.25rem)] text-center mb-16 max-w-2xl mx-auto"
        >
          What this journey awakens
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {messagingPillars.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'group relative rounded-2xl p-8 text-center',
                'bg-gradient-to-b from-rose-50/80 to-[var(--color-background)]',
                'dark:from-rose-950/30 dark:to-[var(--color-background)]',
                'border border-rose-200/50 dark:border-rose-800/20',
                'hover:border-rose-300 dark:hover:border-rose-700/40',
                'hover:shadow-lg hover:shadow-rose-500/5',
                'transition-all duration-500'
              )}
            >
              {/* Icon */}
              <div className="mx-auto mb-5 w-14 h-14 rounded-xl bg-rose-500/10 dark:bg-rose-400/10 flex items-center justify-center text-rose-500 dark:text-rose-400 group-hover:scale-110 transition-transform duration-500">
                {pillarIcons[i]}
              </div>
              <h3 className="font-serif text-xl mb-3 text-[var(--color-foreground)]">
                {pillar.title}
              </h3>
              <p className="text-[var(--color-foreground-muted)] leading-relaxed text-sm">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: Quote
// =============================================================================

function QuoteSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
    >
      {/* Rose gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-[#9C6F6E] to-rose-800" />
      <div className="texture-linen" />

      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-40 h-40 border border-white/10 rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-60 h-60 border border-white/5 rounded-full pointer-events-none" />

      <div className="container-premium py-24 lg:py-32 relative z-10">
        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 0.2, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="block font-serif text-[8rem] leading-none text-white select-none -mb-16"
            aria-hidden="true"
          >
            &ldquo;
          </motion.span>
          <p className="font-serif italic text-[clamp(1.5rem,3.5vw,2.5rem)] leading-relaxed text-white">
            {brandQuotes[0].text}
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 mx-auto w-16 h-[2px] bg-white/30 rounded-full"
          />
        </motion.blockquote>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: Who It's For
// =============================================================================

function WhoItsFor() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const traits = ['Seekers', 'Healers', 'Teachers', 'Leaders', 'Creators'];

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container-premium max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex justify-center pointer-events-none"
        >
          <Image
            src="/page-images/page-home.png"
            alt=""
            width={384}
            height={384}
            className="max-w-xs md:max-w-sm w-full h-auto"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="label-sacred mb-6 text-rose-500/70"
        >
          Who This Is For
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] leading-tight mb-8"
        >
          For those who sense there is more
        </motion.h2>

        {/* Trait pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {traits.map((trait, i) => (
            <motion.span
              key={trait}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium',
                'bg-rose-50 dark:bg-rose-950/40',
                'text-rose-600 dark:text-rose-400',
                'border border-rose-200 dark:border-rose-800/40'
              )}
            >
              {trait}
            </motion.span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-[var(--color-foreground-muted)] leading-relaxed"
        >
          You may be someone who knows that the life you are living is not yet
          the life you came here to live. If something in these words resonates,
          the way is open.
        </motion.p>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: Invitation CTA
// =============================================================================

function InvitationCTA() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
    >
      {/* Dark rose gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-section-dark)] via-rose-950 to-[var(--color-section-dark)]" />

      {/* Subtle glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-premium py-24 lg:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-8 w-16 h-16 rounded-full border border-rose-500/30 flex items-center justify-center overflow-hidden bg-[var(--color-section-dark)]/80"
          >
            <Image
              src="/rose.png"
              alt="Roses OS"
              width={64}
              height={64}
              className="w-10 h-10 object-contain"
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(2rem,5vw,3.5rem)] tracking-tight leading-tight text-white"
          >
            The way is open.
            <br />
            <span className="text-rose-400">Welcome home.</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            <Link
              href="/invitation"
              className={cn(
                'group px-8 py-3.5 rounded-full',
                'bg-rose-500 text-white',
                'text-sm font-medium',
                'hover:bg-rose-400',
                'transition-all duration-300',
                'shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40',
                'inline-flex items-center gap-2'
              )}
            >
              Enter the Rose Field
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// HOME PAGE
// =============================================================================

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  // Preloader coordination
  const [ready, setReady] = useState(false);
  const fromPreloader = useRef(true);

  useEffect(() => {
    if (sessionStorage.getItem('roses-preloader')) {
      fromPreloader.current = false;
      setReady(true);
      return;
    }
    const handler = () => setReady(true);
    window.addEventListener('preloader:done', handler);
    return () => window.removeEventListener('preloader:done', handler);
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    if (!ready || !titleRef.current) return;

    const ctx = gsap.context(() => {
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
        delay: fromPreloader.current ? 0.2 : 0.5,
      });
    });

    return () => ctx.revert();
  }, [ready]);

  return (
    <>
      {/* HERO SECTION */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-[100svh] min-h-screen flex flex-col overflow-hidden"
      >
        {/* Warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 via-transparent to-transparent dark:from-rose-950/20 dark:via-transparent pointer-events-none" />

        {/* Background noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />

        {/* Hero Content — sits at top, clears navbar */}
        <div className="relative z-10 container-premium flex flex-col items-center text-center pt-36 sm:pt-40 lg:pt-44">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-rose-500/80 dark:text-rose-400/70 mb-6 lg:mb-8"
          >
            A Living Ecosystem for Remembering Who You Are
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mb-5 lg:mb-6"
          >
            <Image
              src="/rose.png"
              alt="ROSES OS"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </motion.div>

          <h1
            ref={titleRef}
            className="font-serif text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.05] tracking-tighter text-balance max-w-5xl"
          >
            <span className="hero-word inline-block mr-[0.25em]">A</span>
            <span className="hero-word inline-block mr-[0.25em]">Seamless</span>
            <span className="hero-word inline-block mr-[0.25em]">Path</span>
            <span className="hero-word inline-block mr-[0.25em]">to</span>
            <br className="hidden sm:block" />
            <span className="hero-word inline-block mr-[0.25em] text-rose-600 dark:text-rose-400">Inner</span>
            <span className="hero-word inline-block text-rose-600 dark:text-rose-400">Freedom</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-6 lg:mt-8 text-lg sm:text-xl text-[var(--color-foreground-muted)] max-w-xl leading-relaxed"
          >
            Technologies of remembrance for those
            <br />
            ready to live in coherence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-8 lg:mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/invitation"
              className={cn(
                'group px-8 py-3.5 rounded-full',
                'bg-rose-500 text-white',
                'text-sm font-medium',
                'hover:bg-rose-400',
                'transition-all duration-300',
                'shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40',
                'inline-flex items-center gap-2'
              )}
            >
              Begin Your Journey
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
              href="/the-rose"
              className={cn(
                'px-8 py-3.5 rounded-full',
                'text-sm font-medium',
                'text-[var(--color-foreground)]',
                'border-2 border-rose-300 dark:border-rose-700',
                'hover:bg-rose-50 dark:hover:bg-rose-950/30',
                'hover:border-rose-400 dark:hover:border-rose-600',
                'transition-all duration-300'
              )}
            >
              Explore The Rose
            </Link>
          </motion.div>
        </div>

        {/* 3D Rose Model — pulled up to sit close to text */}
        <div className="relative w-full h-[38vh] sm:h-[42vh] md:h-[55vh] lg:h-[65vh] xl:h-[70vh] -mt-10 sm:-mt-14 md:-mt-16 lg:-mt-20 pointer-events-none">
          <HeroSphere />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ScrollIndicator ready={ready} />
        </div>
      </motion.section>

      {/* CONTENT SECTIONS */}
      <CoreQuestions />
      <BrandEssence />
      <ThreePillars />
      <QuoteSection />
      <WhoItsFor />
      <InvitationCTA />
    </>
  );
}
