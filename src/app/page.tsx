'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Zap,
  Shield,
  Palette,
  Code2,
  Layers,
  Sparkles,
  ArrowRight,
  Star,
} from 'lucide-react';

import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { FeatureCard, PricingCard, TestimonialCard } from '@/components/ui/Card';
import { HeroCentered } from '@/components/sections/HeroCentered';
import { CTASection } from '@/components/sections/CTASection';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate features on scroll
      gsap.from('.feature-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for Core Web Vitals with 90+ Lighthouse scores out of the box.',
    },
    {
      icon: Palette,
      title: 'Premium Design',
      description: 'Apple-inspired aesthetics with carefully crafted design tokens and components.',
    },
    {
      icon: Shield,
      title: 'Type Safe',
      description: 'Full TypeScript support with strict type checking for better developer experience.',
    },
    {
      icon: Code2,
      title: 'AI-First Workflow',
      description: 'Built-in AI rules and guidelines for consistent, high-quality development.',
    },
    {
      icon: Layers,
      title: 'Component Library',
      description: 'Pre-built, animated components that follow design system principles.',
    },
    {
      icon: Sparkles,
      title: 'Dark Mode Ready',
      description: 'Seamless light and dark mode support with automatic system detection.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      description: 'Perfect for side projects',
      price: 0,
      period: '/forever',
      features: [
        'All core components',
        'Design system tokens',
        'Basic documentation',
        'Community support',
      ],
      cta: { label: 'Get Started', href: '#' },
    },
    {
      name: 'Pro',
      description: 'For professional developers',
      price: 49,
      period: '/one-time',
      features: [
        'Everything in Starter',
        'Premium components',
        'Advanced animations',
        'Priority support',
        'Lifetime updates',
      ],
      cta: { label: 'Buy Now', href: '#' },
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For teams and agencies',
      price: 199,
      period: '/one-time',
      features: [
        'Everything in Pro',
        'Multiple project license',
        'Custom component requests',
        'Dedicated support',
        'White-label option',
      ],
      cta: { label: 'Contact Sales', href: '#' },
    },
  ];

  const testimonials = [
    {
      quote: 'This boilerplate saved us weeks of development time. The design system is incredibly well thought out.',
      author: {
        name: 'Sarah Chen',
        title: 'Lead Developer at TechCorp',
      },
      rating: 5,
    },
    {
      quote: 'The AI-first approach is a game changer. Every component feels premium and consistent.',
      author: {
        name: 'Michael Torres',
        title: 'Founder at StartupX',
      },
      rating: 5,
    },
    {
      quote: 'Best boilerplate I have ever used. The attention to detail in animations and accessibility is impressive.',
      author: {
        name: 'Emily Johnson',
        title: 'Senior Engineer at DesignCo',
      },
      rating: 5,
    },
  ];

  return (
    <>
      <Navigation transparent />

      <main>
        {/* Hero Section */}
        <HeroCentered
          badge={{ text: 'v1.0 Now Available', href: '#' }}
          title="Build Premium Websites at Lightning Speed"
          titleHighlight="Lightning Speed"
          description="A production-ready Next.js boilerplate with a premium design system, AI-first workflows, and beautiful animations. Ship faster, look better."
          primaryCta={{ label: 'Get Started Free', href: '#' }}
          secondaryCta={{ label: 'View Demo', href: '#', icon: 'play' }}
          trustedBy={{
            label: 'Trusted by developers at',
            logos: [
              <span key={1} className="text-neutral-400 font-semibold">Vercel</span>,
              <span key={2} className="text-neutral-400 font-semibold">Stripe</span>,
              <span key={3} className="text-neutral-400 font-semibold">Linear</span>,
              <span key={4} className="text-neutral-400 font-semibold">Notion</span>,
            ],
          }}
        />

        {/* Features Section */}
        <section
          ref={featuresRef}
          className="section-padding bg-white dark:bg-neutral-950"
        >
          <div className="container-premium">
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block text-sm font-semibold text-primary-500 uppercase tracking-wider mb-4">
                Features
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
                Everything you need to build premium sites
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                A carefully crafted foundation that helps you build beautiful,
                performant websites without starting from scratch.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    gradient={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
          <div className="container-premium">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '10k+', label: 'Downloads' },
                { value: '90+', label: 'Lighthouse Score' },
                { value: '50+', label: 'Components' },
                { value: '4.9', label: 'Rating' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Code Preview Section */}
        <section className="section-padding bg-white dark:bg-neutral-950">
          <div className="container-premium">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <span className="inline-block text-sm font-semibold text-primary-500 uppercase tracking-wider mb-4">
                  Developer Experience
                </span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
                  Build with confidence using our design tokens
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                  Never hardcode colors or spacing again. Our design system ensures
                  consistency across your entire application with a single source of truth.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    'Semantic color variables for light/dark mode',
                    'Consistent spacing based on 4px/8px grid',
                    'Premium typography with perfect hierarchy',
                    'Pre-configured animations and transitions',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <Star className="w-3 h-3 text-primary-500" />
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button href="#" variant="primary" icon={<ArrowRight />}>
                  View Documentation
                </Button>
              </div>

              {/* Code Block */}
              <div className={cn(
                'rounded-2xl overflow-hidden',
                'bg-neutral-900 dark:bg-neutral-950',
                'border border-neutral-800',
                'shadow-2xl'
              )}>
                <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-sm text-neutral-500">tokens.ts</span>
                </div>
                <pre className="p-6 text-sm overflow-x-auto">
                  <code className="text-neutral-300">
{`export const colors = {
  primary: {
    50: '#f0f4ff',
    500: '#5a6df2',
    900: '#2d3382',
  },
  // Semantic colors
  background: 'var(--color-neutral-0)',
  foreground: 'var(--color-neutral-900)',
};

export const spacing = {
  4: '1rem',    // 16px
  6: '1.5rem',  // 24px
  8: '2rem',    // 32px
};`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="section-padding bg-neutral-50 dark:bg-neutral-900">
          <div className="container-premium">
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block text-sm font-semibold text-primary-500 uppercase tracking-wider mb-4">
                Pricing
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
                Simple, transparent pricing
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Choose the plan that works best for you. All plans include lifetime access.
              </p>
            </div>

            {/* Pricing Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <PricingCard key={index} {...plan} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section-padding bg-white dark:bg-neutral-950">
          <div className="container-premium">
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block text-sm font-semibold text-primary-500 uppercase tracking-wider mb-4">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
                Loved by developers worldwide
              </h2>
            </div>

            {/* Testimonials Grid */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection
          variant="gradient"
          eyebrow="Ready to start?"
          title="Build your next premium website today"
          description="Get started with the most complete Next.js boilerplate and ship faster than ever."
          primaryCta={{ label: 'Get Started Free', href: '#' }}
          secondaryCta={{ label: 'View Documentation', href: '#' }}
        />
      </main>

      <Footer
        newsletter={{
          title: 'Stay updated',
          description: 'Get notified about new features and updates.',
          placeholder: 'Enter your email',
          buttonText: 'Subscribe',
        }}
        bottomLinks={[
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
        ]}
      />
    </>
  );
}
