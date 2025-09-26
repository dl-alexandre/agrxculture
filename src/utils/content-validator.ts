import type { ProjectData, ServiceData } from './content-loader';

/**
 * Validation errors for content
 */
export interface ValidationError {
  field: string;
  message: string;
  file: string;
}

/**
 * Validate project data structure
 */
export function validateProject(
  project: ProjectData,
  filename?: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  if (!project.id)
    errors.push({
      field: 'id',
      message: 'Project ID is required',
      file: filename || 'unknown',
    });
  if (!project.title)
    errors.push({
      field: 'title',
      message: 'Project title is required',
      file: filename || 'unknown',
    });
  if (!project.description)
    errors.push({
      field: 'description',
      message: 'Project description is required',
      file: filename || 'unknown',
    });
  if (!project.image)
    errors.push({
      field: 'image',
      message: 'Project image is required',
      file: filename || 'unknown',
    });
  if (!project.category)
    errors.push({
      field: 'category',
      message: 'Project category is required',
      file: filename || 'unknown',
    });
  if (!project.dateCompleted)
    errors.push({
      field: 'dateCompleted',
      message: 'Project completion date is required',
      file: filename || 'unknown',
    });

  // Array fields
  if (
    !Array.isArray(project.technologies) ||
    project.technologies.length === 0
  ) {
    errors.push({
      field: 'technologies',
      message: 'At least one technology is required',
      file: filename || 'unknown',
    });
  }
  if (!Array.isArray(project.tags) || project.tags.length === 0) {
    errors.push({
      field: 'tags',
      message: 'At least one tag is required',
      file: filename || 'unknown',
    });
  }

  // Date validation
  if (project.dateCompleted) {
    const dateValue =
      typeof project.dateCompleted === 'string'
        ? project.dateCompleted
        : String(project.dateCompleted);
    if (isNaN(Date.parse(dateValue))) {
      errors.push({
        field: 'dateCompleted',
        message: 'Invalid date format',
        file: filename || 'unknown',
      });
    }
  }

  // Metrics validation
  if (!project.metrics) {
    errors.push({
      field: 'metrics',
      message: 'Project metrics are required',
      file: filename || 'unknown',
    });
  } else {
    if (!project.metrics.improvement)
      errors.push({
        field: 'metrics.improvement',
        message: 'Improvement metric is required',
        file: filename || 'unknown',
      });
    if (!project.metrics.timeline)
      errors.push({
        field: 'metrics.timeline',
        message: 'Timeline metric is required',
        file: filename || 'unknown',
      });
    if (!project.metrics.scale)
      errors.push({
        field: 'metrics.scale',
        message: 'Scale metric is required',
        file: filename || 'unknown',
      });
  }

  // Schema validation
  if (!project.schema) {
    errors.push({
      field: 'schema',
      message: 'Schema markup is required',
      file: filename || 'unknown',
    });
  } else {
    if (!project.schema.type)
      errors.push({
        field: 'schema.type',
        message: 'Schema type is required',
        file: filename || 'unknown',
      });
    if (!project.schema.name)
      errors.push({
        field: 'schema.name',
        message: 'Schema name is required',
        file: filename || 'unknown',
      });
  }

  return errors;
}

/**
 * Validate service data structure
 */
export function validateService(
  service: ServiceData,
  filename?: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  if (!service.id)
    errors.push({
      field: 'id',
      message: 'Service ID is required',
      file: filename || 'unknown',
    });
  if (!service.title)
    errors.push({
      field: 'title',
      message: 'Service title is required',
      file: filename || 'unknown',
    });
  if (!service.description)
    errors.push({
      field: 'description',
      message: 'Service description is required',
      file: filename || 'unknown',
    });
  if (!service.icon)
    errors.push({
      field: 'icon',
      message: 'Service icon is required',
      file: filename || 'unknown',
    });
  if (!service.benefits)
    errors.push({
      field: 'benefits',
      message: 'Service benefits are required',
      file: filename || 'unknown',
    });
  if (!service.ctaLink)
    errors.push({
      field: 'ctaLink',
      message: 'Service CTA link is required',
      file: filename || 'unknown',
    });

  // Array fields
  if (
    !Array.isArray(service.technologies) ||
    service.technologies.length === 0
  ) {
    errors.push({
      field: 'technologies',
      message: 'At least one technology is required',
      file: filename || 'unknown',
    });
  }
  if (!Array.isArray(service.relatedProjects)) {
    errors.push({
      field: 'relatedProjects',
      message: 'Related projects must be an array',
      file: filename || 'unknown',
    });
  }

  // Schema validation
  if (!service.schema) {
    errors.push({
      field: 'schema',
      message: 'Schema markup is required',
      file: filename || 'unknown',
    });
  } else {
    if (!service.schema.type)
      errors.push({
        field: 'schema.type',
        message: 'Schema type is required',
        file: filename || 'unknown',
      });
    if (!service.schema.name)
      errors.push({
        field: 'schema.name',
        message: 'Schema name is required',
        file: filename || 'unknown',
      });
  }

  return errors;
}

/**
 * Validate all content and return summary
 */
export async function validateAllContent(): Promise<{
  isValid: boolean;
  errors: ValidationError[];
  summary: { projects: number; services: number; totalErrors: number };
}> {
  const errors: ValidationError[] = [];

  try {
    // Import here to avoid circular dependencies
    const { loadProjects, loadServices } = await import('./content-loader.js');

    const projects = loadProjects();
    const services = loadServices();

    // Validate projects
    projects.forEach((project: ProjectData) => {
      const projectErrors = validateProject(project, `${project.id}.md`);
      errors.push(...projectErrors);
    });

    // Validate services
    services.forEach((service: ServiceData) => {
      const serviceErrors = validateService(service, `${service.id}.md`);
      errors.push(...serviceErrors);
    });

    return {
      isValid: errors.length === 0,
      errors,
      summary: {
        projects: projects.length,
        services: services.length,
        totalErrors: errors.length,
      },
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [
        {
          field: 'system',
          message: `Content loading failed: ${error}`,
          file: 'unknown',
        },
      ],
      summary: { projects: 0, services: 0, totalErrors: 1 },
    };
  }
}
