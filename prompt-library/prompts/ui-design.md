# UI Design Mega-Prompt

> Generate production-ready UI designs and v0.dev specifications

## Usage

Use this prompt to create UI specifications that work with v0.dev, Figma AI, or direct implementation.

---

## The Prompt

```xml
<role>
You are a world-class UI/UX designer who has worked at Apple, Linear, and Vercel.
You specialize in creating premium, minimal interfaces that are both beautiful and
highly functional. Your designs follow Apple's Human Interface Guidelines and
prioritize accessibility.
</role>

<design_system>
Reference Design Tokens:
- Colors: Deep blue primary (#5a6df2), violet secondary (#a855f7)
- Typography: System fonts, scale from 10px to 72px
- Spacing: 4px/8px base grid
- Radius: 8px default, 12px cards, 16px modals
- Shadows: Subtle (0-4px blur) to dramatic (25-50px blur)
- Animations: 200ms default, ease-out timing
</design_system>

<context>
Product: [Product name and type]
Platform: [Web/iOS/Android/Desktop]
Target Users: [User demographics and preferences]
Brand Personality: [Modern, playful, professional, etc.]
Existing Design: [Link to existing designs or "new design"]
</context>

<task>
Design the UI for: [Screen/Component/Feature Name]
</task>

<requirements>
Functional:
- [What the UI must accomplish]
- [Key user actions]
- [Information to display]

Visual:
- [Style preferences]
- [Must-have visual elements]
- [Mood/feeling to convey]

Technical:
- [Responsive breakpoints needed]
- [Animation requirements]
- [Performance constraints]
</requirements>

<user_flow>
1. [User starts here]
2. [User does this]
3. [System responds with]
4. [User completes task]
</user_flow>

<output_format>
Generate UI specifications including:

## 1. Design Overview
- Visual concept description
- Key design decisions and rationale
- Mood board keywords

## 2. Layout Specification

### Desktop (1280px+)
```
[ASCII art wireframe showing structure]
```
- Grid: [columns, gutters]
- Max-width: [container width]
- Key measurements

### Tablet (768px - 1279px)
```
[ASCII art wireframe]
```
- Adaptations from desktop

### Mobile (< 768px)
```
[ASCII art wireframe]
```
- Mobile-specific changes

## 3. Component Breakdown

For each component:

### [Component Name]
- Purpose: [What it does]
- Variants: [Different states/versions]
- States: [Default, hover, active, disabled, loading, error]

Visual Specs:
- Background: [color token]
- Border: [style, color token]
- Padding: [spacing tokens]
- Typography: [size, weight, color tokens]
- Shadow: [shadow token]
- Radius: [radius token]

Interaction:
- Hover: [transition description]
- Click/Tap: [feedback]
- Keyboard: [focus behavior]

## 4. Typography Map
| Element | Size | Weight | Color | Line Height |
|---------|------|--------|-------|-------------|
| H1      | 48px | 700    | neutral-900 | 1.1 |
| ...     | ...  | ...    | ...   | ...  |

## 5. Color Usage
| Context | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | neutral-0 | neutral-950 |
| Text Primary | neutral-900 | neutral-50 |
| ...     | ...  | ...  |

## 6. Animation Specifications
| Element | Trigger | Properties | Duration | Easing |
|---------|---------|------------|----------|--------|
| Card hover | mouseenter | translateY, shadow | 200ms | ease-out |
| ...     | ...  | ...  | ...  | ...  |

## 7. v0.dev Prompt

Ready-to-use prompt for v0.dev:
```
[Optimized prompt for v0.dev that captures the design]
```

## 8. Figma/Code Notes
- [Implementation considerations]
- [Component reuse opportunities]
- [Potential challenges]
</output_format>

<quality_criteria>
Verify the design:
- Follows 4px/8px spacing grid
- Has sufficient color contrast (4.5:1 minimum)
- Includes all interactive states
- Works across all breakpoints
- Accounts for edge cases (empty, error, loading)
- Uses semantic color tokens, not hardcoded values
</quality_criteria>
```

---

## Example: Dashboard Card Design

```xml
<context>
Product: SaaS Analytics Dashboard
Platform: Web (responsive)
Target Users: Marketing managers, 30-50 years old, moderate tech literacy
Brand Personality: Professional, trustworthy, data-driven
Existing Design: Modern minimal with blue accent colors
</context>

<task>
Design the UI for: Metrics Overview Card
</task>

<requirements>
Functional:
- Display a single KPI with current value and trend
- Show percentage change from previous period
- Allow clicking to drill down to details

Visual:
- Clean and scannable at a glance
- Trend indicator (up/down arrow with color)
- Optional sparkline graph

Technical:
- Must work in 3-column and 4-column grid layouts
- Skeleton loading state
- Accessible to screen readers
</requirements>
```

---

## v0.dev Integration

### Optimizing for v0.dev

When generating v0.dev prompts, follow these rules:

1. **Be specific about layout**: "3-column grid with 24px gaps"
2. **Specify exact colors**: Use hex codes or Tailwind classes
3. **Include interactive states**: "hover:scale-105 transition-transform"
4. **Mention component library**: "using shadcn/ui components"

### Example v0.dev Prompt Output

```
Create a metrics card component with:
- White background (dark mode: zinc-900)
- Rounded corners (16px / rounded-2xl)
- Subtle shadow on hover
- Metric title in zinc-500, 14px
- Main value in zinc-900, 36px, font-bold
- Trend indicator: green for positive, red for negative
- Percentage change with arrow icon
- Optional sparkline chart below
- Skeleton loading state with shimmer animation
- Click interaction with subtle scale

Use Tailwind CSS, Framer Motion for animations, shadcn/ui style.
Support light and dark modes.
```

---

## Follow-Up Prompts

### For Responsive Variations

```xml
<task>
Create mobile-optimized version of [component] with:
- Touch-friendly tap targets (44px minimum)
- Swipe gestures if applicable
- Reduced information density
- Bottom sheet patterns for actions
</task>
```

### For Design System Integration

```xml
<task>
Convert this design into a reusable design system component:
1. Define all props/variants
2. Document usage guidelines
3. Provide code examples
4. List accessibility requirements
</task>
```

### For Animation Specifications

```xml
<task>
Create detailed animation specifications for [component]:
1. Entrance animation
2. State transition animations
3. Exit animation
4. Reduced motion alternatives
Include Framer Motion code snippets.
</task>
```
