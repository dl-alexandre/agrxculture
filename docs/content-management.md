# Content Management Guide

This guide explains how to manage content for the agricultural portfolio website using the Markdown + frontmatter system.

## Overview

The website uses a content management system based on Markdown files with YAML frontmatter. This approach provides:

- **Easy editing**: Content can be edited in any text editor
- **Version control**: All content changes are tracked in Git
- **Type safety**: Automated validation ensures content structure consistency
- **Build-time optimization**: Content is processed and optimized during build

## Content Structure

```
src/content/
├── projects/           # Project case studies
│   ├── project-1.md
│   ├── project-2.md
│   └── ...
└── services/           # Service offerings
    ├── service-1.md
    ├── service-2.md
    └── ...
```

## Project Content Format

Each project is a Markdown file with the following frontmatter structure:

```yaml
---
id: unique-project-id
title: Project Title
description: Brief project description for cards and SEO
image: /images/showcase/project-image.jpg
technologies:
  - Python
  - Swift
  - PostgreSQL
category: IoT Integration | Mobile Development | Data Analytics | Automation
tags:
  - IoT
  - Analytics
  - API
dateCompleted: YYYY-MM-DD
featured: true | false
metrics:
  improvement: "30% reduction in water usage"
  timeline: "4 months"
  scale: "500+ acres monitored"
links:
  demo: https://demo-url.com (optional)
  github: https://github.com/repo (optional)
pdfDownload: /documents/case-study.pdf (optional)
schema:
  type: CreativeWork
  name: Project Name
  description: Project description for schema.org
  creator:
    type: Organization
    name: Agrxculture
  dateCreated: YYYY-MM-DD
  keywords: Comma, Separated, Keywords
---

## Problem

Describe the problem or challenge that the project addressed.

## Solution

Explain the technical solution and implementation approach.

## Outcome

Detail the results, metrics, and impact achieved.
```## Servi
ce Content Format

Each service is a Markdown file with the following frontmatter structure:

```yaml
---
id: unique-service-id
title: Service Title
description: Service description for cards and SEO
icon: icon-name
technologies:
  - Python
  - Swift
  - PostgreSQL
benefits: "Key benefit statement with metrics"
relatedProjects:
  - project-id-1
  - project-id-2
ctaLink: /contact?service=service-id
schema:
  type: Service
  name: Service Name
  description: Service description for schema.org
  provider:
    type: Organization
    name: Agrxculture
  serviceType: Service Category
  areaServed: Agricultural Operations
---

## Applications

- **Application 1** - Description of specific use case
- **Application 2** - Description of specific use case
- **Application 3** - Description of specific use case

## How It Works

Detailed explanation of the service delivery process and technical approach.

## Benefits

- Benefit 1 with specific metrics
- Benefit 2 with measurable outcomes
- Benefit 3 with value proposition
```

## Content Validation

The system includes automated validation to ensure content quality:

### Required Fields

**Projects:**
- `id`, `title`, `description`, `image`, `category`, `dateCompleted`
- `technologies` (array), `tags` (array)
- `metrics` object with `improvement`, `timeline`, `scale`
- `schema` object with proper structure

**Services:**
- `id`, `title`, `description`, `icon`, `benefits`, `ctaLink`
- `technologies` (array), `relatedProjects` (array)
- `schema` object with proper structure

### Validation Commands

```bash
# Validate all content
npm run validate-content

# Process content for build
npm run process-content

# Full build with content processing
npm run build
```

## Content Update Workflow

### Adding New Projects

1. Create a new Markdown file in `src/content/projects/`
2. Use the project template above
3. Add project image to `Public/images/showcase/`
4. Add case study PDF to `Public/documents/` (optional)
5. Run validation: `npm run validate-content`
6. Test locally: `npm run dev`
7. Commit and push changes

### Adding New Services

1. Create a new Markdown file in `src/content/services/`
2. Use the service template above
3. Update related projects to reference the new service
4. Run validation: `npm run validate-content`
5. Test locally: `npm run dev`
6. Commit and push changes

### Updating Existing Content

1. Edit the relevant Markdown file
2. Maintain the frontmatter structure
3. Run validation: `npm run validate-content`
4. Test changes locally: `npm run dev`
5. Commit and push changes

## Best Practices

### Content Quality

- **Metrics**: Always include specific, measurable outcomes
- **Keywords**: Use relevant agricultural and technical terms
- **Images**: Optimize images for web (WebP format, < 500KB)
- **Links**: Ensure all external links are working and relevant

### SEO Optimization

- **Titles**: Keep under 60 characters for search results
- **Descriptions**: 150-160 characters for meta descriptions
- **Keywords**: Include relevant terms naturally in content
- **Schema**: Maintain proper structured data markup

### Performance

- **Images**: Use appropriate image sizes and formats
- **Content Length**: Keep case studies concise but comprehensive
- **Links**: Minimize external dependencies

## Troubleshooting

### Validation Errors

Common validation errors and solutions:

```bash
# Missing required field
Error: Missing required field: technologies
Solution: Add technologies array to frontmatter

# Invalid date format
Error: Invalid date format for dateCompleted
Solution: Use YYYY-MM-DD format (e.g., 2024-01-15)

# Invalid array format
Error: Technologies must be an array
Solution: Use YAML array syntax with dashes
```

### Build Issues

```bash
# Content processing failed
npm run validate-content  # Check for validation errors
npm run process-content   # Process content manually

# Missing dependencies
npm ci                    # Reinstall dependencies

# File not found errors
# Check file paths are relative to project root
# Ensure images exist in Public/images/
```

## Automation

### CI/CD Integration

Content validation runs automatically in GitHub Actions:

1. **Content Validation**: Runs on every push/PR
2. **Build Process**: Includes content processing
3. **Deployment**: Only deploys if validation passes

### Local Development

```bash
# Watch for content changes during development
npm run dev

# Validate before committing
npm run validate-content

# Full build test
npm run build
```

This system ensures content quality while maintaining ease of editing and version control.