'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'elevated' | 'bordered' | 'glass' | 'gradient';

interface CardProps {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
  href?: string;
  hover?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: cn(
    'bg-white dark:bg-neutral-900',
    'border border-neutral-200 dark:border-neutral-800'
  ),
  elevated: cn(
    'bg-white dark:bg-neutral-900',
    'shadow-lg'
  ),
  bordered: cn(
    'bg-transparent',
    'border-2 border-neutral-200 dark:border-neutral-800'
  ),
  glass: cn(
    'bg-white/80 dark:bg-neutral-900/80',
    'backdrop-blur-lg',
    'border border-white/20 dark:border-neutral-800/50',
    'shadow-glass'
  ),
  gradient: cn(
    'bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950',
    'border border-neutral-200 dark:border-neutral-800'
  ),
};

export function Card({
  variant = 'default',
  children,
  className,
  href,
  hover = true,
}: CardProps) {
  const baseStyles = cn(
    'rounded-2xl overflow-hidden',
    hover && 'transition-all duration-300 ease-smooth',
    hover && 'hover:shadow-xl hover:-translate-y-1',
    variantStyles[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={cn(baseStyles, 'block')}>
        {children}
      </Link>
    );
  }

  return <div className={baseStyles}>{children}</div>;
}

// Feature Card with icon
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  gradient?: boolean;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  gradient = false,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card variant={gradient ? 'gradient' : 'default'} href={href} className="p-6 lg:p-8 h-full">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center mb-6',
            gradient
              ? 'bg-gradient-to-br from-primary-500 to-secondary-500'
              : 'bg-primary-100 dark:bg-primary-900/30'
          )}
        >
          <Icon
            className={cn(
              'w-6 h-6',
              gradient ? 'text-white' : 'text-primary-600 dark:text-primary-400'
            )}
          />
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>
        {href && (
          <div className="mt-6 flex items-center gap-2 text-primary-500 font-medium">
            Learn more
            <ArrowUpRight className="w-4 h-4" />
          </div>
        )}
      </Card>
    </motion.div>
  );
}

// Interactive 3D Card with mouse tracking
interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
}

export function Interactive3DCard({ children, className }: Interactive3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={cn(
        'relative rounded-2xl',
        'bg-white dark:bg-neutral-900',
        'border border-neutral-200 dark:border-neutral-800',
        'transition-shadow duration-300',
        isHovered && 'shadow-2xl',
        className
      )}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 opacity-0 transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0 }}
      />

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.1 : 0,
          background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, white 0%, transparent 50%)`,
        }}
      />

      <div style={{ transform: 'translateZ(50px)' }}>{children}</div>
    </motion.div>
  );
}

// Pricing Card
interface PricingCardProps {
  name: string;
  description: string;
  price: string | number;
  period?: string;
  features: string[];
  cta: { label: string; href: string };
  popular?: boolean;
}

export function PricingCard({
  name,
  description,
  price,
  period = '/month',
  features,
  cta,
  popular = false,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative rounded-2xl p-8',
        popular
          ? 'bg-neutral-900 dark:bg-white border-2 border-primary-500'
          : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800'
      )}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-medium rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3
          className={cn(
            'text-xl font-semibold mb-2',
            popular ? 'text-white dark:text-neutral-900' : 'text-neutral-900 dark:text-white'
          )}
        >
          {name}
        </h3>
        <p
          className={cn(
            'text-sm',
            popular ? 'text-neutral-400 dark:text-neutral-600' : 'text-neutral-500'
          )}
        >
          {description}
        </p>
      </div>

      <div className="mb-8">
        <span
          className={cn(
            'text-5xl font-bold',
            popular ? 'text-white dark:text-neutral-900' : 'text-neutral-900 dark:text-white'
          )}
        >
          {typeof price === 'number' ? `$${price}` : price}
        </span>
        <span
          className={cn(
            'text-sm',
            popular ? 'text-neutral-400 dark:text-neutral-600' : 'text-neutral-500'
          )}
        >
          {period}
        </span>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li
            key={index}
            className={cn(
              'flex items-center gap-3 text-sm',
              popular ? 'text-neutral-300 dark:text-neutral-700' : 'text-neutral-600 dark:text-neutral-400'
            )}
          >
            <svg
              className={cn(
                'w-5 h-5 flex-shrink-0',
                popular ? 'text-primary-400' : 'text-primary-500'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={cta.href}
        className={cn(
          'block w-full py-3 text-center font-medium rounded-xl transition-all duration-200',
          popular
            ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
            : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100'
        )}
      >
        {cta.label}
      </Link>
    </motion.div>
  );
}

// Testimonial Card
interface TestimonialCardProps {
  quote: string;
  author: {
    name: string;
    title: string;
    avatar?: string;
  };
  rating?: number;
}

export function TestimonialCard({ quote, author, rating }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card variant="glass" className="p-6 lg:p-8 h-full">
        {rating && (
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={cn(
                  'w-5 h-5',
                  i < rating ? 'text-yellow-400' : 'text-neutral-300 dark:text-neutral-700'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}

        <blockquote className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
          &ldquo;{quote}&rdquo;
        </blockquote>

        <div className="flex items-center gap-4">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
              {author.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-semibold text-neutral-900 dark:text-white">
              {author.name}
            </div>
            <div className="text-sm text-neutral-500">{author.title}</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default Card;
