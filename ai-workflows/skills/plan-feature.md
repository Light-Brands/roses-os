# /plan-feature Skill

> Generate comprehensive feature specifications with architecture decisions

## Usage

```
/plan-feature [feature-name] [optional: complexity-level]
```

## Skill Definition

When invoked, this skill creates a detailed feature specification document.

## Execution Steps

### 1. Feature Analysis

<analysis>
- Parse the feature name and identify core requirements
- Determine affected system areas (UI, API, DB, Auth)
- Identify existing components that can be reused
- Assess complexity and estimate scope
</analysis>

### 2. Architecture Planning

<architecture>
- Define data models and relationships
- Map API endpoints needed
- Identify component hierarchy
- Plan state management approach
- Consider caching strategy
</architecture>

### 3. Output Specification

Generate a markdown file at `/docs/features/[feature-name].md`:

```markdown
# Feature: [Feature Name]

## Overview
[Brief description of what this feature does]

## User Stories
- As a [user type], I want [goal] so that [benefit]

## Technical Specification

### Data Models
```typescript
interface FeatureModel {
  id: string;
  // ... fields
}
```

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/... | Fetches...  |

### Components
- `FeatureComponent` - Main container
- `FeatureItem` - Individual item display

### State Management
[How state is managed - React state, context, etc.]

## UI/UX Design
- Follow design tokens from `/src/design-system/tokens.ts`
- Use existing component patterns from `/src/components/ui/`
- Mobile-first responsive design

## Implementation Phases

### Phase 1: Foundation
- [ ] Create data models
- [ ] Set up API routes
- [ ] Basic CRUD operations

### Phase 2: UI Implementation
- [ ] Build core components
- [ ] Implement interactions
- [ ] Add animations per design system

### Phase 3: Polish & Testing
- [ ] Write unit tests
- [ ] Accessibility audit
- [ ] Performance optimization

## Dependencies
- Existing: [list existing dependencies to use]
- New: [list any new packages needed with justification]

## Security Considerations
[Authentication, authorization, input validation]

## Performance Targets
- Lighthouse Score: 95+
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
```

## Example Usage

```
/plan-feature user-dashboard
```

Creates `/docs/features/user-dashboard.md` with full specification.

## Integration with /dev

After planning, use `/dev [file] [phase]` to implement each phase systematically.
