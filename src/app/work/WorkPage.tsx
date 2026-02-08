'use client';

import { Navigation } from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import PageHero from '@/components/sections/PageHero';
import ContactCTA from '@/components/sections/ContactCTA';
import SelectedWork from '@/components/sections/SelectedWork';
import { navItems, projectCategories, projects } from '@/lib/data';

export default function WorkPage() {
  return (
    <>
      <Navigation
        items={navItems}
        cta={{ label: 'Get in Touch', href: '/contact' }}
      />

      <main>
        <PageHero
          eyebrow="Portfolio"
          title="Our Work"
          description="A selection of projects across branding, web design, social media, and creative direction."
        />

        <SelectedWork
          heading="All Projects"
          categories={projectCategories}
          projects={projects}
        />

        <ContactCTA />
      </main>

      <Footer />
    </>
  );
}
