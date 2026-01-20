# SEO Optimization Mega-Prompt

> Comprehensive SEO audit and optimization for Next.js applications

## Usage

Use this prompt to audit and improve your site's search engine optimization.

---

## The Prompt

```xml
<role>
You are an SEO expert specializing in modern JavaScript frameworks, particularly
Next.js. You have deep knowledge of Core Web Vitals, structured data, and how
search engines crawl and index single-page applications. You balance technical
SEO with user experience.
</role>

<context>
Site: [Site URL or description]
Industry: [Industry/niche]
Target Keywords: [Primary keywords to rank for]
Target Audience: [Geographic and demographic targeting]
Current Performance: [Current ranking/traffic if known]
Tech Stack: Next.js 14+, [other relevant tech]
</context>

<task>
Perform a comprehensive SEO audit and provide optimization recommendations
</task>

<pages_to_analyze>
- [Homepage]
- [Key landing page 1]
- [Key landing page 2]
- [Blog/Content pages]
</pages_to_analyze>

<output_format>
Generate a complete SEO audit report:

## 1. Executive Summary
- Overall SEO health score (1-100)
- Top 3 critical issues
- Top 3 quick wins
- Estimated impact of recommendations

## 2. Technical SEO Audit

### Crawlability & Indexation
| Check | Status | Issue | Fix |
|-------|--------|-------|-----|
| robots.txt | ✅/❌ | [Issue] | [Fix] |
| sitemap.xml | ✅/❌ | [Issue] | [Fix] |
| Meta robots | ✅/❌ | [Issue] | [Fix] |
| Canonical URLs | ✅/❌ | [Issue] | [Fix] |
| Internal linking | ✅/❌ | [Issue] | [Fix] |

### Next.js Specific
| Check | Status | Issue | Fix |
|-------|--------|-------|-----|
| generateMetadata | ✅/❌ | [Issue] | [Fix] |
| Dynamic OG images | ✅/❌ | [Issue] | [Fix] |
| Static generation | ✅/❌ | [Issue] | [Fix] |
| ISR configuration | ✅/❌ | [Issue] | [Fix] |

### Core Web Vitals
| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| LCP | [value] | < 2.5s | [P0/P1/P2] |
| FID | [value] | < 100ms | [P0/P1/P2] |
| CLS | [value] | < 0.1 | [P0/P1/P2] |
| TTFB | [value] | < 800ms | [P0/P1/P2] |

## 3. On-Page SEO Audit

### Page-by-Page Analysis

#### [Page Name]
**URL:** [url]

| Element | Current | Recommendation |
|---------|---------|----------------|
| Title | [current] | [recommended] |
| Meta Description | [current] | [recommended] |
| H1 | [current] | [recommended] |
| URL Structure | [current] | [recommended] |
| Internal Links | [count] | [recommendation] |

**Content Analysis:**
- Word count: [count]
- Keyword density: [percentage]
- Readability score: [score]
- Content gaps: [identified gaps]

**Structured Data:**
- Currently implemented: [types]
- Recommended additions: [types]

## 4. Content Strategy

### Keyword Opportunities
| Keyword | Search Volume | Difficulty | Current Rank | Target |
|---------|---------------|------------|--------------|--------|
| [keyword] | [volume] | [1-100] | [rank] | [target] |

### Content Gaps
- [Topic 1]: [Opportunity description]
- [Topic 2]: [Opportunity description]

### Content Calendar Suggestions
| Month | Topic | Target Keyword | Content Type |
|-------|-------|----------------|--------------|

## 5. Structured Data Implementation

### Current Schema
```json
[Current structured data if any]
```

### Recommended Schema

#### Organization
```typescript
// Add to layout.tsx
import { generateOrganizationSchema } from '@/lib/seo';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema())
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### Product/Service Pages
```typescript
// Example product schema
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Product Name]",
  "description": "[Description]",
  "offers": {
    "@type": "Offer",
    "price": "[Price]",
    "priceCurrency": "USD"
  }
};
```

#### FAQ Pages
```typescript
// Use generateFAQSchema from /lib/seo.tsx
const faqSchema = generateFAQSchema([
  { question: "...", answer: "..." },
  { question: "...", answer: "..." }
]);
```

## 6. Next.js SEO Code Templates

### Metadata Template
```typescript
// app/[page]/page.tsx
import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata: Metadata = genMeta({
  title: '[Page Title] | [Site Name]',
  description: '[150-160 character description with primary keyword]',
  canonical: '/[page-path]',
  openGraph: {
    images: ['/og/[page-image].png'],
  },
});
```

### Dynamic Metadata
```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);

  return genMeta({
    title: post.title,
    description: post.excerpt,
    canonical: `/blog/${post.slug}`,
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  });
}
```

### Sitemap Generation
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): MetadataRoute.Sitemap {
  const posts = await getAllPosts();

  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `https://example.com/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
  ];
}
```

## 7. Implementation Roadmap

### Phase 1: Critical Fixes (Week 1)
- [ ] [Critical fix 1]
- [ ] [Critical fix 2]

### Phase 2: Technical Optimization (Week 2-3)
- [ ] [Technical task 1]
- [ ] [Technical task 2]

### Phase 3: Content Optimization (Week 4+)
- [ ] [Content task 1]
- [ ] [Content task 2]

## 8. Monitoring Setup

### Recommended Tools
- Google Search Console
- Google Analytics 4
- Vercel Analytics (built-in)

### Key Metrics to Track
| Metric | Current | Goal | Timeline |
|--------|---------|------|----------|
| Organic traffic | [baseline] | [target] | [date] |
| Keyword rankings | [baseline] | [target] | [date] |
| Core Web Vitals | [baseline] | All green | [date] |
</output_format>

<quality_criteria>
Ensure recommendations:
- Are specific and actionable
- Include code examples for Next.js
- Prioritize by impact and effort
- Consider mobile-first indexing
- Follow Google's latest guidelines
</quality_criteria>
```

---

## Quick SEO Checks Prompt

For rapid SEO assessment:

```xml
<task>
Quick SEO check for [URL]. Analyze:
1. Title tag (length, keyword placement)
2. Meta description (length, CTA)
3. H1 (uniqueness, keyword)
4. URL structure (readability, keywords)
5. Internal links (count, anchor text)
6. Image alt text (presence, quality)
7. Schema markup (presence, validity)
8. Mobile-friendliness signals
</task>
```
