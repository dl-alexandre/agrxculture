/**
 * Project-Specific SEO Utilities
 *
 * This module provides SEO utilities specifically for agricultural technology projects,
 * generating rich structured data and meta tags for project showcase pages.
 */

import { generateProjectSchema, type ProjectSEO } from './seo.ts';
import { loadProjects, type ProjectData } from './content-loader.ts';

/**
 * Generate project SEO data from actual project content
 */
function generateProjectSEOData(): Record<string, ProjectSEO> {
  const projects = loadProjects();
  const seoData: Record<string, ProjectSEO> = {};

  projects.forEach(project => {
    const keywords = [
      ...project.tags,
      ...project.technologies,
      project.category.toLowerCase(),
      'agricultural technology',
    ];

    seoData[project.id] = {
      projectId: project.id,
      title: `${project.title} | Agrxculture`,
      description: project.description,
      technologies: project.technologies,
      category: project.category,
      keywords: keywords,
      metrics: project.metrics,
    };
  });

  return seoData;
}

// Project data with SEO information - dynamically generated from project content
export const projectSEOData: Record<string, ProjectSEO> = generateProjectSEOData();

/**
 * Generate comprehensive SEO data for a project page
 */
export function generateProjectPageSEO(projectId: string, siteUrl: string) {
  const project = projectSEOData[projectId];

  if (!project) {
    throw new Error(`Project SEO data not found for: ${projectId}`);
  }

  // Generate structured data
  const projectSchema = generateProjectSchema(project, siteUrl);

  // Generate additional structured data for the project
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Implement ${project.title.split(' - ')[0]}`,
    description: `Step-by-step approach to implementing ${project.category.toLowerCase()} solutions for agricultural operations`,

    totalTime: project.metrics?.timeline || '3-6 months',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: 'Custom Quote',
    },
    supply: project.technologies.map(tech => ({
      '@type': 'HowToSupply',
      name: tech,
    })),
    tool: project.technologies.map(tech => ({
      '@type': 'HowToTool',
      name: tech,
    })),
    step: [
      {
        '@type': 'HowToStep',
        name: 'Requirements Analysis',
        text: 'Analyze farm operations and identify technology integration opportunities',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'System Design',
        text: 'Design scalable architecture tailored to agricultural workflows',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Development & Testing',
        text: 'Implement solution with rigorous testing in agricultural environments',
        position: 3,
      },
      {
        '@type': 'HowToStep',
        name: 'Deployment & Training',
        text: 'Deploy system and provide comprehensive training for farm staff',
        position: 4,
      },
    ],
  };

  // Generate FAQ schema for the project
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What technologies were used in the ${project.title.split(' - ')[0]}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `This project utilized ${project.technologies.join(', ')} to create a comprehensive ${project.category.toLowerCase()} solution for agricultural operations.`,
        },
      },
      {
        '@type': 'Question',
        name: `What results were achieved with this ${project.category.toLowerCase()} solution?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The implementation achieved ${project.metrics?.improvement || 'significant operational improvements'} over a ${project.metrics?.timeline || 'development period'}, serving ${project.metrics?.scale || 'multiple agricultural operations'}.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Can this solution be customized for my farm operation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all agricultural technology solutions are customized to meet the specific needs of each farm operation, taking into account crop types, farm size, existing infrastructure, and operational workflows.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the typical implementation timeline for this type of project?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Based on this project experience, typical implementation takes ${project.metrics?.timeline || '3-6 months'} depending on farm size, complexity requirements, and integration with existing systems.`,
        },
      },
    ],
  };

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'Home', url: '/agrxculture/' },
    { name: 'Projects', url: '/showcase' },
    { name: project.title.split(' - ')[0], url: `/projects/${projectId}` },
  ];

  return {
    seoConfig: project,
    structuredData: [projectSchema, howToSchema, faqSchema],
    breadcrumbs,
  };
}

/**
 * Generate service-specific structured data
 */
export function generateServicePageSEO(siteUrl: string) {
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Agricultural Technology Services',
    description:
      'Comprehensive agricultural technology services for modern farming operations',
    url: `${siteUrl}/services`,
    numberOfItems: 5,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Service',
          name: 'IoT Integration for Farms',
          description:
            'Custom IoT sensor networks and automation systems for agricultural monitoring and control',
          provider: {
            '@type': 'Organization',
            name: 'Agrxculture',
          },
          areaServed: 'United States',
          serviceType: 'Agricultural Technology',
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Service',
          name: 'Mobile Farm Management Apps',
          description:
            'Native iOS and cross-platform mobile applications for farm operations and livestock management',
          provider: {
            '@type': 'Organization',
            name: 'Agrxculture',
          },
          areaServed: 'United States',
          serviceType: 'Mobile Development',
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Service',
          name: 'Agricultural Data Analytics',
          description:
            'Machine learning and data analytics solutions for yield optimization and farm intelligence',
          provider: {
            '@type': 'Organization',
            name: 'Agrxculture',
          },
          areaServed: 'United States',
          serviceType: 'Data Analytics',
        },
      },
      {
        '@type': 'ListItem',
        position: 4,
        item: {
          '@type': 'Service',
          name: 'Precision Agriculture APIs',
          description:
            'Backend services and API development for agricultural data integration and management',
          provider: {
            '@type': 'Organization',
            name: 'Agrxculture',
          },
          areaServed: 'United States',
          serviceType: 'API Development',
        },
      },
      {
        '@type': 'ListItem',
        position: 5,
        item: {
          '@type': 'Service',
          name: 'Farm Automation Systems',
          description:
            'End-to-end automation solutions for irrigation, monitoring, and farm operations',
          provider: {
            '@type': 'Organization',
            name: 'Agrxculture',
          },
          areaServed: 'United States',
          serviceType: 'Automation Systems',
        },
      },
    ],
  };

  const breadcrumbs = [
    { name: 'Home', url: '/agrxculture/' },
    { name: 'Services', url: '/services' },
  ];

  return {
    structuredData: [servicesSchema],
    breadcrumbs,
  };
}

/**
 * Generate showcase page structured data
 */
export function generateShowcasePageSEO(siteUrl: string) {
  const showcaseSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Agricultural Technology Project Showcase',
    description:
      'Portfolio of successful agricultural technology projects including IoT systems, mobile apps, and automation solutions',
    url: `${siteUrl}/showcase`,
    mainEntity: {
      '@type': 'ItemList',
      name: 'Agricultural Technology Projects',
      numberOfItems: Object.keys(projectSEOData).length,
      itemListElement: Object.entries(projectSEOData).map(
        ([id, project], index) => {
          const projectData = loadProjects().find(p => p.id === id);
          const item: any = {
            '@type': 'CreativeWork',
            name: project.title.split(' - ')[0],
            description: project.description,
            url: `${siteUrl}/projects/${id}`,
            creator: {
              '@type': 'Organization',
              name: 'Agrxculture',
            },
            about: project.category,
            keywords: project.technologies.join(', '),
          };
          
          if (projectData?.image) {
            item.image = `${siteUrl}${projectData.image}`;
          }
          
          return {
            '@type': 'ListItem',
            position: index + 1,
            item,
          };
        }
      ),
    },
  };

  const breadcrumbs = [
    { name: 'Home', url: '/agrxculture/' },
    { name: 'Project Showcase', url: '/showcase' },
  ];

  return {
    structuredData: [showcaseSchema],
    breadcrumbs,
  };
}
