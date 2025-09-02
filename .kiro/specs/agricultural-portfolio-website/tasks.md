# Implementation Plan

**Technology Decision**: Using Astro instead of Vapor SSG for better static site generation, GitHub Pages compatibility, and superior performance for portfolio sites. This requires removing existing Vapor dependencies and restructuring the project as a static site.

## Phase 1: MVP Core Site

- [x] 1. Set up project structure and development environment
  - Remove existing Vapor dependencies and Swift-specific files
  - Initialize Astro project with TypeScript configuration
  - Configure Vite build tools and PostCSS for styling optimization
  - Set up ESLint, Prettier, and TypeScript strict mode for type safety
  - Configure environment variables (dev vs. prod)
  - Create design tokens file for consistent breakpoints and colors (including 480px for low-end mobile)
  - _Requirements: All requirements depend on proper project setup_

- [x] 2. Create core layout and navigation system
  - Implement base layout component with header, main, and footer structure
  - Build responsive navigation component with mobile hamburger menu
  - Add ARIA labels, keyboard navigation, and skip-to-content link
  - Include search icon in header for quick project filtering
  - Implement sticky navigation for tablet views with browser support fallback
  - Add print-friendly CSS for portfolio printing
  - _Requirements: 1.4, 5.4_

- [x] 3. Implement hero section with agricultural branding
  - Create hero component with optimized agricultural background imagery (< 300KB for mobile)
  - Add professional headshot and value proposition text
  - Implement primary CTA button linking to services
  - Add parallax effect with motion-reduction preference and low-end mobile fallback
  - Configure responsive image sets and compression at build time
  - _Requirements: 1.1, 1.3, 5.4_

- [x] 4. Build about section showcasing developer expertise
  - Create about component with developer background content
  - Implement agricultural technology expertise highlights
  - Add technical skills section with agricultural applications
  - Include educational background and certifications display
  - Add downloadable PDF resume link for offline access
  - Add schema.org Person markup for SEO visibility
  - _Requirements: 1.1, 1.2_

- [x] 5. Complete services section implementation
  - Replace placeholder content in services page with full service showcase
  - Integrate Services component into dedicated services page
  - Add service detail pages or expanded modal views for each service
  - Ensure proper navigation between services and related projects
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 6. Create project showcase with filtering capabilities
  - Build project card components with expandable case studies
  - Implement client-side tag-based filtering system (IoT, Mobile, Analytics, API)
  - Add "featured project" badge to highlight the strongest case study
  - Add project data structure with metrics and outcomes
  - Create hybrid case study approach: modal for quick view + dedicated linkable pages for SEO
  - Include links to demos and GitHub repositories
  - Add schema.org CreativeWork markup for projects
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 7. Configure contact form for production use
  - Set up Formspree account and replace placeholder form action URL
  - Configure reCAPTCHA v3 with proper site key or remove placeholder
  - Test form submission end-to-end with real email delivery
  - Add proper error handling for form submission failures
  - Verify spam protection is working correctly
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 8. Implement responsive design and mobile optimization
  - Create CSS Grid and Flexbox layouts using design tokens for consistency
  - Implement responsive breakpoints (480px for low-end mobile, 768px tablet, 1024px+ desktop)
  - Add touch-friendly navigation and interaction elements
  - Optimize images with srcset and WebP format with PNG fallbacks
  - Test on device lab (Android + iOS, including low-end devices common in rural areas)
  - _Requirements: 1.4, 5.1, 5.3_

- [x] 9. Add performance optimizations and accessibility features
  - Implement lazy loading using IntersectionObserver for reduced JavaScript overhead
  - Add WebP image optimization pipeline with fallbacks
  - Configure CSS and JavaScript minification and bundling
  - Implement skeleton screens with CLS validation via Lighthouse
  - Add basic static asset caching (no full PWA for MVP)
  - _Requirements: 5.1, 5.2, 5.4_

- [x] 10. Implement SEO optimization and metadata
  - Add automated meta tag generation from frontmatter/data models
  - Implement Open Graph tags and Twitter Card tags for broader social media support
  - Add schema.org structured data for all content types
  - Create XML sitemap and robots.txt files
  - Add canonical URLs to prevent duplicate content
  - Add favicon package and app icons for mobile devices
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 11. Set up deployment pipeline and GitHub Actions CI/CD
  - Configure GitHub Actions workflow (.github/workflows/deploy.yml) for automated builds on push to main
  - Set up Node.js environment and Astro build process in GitHub Actions
  - Implement cache headers for static assets (1 year) and HTML (1 hour)
  - Add staging environment for pre-deployment testing
  - Configure automated deployment to gh-pages branch with auto-revert on failure
  - Add deployment verification (Lighthouse run, broken link check) before publish
  - Set up custom domain with SSL certificate
  - _Requirements: 5.2, 6.4_

- [x] 12. Create comprehensive test suite
  - Write unit tests for form validation and interactive components
  - Implement accessibility testing with axe-core
  - Add performance testing with Lighthouse automation
  - Add end-to-end tests with Playwright for critical user flows (form submission, navigation)
  - Create cross-browser testing for farm-region devices (low-end Android)
  - Add regression testing after deployments
  - _Requirements: 4.2, 4.3, 5.1, 5.4_

- [x] 13. Add content management and data integration
  - Create Markdown + frontmatter files for projects and services (easier editing)
  - Consider Contentlayer integration for easier content updates by non-technical users
  - Implement automated schema validation in CI pipeline
  - Add build-time content processing and optimization
  - Create content update workflow and documentation
  - _Requirements: 2.1, 2.2, 3.1, 3.2_

- [x] 14. Add testimonials and social proof elements
  - Create testimonial component with client details and industry information
  - Implement testimonial carousel for improved visibility without clutter
  - Implement testimonial data structure with photos and project links
  - Add testimonials to relevant project showcases
  - Include schema.org Review markup for search engine benefits
  - _Enhancement for credibility and SEO (not in original requirements)_

## Phase 2: Content Cleanup and Agrxculture Rebranding

- [x] 15. Rebrand site from personal portfolio to Agrxculture
  - Update all references from "Dalton Alexandre" to "Agrxculture" throughout the site
  - Change hero section to focus on Agrxculture rather than individual developer
  - Update navigation, footer, and all page titles to reflect Agrxculture branding
  - Modify SEO metadata and structured data to represent Agrxculture instead of person
  - Update contact information to use Agrxculture email and details
  - _Requirements: 1.1, 1.3, 6.1, 6.2_

- [x] 16. Remove PII and inaccurate project information
  - Remove personal headshot images and replace with Agrxculture logo/branding
  - Delete made-up project data from projects.json and replace with placeholder content
  - Remove fabricated testimonials and client information from testimonials.json
  - Clean up case study PDFs and demo links that contain inaccurate information
  - Remove personal resume download and replace with Agrxculture information
  - _Requirements: 1.2, 2.1, 2.2, 2.3, 2.4_

- [x] 17. Update About section to Agrxculture information
  - Rewrite About component to describe Agrxculture instead of individual
  - Replace personal background with Agrxculture mission and expertise
  - Update schema.org markup from Person to Organization type
  - Remove personal education/certification details
  - Focus on Agrxculture capabilities and agricultural technology specialization
  - _Requirements: 1.1, 1.2_

- [x] 18. Clean up services and contact information
  - Update services descriptions to reflect Agrxculture offerings rather than personal services
  - Modify contact form to collect business inquiries for Agrxculture
  - Update contact methods to use Agrxculture email and professional channels
  - Remove personal LinkedIn/GitHub references and replace with Agrxculture social media
  - Ensure all CTAs and messaging reflect Agrxculture positioning
  - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2_

- [ ] 19. Clean up remaining personal domain references and placeholder content
  - Update astro.config.mjs site URL from personal GitHub to Agrxculture domain
  - Replace all hardcoded "dl-alexandre.github.io" references with proper site configuration
  - Remove placeholder project content and replace with professional "Coming Soon" messaging
  - Clean up testimonials.json to remove placeholder testimonial content
  - Update reCAPTCHA placeholder in contact form with proper implementation or removal
  - _Requirements: 1.1, 1.3, 2.1, 2.2, 4.1, 6.1, 6.4_

- [ ] 20. Final production deployment and validation
  - Configure production deployment with Agrxculture domain and branding
  - Test all forms and contact methods with Agrxculture information
  - Run final accessibility and performance audits (target: 90+ Lighthouse scores)
  - Validate that all branding consistently represents Agrxculture
  - Verify no PII or inaccurate information remains in the codebase
  - _Requirements: 4.3, 4.4, 5.1, 5.2, 5.4, 6.4_
