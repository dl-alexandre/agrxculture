import { describe, it, expect } from 'vitest';
import { loadProjects, loadServices, loadProject } from '../../src/utils/content-loader';
import { validateAllContent } from '../../src/utils/content-validator';

describe('Content Management System', () => {
  describe('Content Loading', () => {
    it('should load all projects successfully', () => {
      const projects = loadProjects();
      
      expect(projects).toBeDefined();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
      
      // Check that projects have required fields
      projects.forEach(project => {
        expect(project.id).toBeDefined();
        expect(project.title).toBeDefined();
        expect(project.description).toBeDefined();
        expect(project.technologies).toBeDefined();
        expect(Array.isArray(project.technologies)).toBe(true);
        expect(project.content).toBeDefined();
      });
    });

    it('should load all services successfully', () => {
      const services = loadServices();
      
      expect(services).toBeDefined();
      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);
      
      // Check that services have required fields
      services.forEach(service => {
        expect(service.id).toBeDefined();
        expect(service.title).toBeDefined();
        expect(service.description).toBeDefined();
        expect(service.technologies).toBeDefined();
        expect(Array.isArray(service.technologies)).toBe(true);
        expect(service.content).toBeDefined();
      });
    });

    it('should load individual project by ID', () => {
      const project = loadProject('farm-sensor-network');
      
      expect(project).toBeDefined();
      expect(project?.id).toBe('farm-sensor-network');
      expect(project?.title).toBe('Smart Farm Sensor Network');
      expect(project?.content).toContain('Problem');
      expect(project?.content).toContain('Solution');
      expect(project?.content).toContain('Outcome');
    });

    it('should return null for non-existent project', () => {
      const project = loadProject('non-existent-project');
      expect(project).toBeNull();
    });

    it('should sort projects with featured first', () => {
      const projects = loadProjects();
      const featuredProjects = projects.filter(p => p.featured);
      const nonFeaturedProjects = projects.filter(p => !p.featured);
      
      // If there are featured projects, they should come first
      if (featuredProjects.length > 0) {
        expect(projects[0].featured).toBe(true);
      }
      
      // Check that featured projects come before non-featured
      let foundNonFeatured = false;
      projects.forEach(project => {
        if (!project.featured) {
          foundNonFeatured = true;
        } else if (foundNonFeatured) {
          // If we found a featured project after a non-featured one, that's wrong
          expect(false).toBe(true);
        }
      });
    });
  });

  describe('Content Validation', () => {
    it('should validate all content successfully', async () => {
      const validation = await validateAllContent();
      
      if (!validation.isValid) {
        console.log('Validation errors:', validation.errors);
      }
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.summary.projects).toBeGreaterThan(0);
      expect(validation.summary.services).toBeGreaterThan(0);
      expect(validation.summary.totalErrors).toBe(0);
    });

    it('should have consistent project structure', () => {
      const projects = loadProjects();
      
      projects.forEach(project => {
        // Required fields
        expect(typeof project.id).toBe('string');
        expect(typeof project.title).toBe('string');
        expect(typeof project.description).toBe('string');
        expect(typeof project.category).toBe('string');
        expect(project.dateCompleted).toBeDefined();
        expect(new Date(project.dateCompleted).toString()).not.toBe('Invalid Date');
        expect(typeof project.featured).toBe('boolean');
        
        // Array fields
        expect(Array.isArray(project.technologies)).toBe(true);
        expect(Array.isArray(project.tags)).toBe(true);
        
        // Metrics object
        expect(project.metrics).toBeDefined();
        expect(typeof project.metrics.improvement).toBe('string');
        expect(typeof project.metrics.timeline).toBe('string');
        expect(typeof project.metrics.scale).toBe('string');
        
        // Schema object
        expect(project.schema).toBeDefined();
        expect(typeof project.schema.type).toBe('string');
        expect(typeof project.schema.name).toBe('string');
        
        // Content
        expect(typeof project.content).toBe('string');
        expect(project.content.length).toBeGreaterThan(0);
      });
    });

    it('should have consistent service structure', () => {
      const services = loadServices();
      
      services.forEach(service => {
        // Required fields
        expect(typeof service.id).toBe('string');
        expect(typeof service.title).toBe('string');
        expect(typeof service.description).toBe('string');
        expect(typeof service.icon).toBe('string');
        expect(typeof service.benefits).toBe('string');
        expect(typeof service.ctaLink).toBe('string');
        
        // Array fields
        expect(Array.isArray(service.technologies)).toBe(true);
        expect(Array.isArray(service.relatedProjects)).toBe(true);
        
        // Schema object
        expect(service.schema).toBeDefined();
        expect(typeof service.schema.type).toBe('string');
        expect(typeof service.schema.name).toBe('string');
        
        // Content
        expect(typeof service.content).toBe('string');
        expect(service.content.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Content Relationships', () => {
    it('should have valid project-service relationships', () => {
      const projects = loadProjects();
      const services = loadServices();
      
      const projectIds = new Set(projects.map(p => p.id));
      
      services.forEach(service => {
        service.relatedProjects.forEach(projectId => {
          // Each related project should exist (or be a placeholder for future projects)
          if (!projectId.includes('placeholder') && !projectId.includes('future')) {
            expect(projectIds.has(projectId)).toBe(true);
          }
        });
      });
    });

    it('should have valid technology consistency', () => {
      const projects = loadProjects();
      const services = loadServices();
      
      const allTechnologies = new Set();
      
      // Collect all technologies from projects
      projects.forEach(project => {
        project.technologies.forEach(tech => allTechnologies.add(tech));
      });
      
      // Collect all technologies from services
      services.forEach(service => {
        service.technologies.forEach(tech => allTechnologies.add(tech));
      });
      
      // Should have common agricultural technologies
      expect(allTechnologies.has('Python')).toBe(true);
      expect(allTechnologies.has('Swift')).toBe(true);
      expect(allTechnologies.has('PostgreSQL')).toBe(true);
    });
  });

  describe('SEO and Schema Data', () => {
    it('should have proper schema.org markup for projects', () => {
      const projects = loadProjects();
      
      projects.forEach(project => {
        expect(project.schema.type).toBe('CreativeWork');
        expect(project.schema.creator).toBeDefined();
        expect(project.schema.creator.type).toBe('Person');
        expect(project.schema.creator.name).toBe('Agrxculture');
        expect(project.schema.dateCreated).toBeDefined();
        expect(project.schema.keywords).toBeDefined();
      });
    });

    it('should have proper schema.org markup for services', () => {
      const services = loadServices();
      
      services.forEach(service => {
        expect(service.schema.type).toBe('Service');
        expect(service.schema.provider).toBeDefined();
        expect(service.schema.provider.type).toBe('Person');
        expect(service.schema.provider.name).toBe('Agrxculture');
        expect(service.schema.serviceType).toBeDefined();
        expect(service.schema.areaServed).toBe('Agricultural Operations');
      });
    });
  });
});