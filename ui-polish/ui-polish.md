# UI/UX Polish Guide

> Systematic approach to achieving Apple/Vercel-level UI quality through iterative refinement

## Overview

This guide provides a structured methodology for polishing UI components using AI-assisted development. The process is designed to be run iteratively (10+ passes) for maximum impact.

## Quick Reference: Polish Commands

```bash
# Single component refinement
@ui-refinement src/components/ui/Button.tsx spacing

# Full page audit
@ui-refinement src/app/page.tsx full-audit

# Specific focus areas
@ui-refinement [component] spacing    # Grid alignment, margins, padding
@ui-refinement [component] colors     # Contrast, dark mode, gradients
@ui-refinement [component] animation  # Micro-interactions, transitions
@ui-refinement [component] a11y       # Accessibility audit
```

## The 10-Pass Polish System

### Pass 1-2: Structural Foundation

**Focus**: Layout grid, spacing rhythm, visual hierarchy

**Checklist**:
- [ ] All spacing uses 4px/8px grid (no odd pixel values)
- [ ] Consistent padding: cards (p-6), sections (py-16 lg:py-24)
- [ ] Typography hierarchy flows: display → h1 → h2 → h3 → body
- [ ] Visual weight guides eye to primary actions

**Prompt Template**:
```
Review [component] for spacing consistency. Ensure all margins and
padding follow the 4px/8px grid from tokens.ts. Fix any deviations
and verify responsive spacing scales appropriately.
```

### Pass 3-4: Color & Contrast

**Focus**: Semantic colors, contrast ratios, dark mode

**Checklist**:
- [ ] Text contrast meets WCAG AA (4.5:1 body, 3:1 large text)
- [ ] Interactive elements have distinct hover states
- [ ] Dark mode inverts correctly (no pure white on black)
- [ ] Gradients use design token colors only

**Prompt Template**:
```
Audit [component] for color contrast in both light and dark modes.
Use semantic color tokens (foreground, muted, accent) instead of
neutral-[number] where appropriate. Verify all text meets WCAG AA.
```

### Pass 5-6: Interactive States

**Focus**: Hover, focus, active, disabled states

**Checklist**:
- [ ] All interactive elements have visible hover feedback
- [ ] Focus rings use ring-2 ring-primary-500 ring-offset-2
- [ ] Active states show clear pressed indication (scale 0.98)
- [ ] Disabled states reduce opacity to 50% with not-allowed cursor

**Prompt Template**:
```
Enhance [component] interactive states. Add hover transforms
(scale 1.02 for buttons, translateY for cards), ensure focus
rings are visible for keyboard users, add active scale-down.
```

### Pass 7-8: Micro-Interactions

**Focus**: Animations, transitions, entrance effects

**Checklist**:
- [ ] Transitions use ease-smooth timing (200-300ms)
- [ ] Entrance animations stagger children (50-100ms delay)
- [ ] Loading states have skeleton or spinner
- [ ] State changes animate (height, opacity, transform)

**Prompt Template**:
```
Add micro-interactions to [component] using Framer Motion.
Include entrance animation (fade-up), hover scale, and smooth
state transitions. Use spring config from tokens for bounce.
Respect prefers-reduced-motion.
```

### Pass 9-10: Final Polish

**Focus**: Edge cases, accessibility, performance

**Checklist**:
- [ ] Empty states have helpful messaging
- [ ] Error states are clear and actionable
- [ ] Touch targets are minimum 44x44px
- [ ] No layout shift on state changes (use min-height)
- [ ] Images use blur placeholder loading

**Prompt Template**:
```
Final polish pass on [component]. Check edge cases (empty, error,
loading). Verify touch targets, add aria labels, ensure no CLS.
Optimize any heavy animations for mobile.
```

## Component-Specific Guidelines

### Buttons

```tsx
// Premium button with all polish
<motion.button
  className={cn(
    // Layout
    'inline-flex items-center justify-center gap-2',
    'px-5 py-2.5 rounded-xl',
    // Typography
    'text-sm font-medium',
    // Colors (using tokens)
    'bg-neutral-900 dark:bg-white',
    'text-white dark:text-neutral-900',
    // Interactive states
    'hover:bg-neutral-800 dark:hover:bg-neutral-100',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    // Transitions
    'transition-colors duration-200 ease-smooth',
    // Disabled
    'disabled:opacity-50 disabled:cursor-not-allowed'
  )}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
/>
```

### Cards

```tsx
// Premium card with depth
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
  className={cn(
    // Layout
    'relative overflow-hidden',
    'p-6 rounded-2xl',
    // Colors
    'bg-white dark:bg-neutral-900',
    'border border-neutral-200 dark:border-neutral-800',
    // Shadow (elevate on hover)
    'shadow-sm hover:shadow-xl',
    // Transform
    'hover:-translate-y-1',
    // Transitions
    'transition-all duration-300 ease-smooth'
  )}
/>
```

### Form Inputs

```tsx
// Premium input with states
<input
  className={cn(
    // Layout
    'w-full h-11 px-4 rounded-xl',
    // Colors
    'bg-white dark:bg-neutral-900',
    'border border-neutral-200 dark:border-neutral-800',
    'text-neutral-900 dark:text-white',
    'placeholder:text-neutral-400',
    // Focus state
    'focus:outline-none focus:ring-4',
    'focus:ring-primary-500/20 focus:border-primary-500',
    // Error state
    'aria-[invalid=true]:border-red-500',
    'aria-[invalid=true]:ring-red-500/20',
    // Transitions
    'transition-all duration-200 ease-smooth'
  )}
/>
```

## Animation Tokens Reference

| Use Case | Duration | Easing | Framer Spring |
|----------|----------|--------|---------------|
| Hover feedback | 150ms | ease-out | - |
| State change | 200ms | ease-smooth | snappy |
| Entrance | 300-500ms | ease-out | smooth |
| Exit | 200ms | ease-in | - |
| Modal | 300ms | spring | bouncy |
| Page transition | 400ms | ease-smooth | gentle |

## Responsive Polish

### Breakpoint-Specific Adjustments

```tsx
// Mobile-first responsive polish
className={cn(
  // Mobile (default)
  'px-4 py-3 text-sm',
  'rounded-lg',

  // Tablet (sm)
  'sm:px-5 sm:py-3.5',
  'sm:rounded-xl',

  // Desktop (lg)
  'lg:px-6 lg:py-4 lg:text-base',
  'lg:rounded-2xl'
)}
```

### Touch vs Mouse Interaction

```tsx
// Differentiate touch and mouse
const isTouchDevice = 'ontouchstart' in window;

// Larger touch targets on mobile
<button className={cn(
  'min-h-[44px] min-w-[44px]', // Touch target
  'lg:min-h-0 lg:min-w-0'      // Relax on desktop
)} />

// Hover only on non-touch
whileHover={!isTouchDevice ? { scale: 1.02 } : undefined}
```

## Accessibility Polish

### Focus Management

```tsx
// Visible focus ring that works on all backgrounds
'focus-visible:outline-none',
'focus-visible:ring-2',
'focus-visible:ring-primary-500',
'focus-visible:ring-offset-2',
'focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900'
```

### Reduced Motion

```tsx
import { prefersReducedMotion } from '@/lib/utils';

// Respect user preference
const animationProps = prefersReducedMotion()
  ? {} // No animation
  : {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 }
    };
```

### Screen Reader Support

```tsx
// Hidden but accessible
<span className="sr-only">Open menu</span>

// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Descriptive labels
<button aria-label="Close dialog" aria-describedby="modal-description">
  <X />
</button>
```

## Iteration Workflow

1. **Select Component**: Pick one component/page to polish
2. **Run Audit**: Use `@ui-refinement [path] full-audit`
3. **Prioritize Issues**: Start with spacing, then colors, then animation
4. **Make Changes**: Apply one category of changes at a time
5. **Test**: Check light/dark mode, responsive, accessibility
6. **Repeat**: Run next pass with different focus area

## Example: 10-Pass Button Polish

```bash
# Pass 1: Spacing
"Verify Button padding follows 4px grid, adjust if needed"

# Pass 2: Typography
"Ensure font-medium, proper letter-spacing for sizes"

# Pass 3: Colors light mode
"Check contrast ratios, hover state visibility"

# Pass 4: Colors dark mode
"Verify dark mode colors invert properly"

# Pass 5: Hover state
"Add scale transform, shadow elevation on hover"

# Pass 6: Focus state
"Add visible focus ring with offset"

# Pass 7: Active state
"Add scale-down on tap/click"

# Pass 8: Loading state
"Add spinner, disable interactions while loading"

# Pass 9: Disabled state
"Reduce opacity, change cursor, remove interactions"

# Pass 10: Final audit
"Test all variants, sizes, states, responsive"
```

## Quality Benchmarks

After completing all passes, verify:

| Metric | Target |
|--------|--------|
| Lighthouse Accessibility | 100 |
| Color Contrast (body text) | ≥ 4.5:1 |
| Color Contrast (large text) | ≥ 3:1 |
| Touch Target Size | ≥ 44x44px |
| Animation Duration | 150-500ms |
| Interactive Feedback | < 100ms |
| Layout Shift (CLS) | < 0.1 |
