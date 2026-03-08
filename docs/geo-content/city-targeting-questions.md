# City Targeting — Review & Customize

## Current Starter Cities

We've set up geo landing pages for 20 locations (19 cities + 1 "online" page), mapped to the 6 timezones your schedule already supports:

| Timezone | Cities | Schedule Column |
|----------|--------|-----------------|
| Pacific Time | San Francisco, Los Angeles | `sanJose` |
| Colombia / Central | Bogotá, Mexico City | `bogota` |
| Eastern Time | New York, Miami, Toronto | `newYork` |
| Brasília Time | São Paulo, Rio de Janeiro, Buenos Aires | `brasilia` |
| GMT | London, Lisbon | `london` |
| CET | Madrid, Barcelona, Paris, Berlin, Paphos | `madrid` |

Plus: **Online** (catch-all for non-geo searches like "meditation course online")

---

## Questions for You

1. **Which cities have the most students right now?** We want to prioritize those — maybe add more content, testimonials, or local event info.

2. **Where do you want to grow?** Any cities or regions we should add? Some ideas:
   - US: Austin, Denver, Chicago, Seattle, Portland, San Diego
   - Latin America: Lima, Medellín, Santiago, Montevideo
   - Europe: Amsterdam, Rome, Athens, Zurich, Vienna
   - Other: Dubai, Tel Aviv, Sydney, Melbourne

3. **Any cities to remove?** If a city has zero students and zero growth interest, we can drop it.

4. **Languages:** Some geo pages include bilingual intros (English + local language) for Latin America, Brazil, Spain, France. Is that the right approach? Should we add more languages?

5. **Local events:** Do you ever hold in-person events in specific cities? If so, we can add an "In-Person Events" section to those geo pages.

---

## How to Add a New City

Adding a new city is simple — just add an entry to `src/lib/data/geo-data.ts`:

```typescript
{
  id: 'seattle',
  slug: 'seattle',
  city: 'Seattle',
  region: 'Washington',
  country: 'United States',
  timezoneKey: 'sanJose',  // Maps to Pacific Time schedule column
  timezoneLabel: 'Pacific Time (PT)',
  intro: 'Join Rose Meditation and Aura Reading courses from Seattle...',
  keywords: ['meditation classes seattle', 'aura reading course seattle', ...],
}
```

The page at `/meditation/seattle` will be automatically generated with:
- Unique title & meta description
- The intro paragraph you wrote
- Schedule filtered to Pacific Time
- FAQ section with schema markup
- Course structured data
- Included in the sitemap
