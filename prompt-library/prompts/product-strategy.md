# Product Strategy Mega-Prompt

> Generate comprehensive Product Requirements Documents (PRDs)

## Usage

Copy and customize this prompt for your product planning needs.

---

## The Prompt

```xml
<role>
You are a senior product strategist with 15+ years experience at top tech companies
(Apple, Stripe, Vercel). You excel at translating business goals into actionable
product specifications that engineering teams can execute on.
</role>

<context>
Company: [Company name and brief description]
Industry: [Industry/market]
Stage: [Startup/Growth/Enterprise]
Current Product: [Brief description of existing product, if any]
Target Users: [Primary user personas]
Business Model: [How the company makes money]
</context>

<task>
Create a comprehensive Product Requirements Document (PRD) for:
[Feature/Product Name]
</task>

<feature_description>
[Detailed description of what you want to build]
</feature_description>

<business_goals>
- [Goal 1: e.g., Increase user retention by 20%]
- [Goal 2: e.g., Enable enterprise sales]
- [Goal 3: e.g., Reduce support tickets]
</business_goals>

<constraints>
Technical:
- [Tech stack constraints]
- [Integration requirements]
- [Performance requirements]

Business:
- [Budget constraints]
- [Timeline constraints]
- [Resource constraints]

Regulatory:
- [Compliance requirements]
- [Privacy requirements]
</constraints>

<competitive_landscape>
Key Competitors:
- [Competitor 1]: [Their approach to this problem]
- [Competitor 2]: [Their approach]

Differentiation:
- [How we'll be different/better]
</competitive_landscape>

<output_format>
Generate a PRD with these sections:

## 1. Executive Summary
- Problem statement (2-3 sentences)
- Proposed solution (2-3 sentences)
- Key success metrics
- Timeline overview

## 2. Problem Definition
- User pain points with supporting data
- Current solutions and their limitations
- Opportunity size (TAM/SAM/SOM if applicable)

## 3. User Personas
For each persona:
- Name and role
- Goals and motivations
- Pain points
- Technical proficiency
- Key jobs to be done

## 4. User Stories & Requirements
Organized by priority (P0/P1/P2):
- User stories in format: "As a [user], I want [goal] so that [benefit]"
- Acceptance criteria for each story
- Edge cases and error states

## 5. Functional Specifications
- Feature breakdown
- User flows (described, ready for diagramming)
- Data requirements
- API requirements (if applicable)

## 6. Non-Functional Requirements
- Performance requirements
- Security requirements
- Accessibility requirements
- Scalability requirements

## 7. Success Metrics
- Primary KPIs with targets
- Secondary metrics
- Measurement methodology

## 8. Launch Strategy
- Rollout phases
- Feature flags/gradual rollout plan
- Beta/testing approach

## 9. Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|

## 10. Open Questions
- [Questions that need stakeholder input]

## Appendix
- Competitive analysis details
- Research references
- Technical feasibility notes
</output_format>

<quality_criteria>
Before finalizing, verify the PRD:
- Clearly defines the problem being solved
- Has measurable success criteria
- Includes all edge cases and error states
- Is specific enough for engineering to estimate
- Addresses security and privacy considerations
- Has a clear prioritization framework
</quality_criteria>
```

---

## Example Usage

```xml
<context>
Company: TechFlow - B2B SaaS for project management
Industry: Productivity Software
Stage: Growth (Series B, 500 customers)
Current Product: Web-based project management with basic task tracking
Target Users: Product managers, engineering leads, startup founders
Business Model: Subscription ($15-$99/user/month)
</context>

<task>
Create a comprehensive PRD for: AI-Powered Project Insights Dashboard
</task>

<feature_description>
An intelligent dashboard that analyzes project data to surface insights,
predict delays, and recommend optimizations. Uses ML to identify patterns
across tasks, team velocity, and blockers.
</feature_description>

<business_goals>
- Increase enterprise tier adoption by 30%
- Reduce churn by identifying at-risk projects early
- Differentiate from competitors with AI capabilities
</business_goals>
```

---

## Follow-Up Prompts

### For More Detail on User Flows

```xml
<previous_context>
[Paste the user stories section]
</previous_context>

<task>
Expand user story [X] into a detailed user flow with:
1. Step-by-step interactions
2. UI state at each step
3. Error handling at each step
4. Edge cases
</task>
```

### For Technical Specification

```xml
<previous_context>
[Paste functional specifications]
</previous_context>

<task>
Create technical specifications for [feature] including:
1. Data model changes
2. API endpoint designs
3. Component architecture
4. State management approach
</task>
```

### For Go-to-Market Integration

```xml
<previous_context>
[Paste PRD executive summary]
</previous_context>

<task>
Develop a go-to-market strategy that aligns with this PRD:
1. Launch messaging
2. Target customer segments for initial rollout
3. Sales enablement materials needed
4. Marketing campaign themes
</task>
```
