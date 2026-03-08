import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import {
  getAllLocationSlugs,
  getLocationBySlug,
  getScheduleForLocation,
  geoFAQs,
  programs,
} from '@/lib/data';
import {
  generateMetadata as generateSEOMetadata,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  generateCourseSchema,
  JsonLd,
  siteConfig,
} from '@/lib/seo';

import PageHero from '@/components/sections/PageHero';
import ProgramCard from '@/components/sections/ProgramCard';
import LocalSchedule from '@/components/sections/LocalSchedule';
import FAQSection from '@/components/sections/FAQSection';

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  return getAllLocationSlugs().map((location) => ({ location }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

type Props = { params: Promise<{ location: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location: slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) return {};

  const isOnline = slug === 'online';
  const title = isOnline
    ? 'Online Rose Meditation & Aura Reading Courses'
    : `Rose Meditation & Aura Reading in ${location.city}`;
  const description = isOnline
    ? 'Learn Rose Meditation and Aura Reading online — live classes across multiple timezones. Join 5,000+ initiates from 50+ countries.'
    : `Join Rose Meditation and Aura Reading courses from ${location.city}. Live online classes at ${location.timezoneLabel} hours. No travel required.`;

  return generateSEOMetadata({
    title,
    description,
    keywords: [
      ...location.keywords,
      'rose meditation',
      'aura reading course',
      'energy healing',
      'consciousness',
    ],
    pathname: `/meditation/${slug}`,
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function MeditationLocationPage({ params }: Props) {
  const { location: slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) notFound();

  const isOnline = slug === 'online';
  const schedule = location.timezoneKey ? getScheduleForLocation(location) : [];

  // Get the main enrolling courses (Rose Meditation + Aura 1)
  const enrollingPrograms = programs.filter(
    (p) => p.id === '3' || p.id === '1'
  );

  const pageTitle = isOnline
    ? 'Online Rose Meditation & Aura Reading Courses'
    : `Rose Meditation & Aura Reading in ${location.city}`;

  const pageDescription = isOnline
    ? 'Live online classes across multiple timezones — join from anywhere in the world.'
    : `Live online classes at ${location.timezoneLabel} hours — join from ${location.city}.`;

  // Structured data
  const faqSchema = generateFAQSchema(
    geoFAQs.map((f) => ({ question: f.question, answer: f.answer }))
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Meditation', url: `${siteConfig.url}/meditation` },
    { name: isOnline ? 'Online' : location.city, url: `${siteConfig.url}/meditation/${slug}` },
  ]);

  const webPageSchema = generateWebPageSchema({
    title: pageTitle,
    description: location.intro,
    pathname: `/meditation/${slug}`,
  });

  const courseSchemas = enrollingPrograms.map((program) => {
    const dates = program.dates.split('–');
    const year = '2026';
    return generateCourseSchema({
      name: program.title,
      description: program.description.slice(0, 200),
      startDate: `${year}-03-17`,
      endDate: program.id === '3' ? `${year}-03-18` : `${year}-03-27`,
      price: program.id === '3' ? '222' : '888',
      url: `${siteConfig.url}/offerings`,
    });
  });

  return (
    <>
      {/* Structured Data */}
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={webPageSchema} />
      {courseSchemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}

      {/* Hero */}
      <PageHero
        eyebrow={isOnline ? 'Live Online Courses' : location.country}
        title={pageTitle}
        description={pageDescription}
      />

      {/* Intro */}
      <section className="pb-16 lg:pb-20">
        <div className="container-premium max-w-3xl mx-auto">
          <p className="text-lg text-[var(--color-foreground-muted)] leading-relaxed">
            {location.intro}
          </p>
        </div>
      </section>

      {/* Course Cards */}
      <section className="pb-16 lg:pb-20">
        <div className="container-premium max-w-4xl mx-auto">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-rose-500/70 text-center mb-8">
            Upcoming Courses
          </p>
          <div className="space-y-6">
            {enrollingPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                scheduleHref="/offerings"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Local Schedule (city pages only) */}
      {schedule.length > 0 && (
        <section className="pb-16 lg:pb-20">
          <div className="container-premium max-w-3xl mx-auto">
            <LocalSchedule
              stages={schedule}
              timezoneLabel={location.timezoneLabel}
            />
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="pb-16 lg:pb-20">
        <div className="container-premium max-w-3xl mx-auto">
          <FAQSection faqs={geoFAQs} />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-section-dark)] via-rose-950 to-[var(--color-section-dark)]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container-premium py-24 lg:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] tracking-tight leading-tight text-white">
              The way is open.
              <br />
              <span className="text-rose-400">Begin your journey.</span>
            </h2>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/invitation"
                className="group px-8 py-3.5 rounded-full bg-rose-500 text-white text-sm font-medium hover:bg-rose-400 transition-all duration-300 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 inline-flex items-center gap-2"
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
              <Link
                href="/offerings"
                className="px-8 py-3.5 rounded-full text-sm font-medium text-white border-2 border-rose-700 hover:bg-rose-950/30 hover:border-rose-600 transition-all duration-300"
              >
                View All Offerings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
