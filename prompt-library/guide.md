# Mega-Prompt Mastery Guide

> Master the art of structured prompting for AI-accelerated development

## Overview

This guide teaches you how to craft highly effective prompts using XML-structured formatting, context management, and Claude-specific optimizations. These techniques dramatically improve output quality and reduce iteration cycles.

## Core Principles

### 1. Structure with XML Tags

XML tags help Claude parse and understand complex requests:

```xml
<context>
  Provide background information, constraints, and relevant details
</context>

<task>
  Clearly state what you want accomplished
</task>

<requirements>
  - Specific requirement 1
  - Specific requirement 2
</requirements>

<output_format>
  Describe the expected output structure
</output_format>
```

### 2. Context Hierarchy

Order matters. Structure context from general to specific:

1. **Project context** - Tech stack, architecture
2. **Feature context** - What you're building
3. **Task context** - Specific action needed
4. **Constraints** - Limitations and requirements

### 3. Examples Anchor Understanding

Always include examples of desired output:

```xml
<example>
Input: [sample input]
Output: [sample output demonstrating quality/format you want]
</example>
```

### 4. Role Definition

Define Claude's persona for consistent output:

```xml
<role>
You are a senior frontend engineer specializing in React and Next.js.
You prioritize:
- Type safety with TypeScript
- Performance optimization
- Accessibility (WCAG AA)
- Clean, maintainable code
</role>
```

## Prompt Templates

### Template 1: Component Creation

```xml
<context>
Project: Next.js 14+ with App Router
Design System: Custom tokens in /src/design-system/tokens.ts
Component Library: /src/components/ui/
Styling: Tailwind CSS with design tokens
Animation: Framer Motion
</context>

<task>
Create a [ComponentName] component that [description]
</task>

<requirements>
- Use TypeScript with proper interface definitions
- Follow design system tokens (no hardcoded colors/spacing)
- Include all interactive states (hover, focus, active, disabled)
- Support both light and dark modes
- Implement with Framer Motion for animations
- Add proper ARIA attributes for accessibility
- Include JSDoc comments for props
</requirements>

<props>
- variant: [list variants]
- size: [list sizes]
- [other props]
</props>

<example>
// Example usage:
<ComponentName variant="primary" size="md">
  Content here
</ComponentName>
</example>

<output_format>
1. Complete TypeScript component file
2. Export statement for index.ts
3. Usage example
</output_format>
```

### Template 2: Feature Planning

```xml
<context>
Project: [Project description]
Current Architecture: [Brief architecture overview]
Existing Patterns: [Relevant patterns to follow]
</context>

<task>
Plan the implementation of [feature name]
</task>

<feature_description>
[Detailed description of what the feature does]
</feature_description>

<user_stories>
- As a [user type], I want [goal] so that [benefit]
</user_stories>

<constraints>
- Must integrate with [existing systems]
- Performance budget: [constraints]
- Timeline: [if relevant]
</constraints>

<output_format>
1. Technical specification
2. Data model changes
3. API endpoints needed
4. Component hierarchy
5. Implementation phases with checklist
6. Testing strategy
</output_format>
```

### Template 3: Code Review & Refactoring

```xml
<context>
Codebase: [Tech stack]
File: [file path]
Purpose: [What this code does]
</context>

<task>
Review and refactor the following code for:
- Performance
- Type safety
- Readability
- Best practices
</task>

<code>
[paste code here]
</code>

<focus_areas>
- [Specific concern 1]
- [Specific concern 2]
</focus_areas>

<output_format>
1. Issues identified with severity (critical/moderate/minor)
2. Refactored code with comments explaining changes
3. Before/after comparison for significant changes
</output_format>
```

### Template 4: Bug Investigation

```xml
<context>
Project: [Project details]
Environment: [Browser, Node version, etc.]
</context>

<bug_report>
Expected: [What should happen]
Actual: [What is happening]
Steps to reproduce:
1. [Step 1]
2. [Step 2]
</bug_report>

<relevant_code>
[Paste relevant code]
</relevant_code>

<error_output>
[Paste error messages or logs]
</error_output>

<task>
Diagnose the bug and provide a fix
</task>

<output_format>
1. Root cause analysis
2. Fix with explanation
3. Test to verify the fix
4. Recommendations to prevent similar bugs
</output_format>
```

### Template 5: API Design

```xml
<context>
Project: [Project type]
Backend: [Backend tech]
Database: [Database type]
Auth: [Auth method]
</context>

<task>
Design REST API endpoints for [feature]
</task>

<requirements>
- RESTful conventions
- Proper HTTP methods and status codes
- Request/response validation
- Error handling
- Rate limiting considerations
</requirements>

<data_model>
[Describe the data model or entities involved]
</data_model>

<output_format>
1. Endpoint specification table (Method | Path | Description | Auth)
2. Request/response schemas (TypeScript interfaces)
3. Error response formats
4. Example requests with curl
</output_format>
```

## Advanced Techniques

### Technique 1: Chain of Thought

For complex reasoning, ask Claude to think step-by-step:

```xml
<task>
[Complex task description]
</task>

<approach>
Think through this step-by-step:
1. First, analyze [aspect 1]
2. Then, consider [aspect 2]
3. Finally, synthesize into [output]
</approach>
```

### Technique 2: Persona Stacking

Combine multiple expert perspectives:

```xml
<personas>
Consider this from multiple expert perspectives:

<frontend_expert>
Focus on component architecture, performance, UX
</frontend_expert>

<security_expert>
Focus on vulnerabilities, auth, data protection
</security_expert>

<accessibility_expert>
Focus on WCAG compliance, screen readers, keyboard nav
</accessibility_expert>
</personas>

<task>
[Task that benefits from multiple viewpoints]
</task>
```

### Technique 3: Iterative Refinement

Use follow-up prompts to refine output:

```xml
<previous_output>
[Paste Claude's previous response]
</previous_output>

<refinement>
Improve the above by:
- [Specific improvement 1]
- [Specific improvement 2]
</refinement>

<constraints>
- Keep [aspects to preserve]
- Change [aspects to modify]
</constraints>
```

### Technique 4: Constraint Satisfaction

When balancing tradeoffs:

```xml
<task>
[Task description]
</task>

<constraints priority="ranked">
1. [Most important constraint]
2. [Second priority]
3. [Third priority]
</constraints>

<tradeoffs>
If constraints conflict, prefer [approach]
</tradeoffs>
```

### Technique 5: Output Validation

Include self-check criteria:

```xml
<task>
[Task description]
</task>

<validation_criteria>
Before providing the output, verify:
- [ ] Follows design system tokens
- [ ] TypeScript compiles without errors
- [ ] All props have proper types
- [ ] Includes error handling
- [ ] Accessible (ARIA labels, keyboard nav)
</validation_criteria>
```

## Claude Code Integration

### Setting Up Context

In your CLAUDE.md file:

```markdown
## Project Context

Always reference:
- /src/design-system/tokens.ts for styling tokens
- /AI-RULES.md for development guidelines
- /src/components/ui/index.ts for existing components

## Code Standards

- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Test coverage > 80%
```

### Effective Commands

```bash
# Feature planning with full context
claude "Plan the implementation of user dashboard"
  --context="Read /AI-RULES.md and /src/design-system/tokens.ts first"

# Component creation with examples
claude "Create a Tooltip component like the Button in /src/components/ui/Button.tsx"

# Iterative refinement
claude "Improve the Tooltip hover animation using the smooth easing from tokens"
```

### Context Hygiene

Keep context focused:

1. **Start fresh** for new features
2. **Reference files** instead of pasting content
3. **Summarize** long conversations before continuing
4. **Clear cache** between unrelated tasks

## Prompt Library Index

| Prompt | Purpose | File |
|--------|---------|------|
| Product Strategy | PRD generation | [product-strategy.md](./prompts/product-strategy.md) |
| UI Design System | v0.dev integration | [ui-design.md](./prompts/ui-design.md) |
| Go-to-Market | Launch planning | [gtm-strategy.md](./prompts/gtm-strategy.md) |
| Code Audit | Quality review | [code-audit.md](./prompts/code-audit.md) |
| SEO Optimization | Search optimization | [seo-optimization.md](./prompts/seo-optimization.md) |
| Performance Audit | Speed optimization | [performance-audit.md](./prompts/performance-audit.md) |
| Security Review | Vulnerability check | [security-review.md](./prompts/security-review.md) |
| Documentation | Docs generation | [documentation.md](./prompts/documentation.md) |
| Testing Strategy | Test planning | [testing-strategy.md](./prompts/testing-strategy.md) |
| API Design | Endpoint planning | [api-design.md](./prompts/api-design.md) |

## Comparison: Claude vs Other AIs

### Claude Strengths

- **XML parsing**: Best-in-class structured input handling
- **Long context**: Maintains coherence over long conversations
- **Code quality**: Produces well-structured, idiomatic code
- **Safety**: Built-in awareness of security best practices
- **Reasoning**: Strong step-by-step analysis

### Optimization Tips

| Task | Claude Approach | Alternative AI Approach |
|------|-----------------|------------------------|
| Code generation | Use XML structure, provide examples | May work with looser formatting |
| Reasoning | Ask for step-by-step thinking | Similar approach works |
| Large files | Reference file paths | May need chunking |
| Iteration | Build on previous context | Often better with fresh prompts |

## Best Practices Summary

1. **Always use XML tags** for complex requests
2. **Provide context** before the task
3. **Include examples** of desired output
4. **Specify constraints** clearly
5. **Define output format** explicitly
6. **Iterate** with refinement prompts
7. **Validate** output against criteria
8. **Maintain context hygiene** between tasks
