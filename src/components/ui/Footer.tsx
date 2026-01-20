'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FooterProps {
  logo?: React.ReactNode;
  description?: string;
  columns?: FooterColumn[];
  socialLinks?: SocialLink[];
  newsletter?: {
    title: string;
    description: string;
    placeholder?: string;
    buttonText?: string;
  };
  bottomLinks?: FooterLink[];
  copyright?: string;
}

const defaultColumns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Help Center', href: '/help' },
      { label: 'Community', href: '/community' },
      { label: 'Partners', href: '/partners' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Licenses', href: '/licenses' },
    ],
  },
];

const defaultSocialLinks: SocialLink[] = [
  { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
  { icon: <Github className="w-5 h-5" />, href: '#', label: 'GitHub' },
  { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
  { icon: <Mail className="w-5 h-5" />, href: '#', label: 'Email' },
];

export function Footer({
  logo,
  description = 'Building the future of web development with premium, production-ready solutions.',
  columns = defaultColumns,
  socialLinks = defaultSocialLinks,
  newsletter,
  bottomLinks,
  copyright,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container-premium">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 lg:col-span-2">
              {/* Logo */}
              {logo || <Logo size="md" className="mb-6" />}

              {/* Description */}
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-sm">
                {description}
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'p-2 rounded-lg',
                      'text-neutral-500 hover:text-neutral-900',
                      'dark:text-neutral-400 dark:hover:text-white',
                      'hover:bg-neutral-200 dark:hover:bg-neutral-800',
                      'transition-colors duration-200'
                    )}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {columns.map((column, columnIndex) => (
              <div key={columnIndex}>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 uppercase tracking-wider">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className={cn(
                          'inline-flex items-center gap-1',
                          'text-neutral-600 dark:text-neutral-400',
                          'hover:text-neutral-900 dark:hover:text-white',
                          'transition-colors duration-200'
                        )}
                      >
                        {link.label}
                        {link.external && (
                          <ArrowUpRight className="w-3 h-3 opacity-50" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          {newsletter && (
            <div className="mt-16 pt-16 border-t border-neutral-200 dark:border-neutral-800">
              <div className="max-w-xl">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  {newsletter.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  {newsletter.description}
                </p>
                <form className="flex gap-3">
                  <input
                    type="email"
                    placeholder={newsletter.placeholder || 'Enter your email'}
                    className={cn(
                      'flex-1 px-4 py-3 rounded-xl',
                      'bg-white dark:bg-neutral-900',
                      'border border-neutral-200 dark:border-neutral-800',
                      'text-neutral-900 dark:text-white',
                      'placeholder-neutral-500',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500',
                      'transition-all duration-200'
                    )}
                  />
                  <button
                    type="submit"
                    className={cn(
                      'px-6 py-3 rounded-xl',
                      'bg-neutral-900 dark:bg-white',
                      'text-white dark:text-neutral-900',
                      'font-medium',
                      'hover:bg-neutral-800 dark:hover:bg-neutral-100',
                      'transition-colors duration-200'
                    )}
                  >
                    {newsletter.buttonText || 'Subscribe'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              {copyright || `${currentYear} Brand. All rights reserved.`}
            </p>

            {bottomLinks && (
              <div className="flex items-center gap-6">
                {bottomLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className={cn(
                      'text-sm',
                      'text-neutral-500 dark:text-neutral-500',
                      'hover:text-neutral-900 dark:hover:text-white',
                      'transition-colors duration-200'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

// Minimal Footer variant
export function FooterMinimal({
  logo,
  links,
  copyright,
}: {
  logo?: React.ReactNode;
  links?: FooterLink[];
  copyright?: string;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-neutral-200 dark:border-neutral-800">
      <div className="container-premium">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          {logo || <Logo size="sm" />}

          {/* Links */}
          {links && (
            <nav className="flex items-center gap-6">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={cn(
                    'text-sm',
                    'text-neutral-600 dark:text-neutral-400',
                    'hover:text-neutral-900 dark:hover:text-white',
                    'transition-colors duration-200'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Copyright */}
          <p className="text-sm text-neutral-500">
            {copyright || `${currentYear} Brand.`}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
