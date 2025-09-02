---
inclusion: always
---

---
inclusion: always
---

# AgrXculture Portfolio - Product Guidelines

## Brand Identity & Messaging

**Company**: AgrXculture - Precision agriculture IoT solutions  
**Tagline**: "Building data-driven farms for a more productive tomorrow"  
**Voice**: Professional yet approachable, results-focused, farmer-centric

### Content Writing Rules
- Use agricultural terminology correctly: precision agriculture, farm management, IoT sensors, yield optimization
- Always include quantifiable metrics: percentage improvements, cost savings, efficiency gains
- Focus on measurable farm improvements and ROI
- Avoid technical jargon - make content accessible to farmers

## Content Structure Requirements

### Projects (`src/content/projects/`)
Required frontmatter fields:
```yaml
title: "Descriptive Project Name"
description: "Brief outcome-focused description"
image: "/images/showcase/project-image.jpg"
technologies: ["IoT", "Mobile App", "Data Analytics"]
category: "precision-agriculture" | "farm-management" | "automation"
```

Content must include:
- Measurable outcomes (yield improvements, cost savings)
- Technologies used and their agricultural applications
- Client type (Small Farm, Cooperative, Large Operation)
- Implementation timeline and results

### Services (`src/content/services/`)
Required frontmatter fields:
```yaml
title: "Service Name"
description: "Value-focused service description"
category: "iot-integration" | "mobile-apps" | "data-analytics" | "api-development" | "automation-systems"
```

Content must specify:
- Target farm size and operation type
- Implementation timeline and expected ROI
- Key benefits with agricultural context

### Testimonials (`src/data/testimonials.json`)
Required fields:
- Client name and farm/company type
- Quantifiable results achieved
- Specific technology or service used
- Location (for credibility)

## SEO & Content Strategy

### Primary Keywords
- Precision agriculture solutions
- Farm management technology  
- Agricultural IoT integration
- Farm data analytics
- Agricultural mobile applications

### Meta Requirements
- All pages must use `SEOHead.astro` with agricultural keywords
- Include structured data for agricultural business schema
- Optimize for mobile-first indexing (rural internet considerations)
- Use location-based keywords for target markets

## Component Usage Rules

### Images
- Always use `ResponsiveImage.astro` for project/service images
- Use `LazyImage.astro` for below-the-fold content
- Alt text must describe agricultural context and technology
- Optimize for mobile viewing in field conditions

### Performance
- Target Lighthouse scores: 90+ across all metrics
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Implement offline capability for core content (rural connectivity)
- Use service worker caching for agricultural content

## Design Standards

### Mobile-First Agricultural Context
- High contrast design for outdoor viewing
- Touch targets minimum 48px (equipment operator gloves)
- Fast loading for rural internet connections
- Keyboard navigation support

### Visual Hierarchy
1. Hero section - agricultural technology expertise
2. Services showcase - clear value propositions
3. Project portfolio - visual case studies with metrics
4. Client testimonials - credibility indicators

## Content Validation Checklist

When creating or editing content:
- [ ] Includes measurable agricultural improvements
- [ ] Uses appropriate agricultural terminology
- [ ] Specifies target farm operations
- [ ] Contains quantifiable results/metrics
- [ ] Optimized for mobile/field viewing
- [ ] Includes proper SEO meta tags
- [ ] Follows accessibility standards (WCAG 2.1 AA)

## File Naming Conventions
- Project IDs: `farm-management-ios`, `farm-sensor-network` (kebab-case)
- Service IDs: `iot-integration`, `data-analytics` (kebab-case)
- Images: descriptive names with agricultural context
- Use consistent naming across content collections