# Design Principles - ROSES OS

A guide to creating the ROSES OS platform. Every design decision should trace back to these principles.

---

## Design Philosophy

### Core Principles

1. **Breathing Minimalism** - Generous whitespace with purposeful focal points. Space is not empty; it's breathing room.
2. **Typography-First Hierarchy** - Text size and weight create the visual structure. Type IS the design.
3. **Sophisticated Restraint** - Near-monochrome palette. No bright colors without a strong reason.
4. **Subtle Motion** - Micro-interactions that enhance, never distract. Felt, not seen.
5. **Progressive Disclosure** - Reveal information gradually. Don't overwhelm.

### Reference Aesthetic

Clean, minimal, confident. The website should feel like visiting a refined gallery - the work is the star, the UI gets out of the way.

---

## Color System

### Monochrome-First Palette

| Role | Light Mode | Dark Mode | Usage |
|------|-----------|-----------|-------|
| Page background | #E8E8E8 | #0A0A0A | Main canvas |
| Surface/cards | #FFFFFF | #1A1A1A | Elevated elements |
| Subtle sections | #F5F5F5 | #171717 | Alternating backgrounds |
| Primary text | #1A1A1A | #F5F5F5 | Headings, body |
| Supporting text | #666666 | #999999 | Secondary info |
| Caption text | #999999 | #666666 | Metadata, labels |
| Accent/CTA | #000000 | #FFFFFF | Buttons, emphasis |
| Borders | #D4D4D4 | #262626 | Dividers |

### Rules

- Background is light grey (#E8E8E8), NOT white. White is reserved for elevated surfaces.
- No bright colors unless there's a functional reason (status indicators only).
- Let contrast between text and background do the work.
- Dark mode inverts the palette with the same restraint.

---

## Typography

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display | clamp(48px, 8vw, 96px) | 700 | 1.1 | Hero only |
| H1 | clamp(36px, 5vw, 64px) | 700 | 1.1 | Page titles |
| H2 | clamp(28px, 4vw, 48px) | 600 | 1.2 | Section headers |
| H3 | clamp(20px, 3vw, 32px) | 600 | 1.3 | Subsections |
| Body large | clamp(18px, 2vw, 24px) | 400 | 1.4 | Intro text |
| Body | 16px | 400 | 1.6 | Standard text |
| Body small | 14px | 400 | 1.5 | Supporting text |
| Caption | 12px | 500 | 1.4 | Labels, metadata |

### Letter Spacing

| Context | Value |
|---------|-------|
| Display (5xl+) | -0.025em |
| Headings (2xl-4xl) | -0.02em |
| Body | 0 (default) |
| Captions/labels | 0.02em |

### Rules

- **One font family:** Inter. Don't add more.
- **Max weight: 700 (bold).** Never use extrabold.
- Headlines should be confident and large. Don't be afraid of scale.
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
| Mobile | 40px |
| Tablet | 80px |
| Desktop | 120px |

### Section Spacing

| Context | Value |
|---------|-------|
| Hero section | min-h-screen, py-32 lg:py-48 |
| Standard section | py-20 lg:py-32 |
| Between header & content | mb-16 lg:mb-20 |
| Card internal padding | p-6 lg:p-8 |

### Rules

- When in doubt, add MORE space. Generous whitespace is the design.
- Never use arbitrary spacing (`p-[18px]`). Stick to the scale.
- Asymmetric spacing is OK - it creates visual interest.

---

## Animation

### Philosophy

Animations should be felt, not seen. They guide attention subtly.

### Allowed Patterns

| Pattern | Implementation |
|---------|---------------|
| Entrance | Fade in + translate up (opacity 0→1, y 20→0) |
| Stagger | 80-100ms delay between children |
| Image hover | Scale 1.05, transition 400ms |
| Link hover | Opacity 0.6, transition 200ms |
| Button hover | Very subtle scale or shadow change |

### Timing

| Duration | Use |
|----------|-----|
| 100ms | Active/press states |
| 200ms | Hover transitions |
| 300ms | Standard transitions |
| 400ms | Image hover, larger elements |
| 600ms | Entrance animations |

### Default Easing

```
cubic-bezier(0.4, 0.0, 0.2, 1) — smooth deceleration
```

### What to Avoid

- Bouncing or spring animations with visible overshoot
- Parallax effects
- Auto-playing media
- Scale > 1.05 on hover
- Duration > 800ms
- Animations that delay content access

---

## Component Patterns

### Navigation

- Fixed, translucent with backdrop blur
- Height: 80px
- Logo left, nav items right
- Hover: opacity transition (not color change)
- Background: rgba(232, 232, 232, 0.8) in light mode

### Project Cards (Portfolio)

- Full-bleed image background
- Overlay gradient bottom-to-top
- Text: white, bottom-left
- Hover: image scale 1.05, gradient intensifies
- Aspect ratio: 4:3 or 16:9

### Buttons

| Variant | Style |
|---------|-------|
| Primary | Black bg, white text, rounded-full |
| Secondary | Border, dark text, rounded-full |
| Ghost | No border, underline on hover |

### Section Header

```
[Label - uppercase, small, tracking-wider, muted color]
[Title - large, bold, tracking-tight]
[Description - body-lg, muted-foreground]
```

---

## Dark Mode

Light mode is primary. Dark mode inverts the palette while maintaining the same restraint.

| Element | Light | Dark |
|---------|-------|------|
| Background | #E8E8E8 | #0A0A0A |
| Surface | #FFFFFF | #1A1A1A |
| Text | #1A1A1A | #F5F5F5 |
| Accent | #000000 | #FFFFFF |
| Borders | #D4D4D4 | #262626 |

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

### Common Classes

```tsx
// Hero headline
"text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]"

// Section heading
"text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight"

// Body text
"text-lg text-muted-foreground leading-relaxed"

// Caption / label
"text-xs font-medium uppercase tracking-wider text-neutral-500"

// Primary button
"px-8 py-3 bg-black text-white rounded-full font-medium
 hover:bg-neutral-800 transition-all duration-200"

// Card
"bg-white dark:bg-neutral-900 rounded-xl p-6 lg:p-8
 shadow-sm transition-all duration-300 hover:shadow-md"

// Section wrapper
"section-padding bg-background"

// Container
"container-premium"
```
