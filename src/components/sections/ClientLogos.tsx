'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// =============================================================================
// CLIENT DATA
// =============================================================================

interface Client {
  name: string;
  year: string;
  category: string;
}

const clients: Client[] = [
  // Row 1
  { name: 'Olympus Resort', year: '2024', category: 'Branding' },
  { name: 'Kypria Digital', year: '2024', category: 'Web Design' },
  { name: 'Amara Collection', year: '2023', category: 'Art Direction' },
  { name: 'Limassol Marina', year: '2024', category: 'Social Media' },
  // Row 2
  { name: 'Paphos Estates', year: '2023', category: 'Photography' },
  { name: 'Nea Ventures', year: '2024', category: 'Strategy' },
  { name: 'Kolossi Studio', year: '2023', category: 'Branding' },
  { name: 'Petra & Co', year: '2024', category: 'Video' },
  // Row 3
  { name: 'Akamas Wild', year: '2024', category: 'Print' },
  { name: 'Troodos Craft', year: '2023', category: 'Branding' },
  { name: 'Larnaca Bay', year: '2024', category: 'Web Design' },
  { name: 'Protaras Living', year: '2024', category: 'Art Direction' },
];

// =============================================================================
// PLACEHOLDER LOGO MARKS — unique per client
// =============================================================================

function LogoMark({ index, className }: { index: number; className?: string }) {
  const marks = [
    // 0 — Concentric rings with serif text
    <svg key={0} viewBox="0 0 160 80" fill="currentColor" className={className}>
      <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="40" cy="40" r="22" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <circle cx="40" cy="40" r="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <circle cx="40" cy="40" r="6" fill="currentColor" opacity="0.8" />
      <text x="80" y="36" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" letterSpacing="0.12em">OLYMPUS</text>
      <text x="80" y="52" fontFamily="Georgia, serif" fontSize="9" fontWeight="400" letterSpacing="0.2em" opacity="0.5">RESORT</text>
    </svg>,
    // 1 — Geometric K monogram
    <svg key={1} viewBox="0 0 140 80" fill="currentColor" className={className}>
      <rect x="20" y="16" width="6" height="48" rx="1" />
      <polygon points="26,40 52,16 60,16 34,40 60,64 52,64" />
      <text x="68" y="46" fontFamily="'Helvetica Neue', sans-serif" fontSize="12" fontWeight="300" letterSpacing="0.08em">kypria</text>
    </svg>,
    // 2 — Elegant A with crossbar
    <svg key={2} viewBox="0 0 160 80" fill="currentColor" className={className}>
      <path d="M30 64L46 16h4L66 64h-6L56.5 49h-17L36 64h-6zm11.5-21h13L48 24.5 41.5 43z" />
      <text x="74" y="38" fontFamily="Georgia, serif" fontSize="9" fontWeight="400" letterSpacing="0.18em">AMARA</text>
      <text x="74" y="52" fontFamily="Georgia, serif" fontSize="7" fontWeight="400" letterSpacing="0.25em" opacity="0.4">COLLECTION</text>
    </svg>,
    // 3 — Wave/anchor mark
    <svg key={3} viewBox="0 0 160 80" fill="currentColor" className={className}>
      <path d="M16 50 Q28 20 40 50 Q52 80 64 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="36" r="3" />
      <text x="76" y="36" fontFamily="'Helvetica Neue', sans-serif" fontSize="10" fontWeight="700" letterSpacing="0.1em">LIMASSOL</text>
      <text x="76" y="50" fontFamily="'Helvetica Neue', sans-serif" fontSize="8" fontWeight="300" letterSpacing="0.15em" opacity="0.5">MARINA</text>
    </svg>,
    // 4 — Camera aperture
    <svg key={4} viewBox="0 0 140 80" fill="currentColor" className={className}>
      <circle cx="36" cy="40" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M36 18 L42 32 L36 30 L30 32 Z" opacity="0.7" />
      <path d="M36 62 L30 48 L36 50 L42 48 Z" opacity="0.7" />
      <path d="M14 40 L28 34 L30 40 L28 46 Z" opacity="0.7" />
      <path d="M58 40 L44 46 L42 40 L44 34 Z" opacity="0.7" />
      <circle cx="36" cy="40" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="68" y="37" fontFamily="Georgia, serif" fontSize="9" fontWeight="400" letterSpacing="0.12em">PAPHOS</text>
      <text x="68" y="50" fontFamily="Georgia, serif" fontSize="8" fontWeight="700" letterSpacing="0.05em">Estates</text>
    </svg>,
    // 5 — Arrow/compass
    <svg key={5} viewBox="0 0 140 80" fill="currentColor" className={className}>
      <path d="M36 14 L44 40 L36 36 L28 40 Z" />
      <path d="M36 66 L28 40 L36 44 L44 40 Z" opacity="0.4" />
      <text x="58" y="36" fontFamily="'Helvetica Neue', sans-serif" fontSize="11" fontWeight="800" letterSpacing="0.02em">NEA</text>
      <text x="58" y="50" fontFamily="'Helvetica Neue', sans-serif" fontSize="8" fontWeight="300" letterSpacing="0.15em">VENTURES</text>
    </svg>,
    // 6 — Stacked bars
    <svg key={6} viewBox="0 0 140 80" fill="currentColor" className={className}>
      <rect x="18" y="22" width="36" height="5" rx="1" />
      <rect x="22" y="32" width="28" height="5" rx="1" opacity="0.7" />
      <rect x="26" y="42" width="20" height="5" rx="1" opacity="0.4" />
      <rect x="30" y="52" width="12" height="5" rx="1" opacity="0.2" />
      <text x="66" y="36" fontFamily="'Helvetica Neue', sans-serif" fontSize="10" fontWeight="700" letterSpacing="0.06em">KOLOSSI</text>
      <text x="66" y="50" fontFamily="'Helvetica Neue', sans-serif" fontSize="8" fontWeight="300" letterSpacing="0.12em" opacity="0.6">STUDIO</text>
    </svg>,
    // 7 — Ampersand-centric
    <svg key={7} viewBox="0 0 140 80" fill="currentColor" className={className}>
      <text x="16" y="52" fontFamily="Georgia, serif" fontSize="14" fontWeight="400" letterSpacing="0.05em">Petra</text>
      <text x="60" y="56" fontFamily="Georgia, serif" fontSize="28" fontWeight="300" opacity="0.3">&amp;</text>
      <text x="84" y="52" fontFamily="Georgia, serif" fontSize="11" fontWeight="400" letterSpacing="0.08em">Co</text>
    </svg>,
    // 8 — Leaf / organic
    <svg key={8} viewBox="0 0 160 80" fill="currentColor" className={className}>
      <path d="M24 60 Q24 24 48 16 Q32 36 36 60 Z" opacity="0.8" />
      <path d="M36 60 Q40 30 56 20 Q44 38 44 60 Z" opacity="0.4" />
      <text x="64" y="36" fontFamily="'Helvetica Neue', sans-serif" fontSize="10" fontWeight="800" letterSpacing="0.04em">AKAMAS</text>
      <text x="64" y="50" fontFamily="'Helvetica Neue', sans-serif" fontSize="9" fontWeight="300" letterSpacing="0.1em">WILD</text>
    </svg>,
    // 9 — Mountain peaks
    <svg key={9} viewBox="0 0 160 80" fill="currentColor" className={className}>
      <path d="M16 60 L32 24 L48 60 Z" opacity="0.3" />
      <path d="M30 60 L46 28 L62 60 Z" opacity="0.6" />
      <text x="72" y="36" fontFamily="Georgia, serif" fontSize="9" fontWeight="400" letterSpacing="0.15em">TROODOS</text>
      <text x="72" y="50" fontFamily="Georgia, serif" fontSize="10" fontWeight="700" letterSpacing="0.04em">Craft</text>
    </svg>,
    // 10 — Horizontal lines / water
    <svg key={10} viewBox="0 0 140 80" fill="currentColor" className={className}>
      <path d="M14 30 Q24 24 34 30 Q44 36 54 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 40 Q24 34 34 40 Q44 46 54 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M14 50 Q24 44 34 50 Q44 56 54 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <text x="64" y="36" fontFamily="'Helvetica Neue', sans-serif" fontSize="9" fontWeight="700" letterSpacing="0.08em">LARNACA</text>
      <text x="64" y="50" fontFamily="'Helvetica Neue', sans-serif" fontSize="9" fontWeight="300" letterSpacing="0.12em">BAY</text>
    </svg>,
    // 11 — Sun / radial
    <svg key={11} viewBox="0 0 160 80" fill="currentColor" className={className}>
      <circle cx="36" cy="40" r="10" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 36 + Math.cos(rad) * 16;
        const y1 = 40 + Math.sin(rad) * 16;
        const x2 = 36 + Math.cos(rad) * 22;
        const y2 = 40 + Math.sin(rad) * 22;
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={angle % 90 === 0 ? 0.8 : 0.4}
          />
        );
      })}
      <text x="68" y="34" fontFamily="Georgia, serif" fontSize="8" fontWeight="400" letterSpacing="0.2em">PROTARAS</text>
      <text x="68" y="50" fontFamily="Georgia, serif" fontSize="10" fontWeight="700" letterSpacing="0.04em">Living</text>
    </svg>,
  ];

  return marks[index % marks.length];
}

// =============================================================================
// CLIENT CELL
// =============================================================================

function ClientCell({
  client,
  index,
  delay,
}: {
  client: Client;
  index: number;
  delay: number;
}) {
  const cellRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cellRef, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={cellRef}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative flex flex-col"
    >
      {/* Logo area */}
      <div className="relative flex items-center justify-center h-[140px] sm:h-[160px] md:h-[200px] lg:h-[220px] px-6 md:px-10">
        <div className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
          <LogoMark
            index={index}
            className="w-[120px] sm:w-[130px] md:w-[150px] h-auto text-neutral-800 dark:text-neutral-200 transition-colors duration-300"
          />
        </div>
      </div>

      {/* Info strip */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-t border-neutral-300/60 dark:border-neutral-700/60">
        <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.06em] text-neutral-600 dark:text-neutral-400 truncate">
          {client.name}
        </span>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <span className="text-[9px] sm:text-[10px] font-normal tracking-[0.1em] uppercase text-neutral-400 dark:text-neutral-600 hidden sm:inline">
            {client.category}
          </span>
          <span className="text-[10px] sm:text-[11px] font-light tracking-wider text-neutral-400 dark:text-neutral-600">
            {client.year}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// CLIENT LOGOS SECTION
// =============================================================================

export default function ClientLogos() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="section-padding">
      <div className="container-premium">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 md:mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-3"
            >
              Clients
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl sm:text-3xl md:text-4xl tracking-tight"
            >
              Trusted by forward-thinking brands
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs sm:text-right"
          >
            A selection of brands we&rsquo;ve had the pleasure of collaborating with.
          </motion.p>
        </div>

        {/* Logo grid — 3 rows x 4 cols with border separators */}
        <div className="border-t border-neutral-300/80 dark:border-neutral-700/60">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="grid grid-cols-2 md:grid-cols-4 border-b border-neutral-300/80 dark:border-neutral-700/60"
            >
              {clients.slice(row * 4, row * 4 + 4).map((client, colIndex) => {
                const globalIndex = row * 4 + colIndex;
                return (
                  <div
                    key={client.name}
                    className={[
                      // Vertical separators
                      colIndex > 0
                        ? 'border-l border-neutral-300/80 dark:border-neutral-700/60'
                        : '',
                      // On mobile 2-col: first two items get bottom border
                      colIndex < 2
                        ? 'max-md:border-b max-md:border-neutral-300/80 dark:max-md:border-neutral-700/60 md:border-b-0'
                        : '',
                      // On mobile 2-col: reset left border for 3rd item (starts new visual row)
                      colIndex === 2 ? 'max-md:border-l-0' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <ClientCell
                      client={client}
                      index={globalIndex}
                      delay={0.06 * globalIndex}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex items-center justify-between mt-6"
        >
          <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-400 dark:text-neutral-500">
            12 Clients &amp; Counting
          </span>
          <div className="h-[1px] flex-1 mx-6 bg-neutral-300/60 dark:bg-neutral-700/40" />
          <span className="text-[11px] font-light tracking-wider text-neutral-400 dark:text-neutral-500">
            2023 — Present
          </span>
        </motion.div>
      </div>
    </section>
  );
}
