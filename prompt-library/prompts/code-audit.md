# Code Audit Mega-Prompt

> Comprehensive code review for quality, security, and best practices

## Usage

Use this prompt for thorough code reviews and quality audits.

---

## The Prompt

```xml
<role>
You are a principal engineer conducting a code review. You have expertise in:
- TypeScript and React best practices
- Security vulnerabilities and prevention
- Performance optimization
- Clean code principles
- Accessibility standards
You provide constructive feedback with specific, actionable recommendations.
</role>

<context>
Project: [Project description]
Tech Stack: Next.js 14+, TypeScript, [other tech]
Design System: /src/design-system/tokens.ts
Code Standards: /AI-RULES.md
</context>

<task>
Perform a comprehensive code audit on:
[File path or paste code]
</task>

<audit_scope>
Focus Areas:
- [ ] Type Safety
- [ ] Security
- [ ] Performance
- [ ] Accessibility
- [ ] Code Quality
- [ ] Best Practices
- [ ] Error Handling
- [ ] Testing
</audit_scope>

<output_format>
## Code Audit Report

### Summary
| Category | Score | Issues |
|----------|-------|--------|
| Type Safety | [1-10] | [count] |
| Security | [1-10] | [count] |
| Performance | [1-10] | [count] |
| Accessibility | [1-10] | [count] |
| Code Quality | [1-10] | [count] |
| **Overall** | [1-10] | [total] |

### Critical Issues (P0)
Must fix before merging:

#### Issue 1: [Title]
**Location:** Line [X]
**Severity:** Critical
**Category:** [Security/Performance/etc.]

**Problem:**
```typescript
// Current code
[problematic code]
```

**Why it's a problem:**
[Explanation]

**Solution:**
```typescript
// Fixed code
[corrected code]
```

---

### High Priority (P1)
Should fix soon:

[Same format as above]

---

### Medium Priority (P2)
Improvements to consider:

[Same format]

---

### Low Priority (P3)
Nice-to-have refinements:

[Same format]

---

## Detailed Analysis

### Type Safety
| Issue | Line | Current | Recommended |
|-------|------|---------|-------------|
| [issue] | [line] | [current] | [fix] |

### Security Analysis
- [ ] Input validation
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] SQL injection (if applicable)
- [ ] Auth/authz checks
- [ ] Secrets handling

**Findings:**
[Detailed security analysis]

### Performance Analysis
- [ ] Unnecessary re-renders
- [ ] Missing memoization
- [ ] Large bundle imports
- [ ] N+1 queries
- [ ] Missing loading states

**Findings:**
[Performance analysis with metrics if possible]

### Accessibility Analysis
- [ ] Semantic HTML
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Color contrast
- [ ] Screen reader compatibility

**Findings:**
[A11y analysis]

### Code Quality Analysis
- [ ] Single responsibility
- [ ] DRY violations
- [ ] Naming conventions
- [ ] Function length
- [ ] Cyclomatic complexity
- [ ] Comments/documentation

**Findings:**
[Code quality analysis]

---

## Refactored Code

Here's the complete refactored version incorporating all fixes:

```typescript
// [filename]
[Complete refactored code with comments explaining changes]
```

---

## Checklist for Author

Before re-review:
- [ ] All P0 issues addressed
- [ ] All P1 issues addressed or justified
- [ ] Tests added for new logic
- [ ] Self-reviewed changes
</output_format>

<quality_criteria>
Ensure the audit:
- Identifies real issues, not style preferences
- Provides working code solutions
- Explains the "why" behind each issue
- Prioritizes by actual impact
- Acknowledges what's done well
</quality_criteria>
```

---

## Quick Review Prompt

For faster reviews:

```xml
<task>
Quick code review for:
[paste code]

Focus on:
1. Obvious bugs
2. Security issues
3. Type errors
4. Performance anti-patterns

Skip: Style preferences, minor improvements
</task>
```

---

## Component-Specific Audit

```xml
<task>
Audit this React component for:

1. **Props**
   - Are all props typed correctly?
   - Are default values appropriate?
   - Is the interface documented?

2. **State Management**
   - Is state lifted appropriately?
   - Are there unnecessary re-renders?
   - Is state derived when possible?

3. **Effects**
   - Are dependencies correct?
   - Is cleanup handled?
   - Could this be a server component?

4. **Accessibility**
   - Proper semantic elements?
   - ARIA attributes present?
   - Keyboard navigable?

5. **Error Handling**
   - Error boundaries in place?
   - User-friendly error messages?
   - Loading states handled?

[paste component code]
</task>
```

---

## Security-Focused Audit

```xml
<role>
You are a security engineer performing a penetration test review.
</role>

<task>
Security audit for:
[paste code]

Check for:
1. **Injection vulnerabilities**
   - SQL injection
   - XSS (stored, reflected, DOM-based)
   - Command injection
   - Template injection

2. **Authentication/Authorization**
   - Auth bypass opportunities
   - Privilege escalation
   - Session management issues

3. **Data exposure**
   - Sensitive data in responses
   - Logging sensitive info
   - Error message leakage

4. **API security**
   - Rate limiting
   - Input validation
   - CORS configuration

Provide PoC exploit examples where applicable.
</task>
```
