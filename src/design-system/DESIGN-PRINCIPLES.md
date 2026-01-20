# Design Principles

A comprehensive guide to creating premium, consistent user interfaces with this design system.

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Spacing System](#spacing-system)
3. [Typography Hierarchy](#typography-hierarchy)
4. [Color Usage](#color-usage)
5. [Interactive States](#interactive-states)
6. [Animation Guidelines](#animation-guidelines)
7. [Component Composition](#component-composition)
8. [Dark Mode](#dark-mode)
9. [Accessibility](#accessibility)

---

## Design Philosophy

This design system follows these core principles:

- **Clarity over decoration** - Every element serves a purpose
- **Consistency breeds trust** - Predictable patterns create confidence
- **Progressive disclosure** - Show what's needed, when it's needed
- **Performance is a feature** - Fast experiences feel premium

### Brand Aesthetic

Modern, clean, and premium - inspired by Apple, Vercel, and Linear. Key characteristics:

- Generous whitespace
- Subtle gradients and shadows
- Smooth, purposeful animations
- High contrast text for readability
- Glass morphism for depth

---

## Spacing System

Based on a 4px/8px grid for visual harmony.

### Base Unit: 4px

```
0.5 = 2px   | Micro spacing (icon gaps)
1   = 4px   | Tight spacing
2   = 8px   | Standard small gap
3   = 12px  | Component internal padding
4   = 16px  | Standard padding
6   = 24px  | Section gaps
8   = 32px  | Component margins
12  = 48px  | Section padding (mobile)
16  = 64px  | Section padding (tablet)
20  = 80px  | Section padding (desktop)
24  = 96px  | Large section gaps
```

### Usage Guidelines

| Context | Spacing |
|---------|---------|
| Icon to text | `space-2` (8px) |
| Button padding | `px-6 py-3` (24px/12px) |
| Card padding | `p-6` (24px) |
| Section padding | `py-16 lg:py-24` |
| Container padding | `px-6 lg:px-16` |
| Component gaps | `gap-4` or `gap-6` |
| Grid gaps | `gap-6 lg:gap-8` |

### Spacing Rhythm

Maintain vertical rhythm by using consistent multiples:

```jsx
// Good - consistent rhythm
<section className="py-24">
  <h2 className="mb-6">Title</h2>
  <p className="mb-12">Description</p>
  <div className="grid gap-8">...</div>
</section>

// Bad - arbitrary spacing
<section className="py-[70px]">
  <h2 className="mb-[18px]">Title</h2>
  <p className="mb-[45px]">Description</p>
</section>
```

---

## Typography Hierarchy

### Scale (Perfect Fourth ~1.333)

| Name | Size | Use Case |
|------|------|----------|
| `7xl` | 72px | Hero headlines |
| `6xl` | 60px | Page titles |
| `5xl` | 48px | Section titles (desktop) |
| `4xl` | 36px | Section titles (mobile) |
| `3xl` | 30px | Large subheadings |
| `2xl` | 24px | Card titles |
| `xl` | 20px | Subheadings |
| `lg` | 18px | Lead paragraphs |
| `base` | 16px | Body text |
| `sm` | 14px | Secondary text |
| `xs` | 12px | Captions, labels |

### Weight Guidelines

| Weight | Use Case |
|--------|----------|
| `400` (normal) | Body text, paragraphs |
| `500` (medium) | Buttons, nav links |
| `600` (semibold) | Subheadings, emphasis |
| `700` (bold) | Headlines, titles |
| `800` (extrabold) | Hero text, display |

### Letter Spacing

| Size | Tracking |
|------|----------|
| Display (5xl+) | `-0.025em` (tighter) |
| Headings (2xl-4xl) | `-0.02em` (tight) |
| Body (base-xl) | `0` (normal) |
| Small (xs-sm) | `0.01em` (wide) |

### Line Height

| Context | Line Height |
|---------|-------------|
| Display text | `1` - `1.1` |
| Headings | `1.15` - `1.25` |
| Body text | `1.6` |
| UI elements | `1.5` |

### Typography Examples

```jsx
// Hero headline
<h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-none">
  Build faster.
</h1>

// Section title
<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
  Features
</h2>

// Body text
<p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
  Description text here...
</p>

// Caption
<span className="text-xs text-neutral-500 tracking-wide uppercase">
  Label
</span>
```

---

## Color Usage

### Semantic Colors

| Variable | Light Mode | Dark Mode | Use Case |
|----------|------------|-----------|----------|
| `--color-background` | White | #0a0a0a | Page background |
| `--color-foreground` | #171717 | #fafafa | Primary text |
| `--color-muted` | #f5f5f5 | #262626 | Secondary backgrounds |
| `--color-muted-foreground` | #737373 | #a3a3a3 | Secondary text |
| `--color-border` | #e8e8e8 | #262626 | Borders, dividers |
| `--color-accent` | Primary 500 | Primary 400 | Interactive elements |

### Color Application Rules

1. **Primary colors** - CTAs, links, active states
2. **Secondary colors** - Accents, gradients, highlights
3. **Neutral colors** - Text, backgrounds, borders
4. **Status colors** - Feedback (success/warning/error/info)

### Do's and Don'ts

```jsx
// DO: Use semantic color variables
<div className="bg-background text-foreground border-border">

// DON'T: Hardcode hex values
<div className="bg-[#ffffff] text-[#171717] border-[#e8e8e8]">

// DO: Use opacity for subtle variations
<div className="bg-primary-500/10">

// DON'T: Create new color shades
<div className="bg-[#5a6df233]">
```

### Gradient Usage

| Gradient | Use Case |
|----------|----------|
| `gradient-primary` | CTAs, badges, accents |
| `gradient-secondary` | Decorative elements |
| `gradient-subtle` | Card backgrounds |
| `gradient-mesh` | Hero backgrounds |

---

## Interactive States

### Button States

| State | Visual Change |
|-------|---------------|
| Default | Base styling |
| Hover | Slightly lighter + shadow |
| Active/Pressed | Slightly darker, scale(0.98) |
| Focus | Outline ring (2px primary) |
| Disabled | 50% opacity, no interactions |
| Loading | Spinner + reduced opacity |

### State Transitions

```css
/* Standard interactive element */
.interactive {
  transition: all 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* Hover state */
.interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Active state */
.interactive:active {
  transform: scale(0.98);
}
```

### Focus States

Always use visible focus indicators for accessibility:

```jsx
// Standard focus ring
className="focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"

// Or use the utility class
className="focus-premium"
```

---

## Animation Guidelines

### Timing Functions

| Easing | Use Case |
|--------|----------|
| `ease-smooth` | General transitions |
| `ease-smooth-out` | Elements entering |
| `ease-spring` | Playful interactions |
| `ease-bounce` | Attention-grabbing |

### Duration Guidelines

| Duration | Use Case |
|----------|----------|
| `100ms` | Micro-interactions (hover color) |
| `150ms` | Button states |
| `200ms` | Standard transitions |
| `300ms` | Larger element transitions |
| `400ms` | Page transitions, modals |
| `500ms+` | Complex animations |

### Animation Principles

1. **Purposeful** - Every animation should have a reason
2. **Subtle** - Avoid jarring or excessive movement
3. **Fast** - Users shouldn't wait for animations
4. **Interruptible** - Respect user input during animation

### GSAP Animation Patterns

```jsx
// Fade up on scroll
gsap.from(element, {
  y: 40,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: element,
    start: 'top 80%',
  },
});

// Stagger children
gsap.from(children, {
  y: 30,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power2.out',
});
```

### Framer Motion Patterns

```jsx
// Standard fade up
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
};

// Stagger container
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
```

### Reduce Motion Support

Always respect user preferences:

```jsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// In Framer Motion
<motion.div
  initial={prefersReducedMotion ? false : { opacity: 0 }}
  animate={{ opacity: 1 }}
/>
```

---

## Component Composition

### Anatomy of a Premium Component

```
┌─────────────────────────────────────┐
│  Padding (p-6 or p-8)               │
│  ┌───────────────────────────────┐  │
│  │  Content Area                 │  │
│  │                               │  │
│  │  • Proper spacing hierarchy   │  │
│  │  • Consistent typography      │  │
│  │  • Semantic colors            │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│  Border Radius (rounded-xl/2xl)     │
│  Shadow (shadow-lg on hover)        │
└─────────────────────────────────────┘
```

### Card Pattern

```jsx
<div className="
  relative
  bg-background
  border border-border
  rounded-2xl
  p-6 lg:p-8
  shadow-sm
  transition-all duration-300 ease-smooth
  hover:shadow-lg hover:-translate-y-1
">
  {/* Content */}
</div>
```

### Button Variants

```jsx
// Primary (solid)
className="bg-primary-500 text-white hover:bg-primary-600 shadow-primary"

// Secondary (outline)
className="border-2 border-primary-500 text-primary-500 hover:bg-primary-50"

// Ghost (minimal)
className="text-foreground hover:bg-muted"

// Gradient (premium)
className="bg-gradient-primary text-white shadow-primary-lg"
```

### Section Pattern

```jsx
<section className="section-padding">
  <div className="container-premium">
    {/* Section header */}
    <div className="text-center max-w-3xl mx-auto mb-16">
      <span className="text-sm font-medium text-primary-500 mb-4 block">
        Label
      </span>
      <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
        Section Title
      </h2>
      <p className="text-lg text-muted-foreground">
        Section description...
      </p>
    </div>

    {/* Section content */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Cards */}
    </div>
  </div>
</section>
```

---

## Dark Mode

### Implementation

Use CSS custom properties that automatically switch:

```jsx
// Component automatically adapts
<div className="bg-background text-foreground border-border">
```

### Dark Mode Adjustments

| Element | Light | Dark |
|---------|-------|------|
| Background | White | Near-black (#0a0a0a) |
| Text | Near-black | Near-white |
| Borders | Light gray | Dark gray |
| Shadows | Subtle | More pronounced |
| Accent colors | 500 shade | 400 shade (brighter) |

### Toggle Implementation

```jsx
// Add 'dark' class to html element
document.documentElement.classList.toggle('dark');

// Or use data attribute
document.documentElement.setAttribute('data-theme', 'dark');
```

---

## Accessibility

### Requirements

- **Color contrast**: 4.5:1 for body text, 3:1 for large text
- **Focus indicators**: Visible on all interactive elements
- **Motion**: Respect `prefers-reduced-motion`
- **Touch targets**: Minimum 44x44px
- **Semantic HTML**: Use proper heading hierarchy

### Checklist

- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Links have descriptive text
- [ ] Color is not the only indicator
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Focus order is logical

---

## Quick Reference

### Common Class Combinations

```jsx
// Premium heading
"text-4xl md:text-5xl font-bold tracking-tight"

// Body text
"text-lg text-muted-foreground leading-relaxed"

// Premium button
"px-6 py-3 bg-primary-500 text-white rounded-xl font-medium
 shadow-primary hover:shadow-primary-lg hover:bg-primary-600
 transition-all duration-200"

// Glass card
"bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg
 border border-white/20 rounded-2xl shadow-glass"

// Gradient text
"bg-gradient-to-r from-primary-500 to-secondary-500
 bg-clip-text text-transparent"
```

### File Structure

```
src/
├── design-system/
│   ├── tokens.ts         # Design token definitions
│   ├── theme.css         # CSS variables
│   └── DESIGN-PRINCIPLES.md
├── components/
│   ├── ui/               # Base components
│   └── sections/         # Page sections
└── app/
    └── globals.css       # Tailwind + theme import
```
