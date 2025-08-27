#!/usr/bin/env node

/**
 * Content processing script for build-time optimization
 * Validates content, generates indexes, and optimizes for production
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuration
const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const OUTPUT_DIR = path.join(process.cwd(), 'src/data');
const PROJECTS_DIR = path.join(CONTENT_DIR, 'projects');
const SERVICES_DIR = path.join(CONTENT_DIR, 'services');

/**
 * Ensure output directory exists
 */
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

/**
 * Process markdown files and extract frontmatter + content
 */
function processMarkdownFiles(directory, type) {
  if (!fs.existsSync(directory)) {
    console.warn(`Directory ${directory} does not exist`);
    return [];
  }

  const files = fs.readdirSync(directory);
  const processed = [];

  files.forEach(filename => {
    if (!filename.endsWith('.md')) return;

    const filePath = path.join(directory, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // Add content to the data object
    const processedItem = {
      ...data,
      content: content.trim(),
      _filename: filename,
      _type: type
    };

    processed.push(processedItem);
  });

  return processed;
}

/**
 * Validate required fields for projects
 */
function validateProject(project) {
  const errors = [];
  const required = ['id', 'title', 'description', 'image', 'technologies', 'category', 'tags', 'dateCompleted'];
  
  required.forEach(field => {
    if (!project[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  if (project.technologies && !Array.isArray(project.technologies)) {
    errors.push('Technologies must be an array');
  }

  if (project.tags && !Array.isArray(project.tags)) {
    errors.push('Tags must be an array');
  }

  if (project.dateCompleted && isNaN(Date.parse(project.dateCompleted))) {
    errors.push('Invalid date format for dateCompleted');
  }

  return errors;
}/**
 * V
alidate required fields for services
 */
function validateService(service) {
  const errors = [];
  const required = ['id', 'title', 'description', 'icon', 'technologies', 'benefits', 'ctaLink'];
  
  required.forEach(field => {
    if (!service[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  if (service.technologies && !Array.isArray(service.technologies)) {
    errors.push('Technologies must be an array');
  }

  if (service.relatedProjects && !Array.isArray(service.relatedProjects)) {
    errors.push('Related projects must be an array');
  }

  return errors;
}

/**
 * Generate content indexes and metadata
 */
function generateIndexes(projects, services) {
  // Generate project index
  const projectIndex = {
    total: projects.length,
    featured: projects.filter(p => p.featured).length,
    categories: [...new Set(projects.map(p => p.category))],
    tags: [...new Set(projects.flatMap(p => p.tags || []))],
    technologies: [...new Set(projects.flatMap(p => p.technologies || []))],
    lastUpdated: new Date().toISOString()
  };

  // Generate service index
  const serviceIndex = {
    total: services.length,
    technologies: [...new Set(services.flatMap(s => s.technologies || []))],
    lastUpdated: new Date().toISOString()
  };

  return { projectIndex, serviceIndex };
}

/**
 * Main processing function
 */
function main() {
  console.log('🔄 Processing content...');
  
  ensureOutputDir();

  // Process projects
  console.log('📁 Processing projects...');
  const projects = processMarkdownFiles(PROJECTS_DIR, 'project');
  let totalErrors = 0;

  // Validate projects
  projects.forEach(project => {
    const errors = validateProject(project);
    if (errors.length > 0) {
      console.error(`❌ Validation errors in ${project._filename}:`);
      errors.forEach(error => console.error(`   - ${error}`));
      totalErrors += errors.length;
    }
  });

  // Process services
  console.log('🛠️  Processing services...');
  const services = processMarkdownFiles(SERVICES_DIR, 'service');

  // Validate services
  services.forEach(service => {
    const errors = validateService(service);
    if (errors.length > 0) {
      console.error(`❌ Validation errors in ${service._filename}:`);
      errors.forEach(error => console.error(`   - ${error}`));
      totalErrors += errors.length;
    }
  });

  if (totalErrors > 0) {
    console.error(`❌ Content validation failed with ${totalErrors} errors`);
    process.exit(1);
  }

  // Generate indexes
  const { projectIndex, serviceIndex } = generateIndexes(projects, services);

  // Write processed content to JSON files (for backward compatibility)
  const projectsOutput = projects.map(({ _filename, _type, content, ...rest }) => rest);
  const servicesOutput = services.map(({ _filename, _type, content, ...rest }) => rest);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'projects-processed.json'),
    JSON.stringify(projectsOutput, null, 2)
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'services-processed.json'),
    JSON.stringify(servicesOutput, null, 2)
  );

  // Write indexes
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'content-index.json'),
    JSON.stringify({ projects: projectIndex, services: serviceIndex }, null, 2)
  );

  console.log('✅ Content processing completed successfully');
  console.log(`📊 Processed ${projects.length} projects and ${services.length} services`);
  console.log(`📈 Generated indexes and validation passed`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, processMarkdownFiles, validateProject, validateService };