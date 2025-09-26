import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  tags: string[];
  dateCompleted: string;
  featured: boolean;
  metrics: {
    improvement: string;
    timeline: string;
    scale: string;
  };
  links: {
    demo?: string;
    github?: string;
  };
  pdfDownload?: string;
  schema: {
    type: string;
    name: string;
    description: string;
    creator: {
      type: string;
      name: string;
    };
    dateCreated: string;
    keywords: string;
  };
  content: string;
}

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  icon: string;
  technologies: string[];
  applications: string[];
  benefits: string;
  relatedProjects: string[];
  ctaLink: string;
  schema: {
    type: string;
    name: string;
    description: string;
    provider: {
      type: string;
      name: string;
    };
    serviceType: string;
    areaServed: string;
  };
  content: string;
}

export interface TestimonialData {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  clientIndustry: string;
  testimonial: string;
  photo?: string;
  projectId?: string;
  rating: number;
  dateGiven: string;
} /**

 * Load all project content from Markdown files
 */
export function loadProjects(): ProjectData[] {
  const projectsDir = join(process.cwd(), 'src/content/projects');
  const filenames = readdirSync(projectsDir);

  return filenames
    .filter(name => name.endsWith('.md'))
    .map(filename => {
      const filePath = join(projectsDir, filename);
      const fileContents = readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        ...data,
        content,
      } as ProjectData;
    })
    .sort((a, b) => {
      // Sort by featured first, then by date
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (
        new Date(b.dateCompleted).getTime() -
        new Date(a.dateCompleted).getTime()
      );
    });
}

/**
 * Load a single project by ID
 */
export function loadProject(id: string): ProjectData | null {
  try {
    const filePath = join(process.cwd(), 'src/content/projects', `${id}.md`);
    const fileContents = readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      ...data,
      content,
    } as ProjectData;
  } catch (error) {
    return null;
  }
}

/**
 * Load all service content from Markdown files
 */
export function loadServices(): ServiceData[] {
  const servicesDir = join(process.cwd(), 'src/content/services');
  const filenames = readdirSync(servicesDir);

  return filenames
    .filter(name => name.endsWith('.md'))
    .map(filename => {
      const filePath = join(servicesDir, filename);
      const fileContents = readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      // Extract applications from markdown content
      const applications = extractApplicationsFromContent(content);

      return {
        ...data,
        applications,
        content,
      } as ServiceData;
    });
}

/**
 * Extract applications list from markdown content
 */
function extractApplicationsFromContent(content: string): string[] {
  const applicationsMatch = content.match(
    /## Applications\s*\n\n((?:- \*\*[^*]+\*\* - [^\n]+\n?)+)/
  );
  if (!applicationsMatch) return [];

  const applicationsText = applicationsMatch[1] || '';
  const applications = applicationsText
    .split('\n')
    .filter(line => line.trim().startsWith('- **'))
    .map(line => {
      // Extract just the title part (before the dash)
      const match = line.match(/- \*\*([^*]+)\*\*/);
      return match ? match[1] : '';
    })
    .filter((app): app is string => Boolean(app));

  return applications;
}

/**
 * Load a single service by ID
 */
export function loadService(id: string): ServiceData | null {
  try {
    const filePath = join(process.cwd(), 'src/content/services', `${id}.md`);
    const fileContents = readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Extract applications from markdown content
    const applications = extractApplicationsFromContent(content);

    return {
      ...data,
      applications,
      content,
    } as ServiceData;
  } catch (error) {
    return null;
  }
}

/**
 * Load all testimonials from JSON data
 */
export function loadTestimonials(): TestimonialData[] {
  try {
    const filePath = join(process.cwd(), 'src/data/testimonials.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const testimonials = JSON.parse(fileContents) as TestimonialData[];

    return testimonials.sort((a, b) => {
      // Sort by date (most recent first)
      return new Date(b.dateGiven).getTime() - new Date(a.dateGiven).getTime();
    });
  } catch (error) {
    console.error('Failed to load testimonials:', error);
    return [];
  }
}

/**
 * Load testimonials for a specific project
 */
export function loadTestimonialsForProject(
  projectId: string
): TestimonialData[] {
  const allTestimonials = loadTestimonials();
  return allTestimonials.filter(
    testimonial => testimonial.projectId === projectId
  );
}
