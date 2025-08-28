/**
 * SEO Utilities for Agricultural Portfolio Website
 * 
 * This module provides utilities for generating SEO metadata, structured data,
 * and social media tags for the agricultural technology portfolio.
 */

export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

export interface ProjectSEO extends SEOConfig {
  projectId: string;
  technologies: string[];
  category: string;
  metrics?: {
    improvement?: string;
    timeline?: string;
    scale?: string;
  };
}

export interface ServiceSEO extends SEOConfig {
  serviceId: string;
  applications: string[];
  relatedProjects?: string[];
}

/**
 * Generate comprehensive meta tags for a page
 */
export function generateMetaTags(config: SEOConfig, siteUrl: string): string {
  const {
    title,
    description,
    canonical,
    image = '/images/og-default.jpg',
    imageAlt = 'Agrxculture - Agricultural Technology Company',
    type = 'website',
    publishedTime,
    modifiedTime,
    author = 'Agrxculture',
    keywords = [],
    noindex = false,
    nofollow = false
  } = config;

  const canonicalUrl = canonical || siteUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  
  // Base agricultural technology keywords
  const baseKeywords = [
    'agricultural technology',
    'precision agriculture',
    'farm management systems',
    'IoT agriculture',
    'agricultural software developer',
    'farm automation',
    'agricultural data analytics',
    'mobile farm apps'
  ];
  
  const allKeywords = [...baseKeywords, ...keywords].join(', ');
  
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
    'max-snippet:-1',
    'max-image-preview:large',
    'max-video-preview:-1'
  ].join(', ');

  return `
    <!-- Primary Meta Tags -->
    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${allKeywords}" />
    <meta name="author" content="${author}" />
    <meta name="robots" content="${robotsContent}" />
    <link rel="canonical" href="${canonicalUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${fullImageUrl}" />
    <meta property="og:image:alt" content="${imageAlt}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="Agrxculture - Agricultural Technology" />
    ${publishedTime ? `<meta property="article:published_time" content="${publishedTime}" />` : ''}
    ${modifiedTime ? `<meta property="article:modified_time" content="${modifiedTime}" />` : ''}
    ${author ? `<meta property="article:author" content="${author}" />` : ''}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${fullImageUrl}" />
    <meta name="twitter:image:alt" content="${imageAlt}" />
    <meta name="twitter:creator" content="@agrxculture" />
    <meta name="twitter:site" content="@agrxculture" />
  `.trim();
}

/**
 * Generate structured data for the main website/person
 */
export function generateOrganizationSchema(siteUrl: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Agrxculture",
    "description": "Agricultural technology company specializing in precision agriculture IoT solutions and farm management technology",
    "url": siteUrl,
    "image": `${siteUrl}/images/hero/agrxculture-logo.webp`,
    "sameAs": [
      "https://linkedin.com/company/agrxculture",
      "https://github.com/agrxculture"
    ],
    "knowsAbout": [
      "Precision Agriculture",
      "IoT Development", 
      "Farm Management Systems",
      "Agricultural Data Analytics",
      "Mobile App Development",
      "Swift Programming",
      "Python Development",
      "Agricultural Automation",
      "Sensor Networks",
      "Farm Technology Integration"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Agricultural Technology Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "IoT Integration for Farms",
            "category": "Agricultural Technology"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mobile Farm Management Apps",
            "category": "Mobile Development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Agricultural Data Analytics",
            "category": "Data Analytics"
          }
        }
      ]
    }
  };
}

/**
 * Generate structured data for a project/creative work
 */
export function generateProjectSchema(project: ProjectSEO, siteUrl: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "url": `${siteUrl}/projects/${project.projectId}`,
    "image": project.image ? `${siteUrl}${import.meta.env.BASE_URL}${project.image.startsWith('/') ? project.image.slice(1) : project.image}` : `${siteUrl}${import.meta.env.BASE_URL}images/showcase/${project.projectId}.jpg`,
    "creator": {
      "@type": "Organization",
      "name": "Agrxculture",
      "url": siteUrl
    },
    "about": {
      "@type": "Thing",
      "name": "Agricultural Technology",
      "description": project.category
    },
    "keywords": [
      ...project.technologies,
      project.category,
      "agricultural technology",
      "precision agriculture"
    ].join(", "),
    "genre": "Agricultural Technology",
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "learningResourceType": "Case Study",
    "educationalUse": "Professional Development",
    "audience": {
      "@type": "Audience", 
      "audienceType": "Agricultural Professionals"
    }
  };
}

/**
 * Generate structured data for a service offering
 */
export function generateServiceSchema(service: ServiceSEO, siteUrl: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "url": `${siteUrl}/services#${service.serviceId}`,
    "provider": {
      "@type": "Organization",
      "name": "Agrxculture",
      "url": siteUrl
    },
    "serviceType": "Agricultural Technology Development",
    "category": "Technology Services",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Agricultural Operations"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Agricultural Technology Services",
      "itemListElement": service.applications.map((app, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": app,
          "category": "Agricultural Technology"
        },
        "position": index + 1
      }))
    }
  };
}

/**
 * Generate structured data for the website organization
 */
export function generateWebsiteSchema(siteUrl: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Agrxculture - Agricultural Technology",
    "description": "Precision agriculture IoT solutions and farm management technology expertise",
    "url": siteUrl,
    "author": {
      "@type": "Organization",
      "name": "Agrxculture"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Agrxculture"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/showcase?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Agricultural Technology Services",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "IoT Integration",
          "url": `${siteUrl}/services#iot`
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": "Mobile Farm Apps",
          "url": `${siteUrl}/services#mobile`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Data Analytics",
          "url": `${siteUrl}/services#analytics`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "API Development", 
          "url": `${siteUrl}/services#apis`
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "Farm Automation",
          "url": `${siteUrl}/services#automation`
        }
      ]
    }
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>, siteUrl: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url.startsWith('http') ? crumb.url : `${siteUrl}${crumb.url}`
    }))
  };
}

/**
 * Generate FAQ structured data for services
 */
export function generateFAQSchema(faqs: Array<{question: string, answer: string}>): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Default SEO configurations for different page types
 */
export const defaultSEOConfigs = {
  home: {
    title: "Agrxculture - Agricultural Technology Company | Precision Agriculture IoT Solutions",
    description: "Precision agriculture IoT solutions and farm management technology expertise. Custom mobile apps, data analytics, and automation systems for modern farming operations.",
    keywords: ["agricultural software developer", "precision agriculture", "farm IoT developer", "agricultural technology consultant"]
  },
  
  about: {
    title: "About Agrxculture - Agricultural Technology Company | Farm Innovation Specialists", 
    description: "Learn about Agrxculture's expertise in agricultural technology, precision farming solutions, and farm management systems. Specializing in IoT integration and mobile development.",
    keywords: ["agricultural technology expert", "farm technology specialist", "precision agriculture developer"]
  },
  
  services: {
    title: "Agricultural Technology Services | IoT Integration & Farm Management Solutions",
    description: "Professional agricultural technology services including IoT integration, mobile farm apps, data analytics, and automation systems for modern farming operations.",
    keywords: ["agricultural technology services", "farm IoT integration", "agricultural software development", "farm management systems"]
  },
  
  showcase: {
    title: "Agricultural Technology Projects | Farm Management & IoT Case Studies",
    description: "Explore successful agricultural technology projects including farm sensor networks, mobile management apps, irrigation automation, and yield analytics systems.",
    keywords: ["agricultural technology projects", "farm management case studies", "agricultural IoT examples", "precision agriculture portfolio"]
  },
  
  contact: {
    title: "Contact Agrxculture | Agricultural Technology Consultation",
    description: "Get in touch for agricultural technology consultation, custom farm management solutions, IoT integration, and precision agriculture development services.",
    keywords: ["agricultural technology consultation", "farm technology developer contact", "precision agriculture services"]
  }
};

/**
 * Generate complete SEO package for a page
 */
export function generatePageSEO(
  pageType: keyof typeof defaultSEOConfigs,
  customConfig: Partial<SEOConfig> = {},
  siteUrl: string
): {
  metaTags: string;
  structuredData: object[];
  canonical?: string;
} {
  const baseConfig = defaultSEOConfigs[pageType];
  const config = { ...baseConfig, ...customConfig };
  
  const metaTags = generateMetaTags(config, siteUrl);
  const structuredData = [
    generateOrganizationSchema(siteUrl),
    generateWebsiteSchema(siteUrl)
  ];
  
  const result: { metaTags: string; structuredData: object[]; canonical?: string } = { metaTags, structuredData };
  if (config.canonical) {
    result.canonical = config.canonical;
  }
  return result;
}