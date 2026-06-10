# Design Principles -- International Aura and Dream School

> Source of truth: [rosesos.com](https://rosesos.com) | Tokens: `src/design-system/tokens.ts` | Theme: `src/design-system/theme.css` | Tailwind: `src/app/globals.css`

Every design decision should trace back to these principles and the live site.

---

## Design Philosophy

### Core Principles

1. **Breathing Minimalism** -- Generous whitespace with purposeful focal points. Space is not empty; it's breathing room. Whitespace is sacred space.
2. **Typography-First Hierarchy** -- Two fonts create the visual structure. Cormorant Garamond for the sacred, Inter for the modern. Type IS the design.
3. **Warm Restraint** -- Earth-toned palette. No cold greys. No bright colors. Calm only.
4. **Subtle Motion** -- Micro-interactions that enhance, never distract. Felt, not seen. Motion should feel like breath.
5. **Progressive Disclosure** -- Reveal information gradually. Don't overwhelm. The site should feel like walking slowly.

### Reference Aesthetic

Sacred-tech minimalism. The website should feel like a temple built with modern precision -- warm silence, calm authority, modern devotion.

> "Apple-level minimalism inside a temple." -- brand-dna.md

---

## Color System

### Brand Palette (from rosesos.com)

**Primary Signature Color:**

| Color | HEX | Role |
|-------|-----|------|
| **Rose Clay Mauve** | `#9C6F6E` | The human interface layer -- field color for reflection, invitation, remembrance. Not an accent -- it's the room you enter. |

**Primary Neutrals:**

| Color | HEX | Usage |
|-------|-----|-------|
| Aura White | `#F7F5F2` | Primary background |
| Cream Veil | `#FFF8E7` | Soft cream background |
| Golden Ether | `#F5E8E2` | Warm blush background with golden cast |
| Peach Sand | `#EBD6C1` | Light background, peachy cream |
| Honeyed Stone | `#C7AE8C` | Background support, warm golden |
| Gilded Clay | `#A8896D` | Warm neutral, golden-tan, earthy |
| Soft Charcoal | `#3F3E3C` | Body text, navigation, buttons, dark elements |

**Accent:**

| Color | HEX | Usage |
|-------|-----|-------|
| Antique Olive Brass | `#9E956B` | Primary CTA buttons, highlights, sacred detail. Rare -- like gold in a temple. |

### Light Mode / Dark Mode

| Role | Light | Dark |
|------|-------|------|
| Background | `#F7F5F2` (Aura White) | `#1A1716` |
| Foreground | `#3F3E3C` (Soft Charcoal) | `#F5F0EB` |
| Surface | `#FFFFFF` | `#2A2020` |
| Border | `rgba(232, 224, 216, 0.6)` | `rgba(80, 69, 64, 0.4)` |

### Rules

- **No cold greys.** All neutrals are warm (brown/rose undertones).
- **No bright colors** unless functional (status indicators, chakra teaching).
- Rose Clay Mauve is a field color, not a button color. Think: the room you enter, not the object you click.
- Shadows use warm brown tint `rgb(59 47 47)`, never pure black.

---

## Typography

### Font Pairing (from rosesos.com)

| Use | Typeface | CSS Variable | Character |
|-----|----------|-------------|-----------|
| **Sacred / Display Headlines** | **Cormorant Garamond** | `--font-serif` | Timeless, devotional, poetic |
| **Body / Modern Clarity** | **Inter** | `--font-sans` | Modern, clean, tech-quiet |

**Cormorant Garamond** -- used for: hero titles, quote spreads, section headers.
**Inter** -- used for: paragraphs, UI labels, navigation, buttons.

### Type Scale

| Level | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| 7xl (Hero) | 4.5rem | 400 (light) | 1.1 | -0.02em |
| 5xl | 3rem | 400 | 1.1 | -0.02em |
| 4xl | 2.25rem | 500 | 1.15 | -0.015em |
| 3xl | 1.875rem | 500 | 1.2 | -0.01em |
| 2xl | 1.5rem | 500 | 1.3 | -0.01em |
| xl | 1.25rem | 400 | 1.4 | -0.005em |
| lg | 1.125rem | 400 | 1.7 | 0 |
| base | 1rem | 400 | 1.7 | 0 |
| sm | 0.875rem | 400 | 1.6 | 0 |
| xs | 0.75rem | 400 | 1.5 | 0.02em |

### Heading Weights (Contemplative Style)

| Level | Weight | Notes |
|-------|--------|-------|
| h1 | 400 (light) | Cormorant Garamond -- sacred, not shouty |
| h2 | 500 (medium) | Grounded authority |
| h3-h6 | 600 (semibold) | Structural clarity |

### Rules

- **Two font families only.** Cormorant Garamond + Inter. Nothing else.
- Never bold aggressively. Max weight: 700 (rare).
- Text should breathe. Large line-heights (1.7 for body).
- Headlines are light-weight, not heavy -- contemplative, not shouty.
- Use `text-wrap: balance` on headings.

---

## Spacing

### 8px Base Grid

All spacing is multiples of 8px. This creates visual rhythm.

```
xs:   8px    - Tight element spacing
sm:   16px   - Related elements
md:   32px   - Component separation
lg:   64px   - Section breaks
xl:   128px  - Major section spacing
```

### Safe Margins

| Breakpoint | Side Margin |
|------------|-------------|
| Mobile | 1.5rem (24px) |
| Tablet | 2-2.5rem (32-40px) |
| Desktop | 3-5rem (48-80px) |

### Section Spacing

| Context | Value |
|---------|-------|
| Between sections | 120-160px |
| Title to body | 24-32px |
| Paragraph spacing | 16-20px |
| Card internal padding | p-6 lg:p-8 |

### Rules

- When in doubt, add MORE space. Generous whitespace is the design.
- Never use arbitrary spacing (`p-[18px]`). Stick to the scale.
- The site should feel like walking slowly.

---

## Animation

### Philosophy

Motion should feel like breath. Animations should be felt, not seen.

### Allowed Patterns

| Pattern | Implementation |
|---------|---------------|
| Entrance | Fade in + translate up (opacity 0->1, y 20->0) |
| Stagger | 80-100ms delay between children |
| Image hover | Scale 1.05, transition 400ms |
| Link hover | Opacity transition, 200ms |
| Button hover | Subtle scale or warm shadow change |
| Breathing | 4s scale animation (pulse-subtle) |
| Gentle rise | 0.8s upward entrance |

### Timing

| Duration | Use | Token |
|----------|-----|-------|
| 75ms | Micro interactions | `--duration-micro` |
| 150ms | Fast transitions | `--duration-fast` |
| 200ms | Hover transitions | `--duration-normal` |
| 300ms | Standard transitions | `--duration-relaxed` |
| 500ms | Larger elements | `--duration-slower` |
| 600ms | Entrance animations | `--duration-deliberate` |
| 800ms | Meditative reveals | `--duration-meditative` |

### Easing

```
--ease-smooth:       cubic-bezier(0.4, 0.0, 0.2, 1)    — default
--ease-breathe:      cubic-bezier(0.4, 0.0, 0.6, 1)    — organic
--ease-sacred:       cubic-bezier(0.2, 0.0, 0.2, 1)    — contemplative
--ease-gentleReveal: cubic-bezier(0.1, 0.0, 0.2, 1)    — soft entrance
```

### What to Avoid

- Bouncing, spinning, flashy transitions
- Parallax effects
- Auto-playing media
- Scale > 1.05 on hover
- Duration > 800ms
- Animations that delay content access

---

## Component Patterns

### Navigation (live on rosesos.com)

- Fixed, translucent with backdrop blur
- Logo left, nav items right
- Items: The Rose | Offerings | Guardians | Community
- CTA: "Begin" (Olive Brass pill button)
- Hover: opacity transition (not color change)
- Background: glass effect with warm tint

### Buttons

| Variant | Style |
|---------|-------|
| Primary (CTA) | Olive Brass `#9E956B` bg, Aura White text, rounded-full (pill) |
| Secondary (Ghost) | Transparent bg, warm border 20% opacity, hover: slight warm overlay |

CTA text examples (from rosesos.com): "Begin Your Journey", "Explore The Rose", "Enter the Rose Field"

### Cards / Containers

- Background: warm surface color
- Border: 1px subtle warm border
- Radius: 20px (`--radius-3xl`)
- Padding: 32-40px
- Shadow: warm-tinted, almost invisible (`--shadow-sm`)
- Hover: `--shadow-cardHover` with warm brown tint

### Section Header

```
[Label - uppercase, small, tracking-wider, Gilded Clay color]
[Title - large, Cormorant Garamond, light weight, tracking-tight]
[Description - body-lg, Inter, muted warm text]
```

---

## Dark Mode

Light mode is primary. Dark mode inverts the warm palette.

| Element | Light | Dark |
|---------|-------|------|
| Background | `#F7F5F2` | `#1A1716` |
| Foreground | `#3F3E3C` | `#F5F0EB` |
| Surface | `#FFFFFF` | `#2A2020` |
| Accent | `#9E956B` | `#9E956B` |
| Border | warm 60% opacity | warm 40% opacity |

### Style Variant: Rose Clay

An alternative style variant (`data-style="rose-clay"`) uses rose-tinted tones instead of pure charcoals for a warmer, more contemplative feel.

---

## Glass & Texture Effects

### Glass Morphism

```css
background: rgba(247, 245, 242, 0.8);
border: 1px solid rgba(232, 224, 216, 0.4);
box-shadow: 0 8px 32px 0 rgba(63, 62, 60, 0.06);
backdrop-filter: blur(16px);
```

### Texture Overlays

- Grain texture (animated noise, 0.02 opacity)
- Linen texture overlay (subtle)
- Rose Clay Mauve should always be paired with subtle texture (linen, paper grain, soft mineral noise). Flat fills make it cosmetic. Texture makes it architectural.

---

## Accessibility

### Requirements

- WCAG AA minimum (4.5:1 text contrast, 3:1 large text)
- Keyboard navigation on all interactive elements
- Visible focus indicators (2px solid, 4px offset)
- Alt text on all meaningful images
- Semantic HTML (proper heading hierarchy)
- Touch targets minimum 44x44px
- Respect `prefers-reduced-motion`

---

## Quick Reference

### Common Classes (Tailwind v4)

```tsx
// Hero headline (Cormorant Garamond)
"font-serif text-5xl md:text-7xl font-heading-1 tracking-tighter leading-[1.1]"

// Section heading (Cormorant Garamond)
"font-serif text-3xl md:text-4xl lg:text-5xl font-heading-2 tracking-tight"

// Body text (Inter)
"font-sans text-lg text-warm-600 leading-relaxed"

// Caption / label (Inter)
"font-sans text-xs font-medium uppercase tracking-wider text-warm-500"

// Primary button (Olive Brass)
"px-8 py-3 bg-gold text-warm-0 rounded-full font-sans font-medium
 hover:opacity-90 transition-all duration-200"

// Card (warm surface)
"bg-warm-0 dark:bg-warm-900 rounded-3xl p-6 lg:p-8
 shadow-sm transition-all duration-300 hover:shadow-cardHover"

// Section wrapper
"section-padding bg-background"
```

### CSS Variables Reference

All design tokens are defined as CSS custom properties in `src/design-system/theme.css`. Key variables:

```
--font-serif: "Cormorant Garamond"
--font-sans: "Inter"
--color-rose-clay: #9C6F6E
--color-olive-brass: #9E956B
--color-soft-charcoal: #3F3E3C
--color-background: #F7F5F2
--color-foreground: #3F3E3C
```

For the complete token set, see `src/design-system/tokens.ts`.
