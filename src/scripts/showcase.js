// Project showcase functionality
class ProjectShowcase {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.currentFilter = 'all';
    this.showFeaturedOnly = false;
    this.currentSort = 'date-desc';
    
    this.init();
  }
  
  async init() {
    try {
      // Load project data
      const response = await fetch('/src/data/projects.json');
      this.projects = await response.json();
      this.filteredProjects = [...this.projects];
      
      this.setupEventListeners();
      this.updateDisplay();
      this.updateProjectCount();
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }
  
  setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleFilterChange(e.target.dataset.filter);
      });
    });
    
    // Featured toggle
    const featuredToggle = document.getElementById('featured-toggle');
    if (featuredToggle) {
      featuredToggle.addEventListener('change', (e) => {
        this.showFeaturedOnly = e.target.checked;
        this.applyFilters();
      });
    }
    
    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.applySorting();
      });
    }
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.clearAllFilters();
      });
    }
    
    // Case study modal buttons
    const caseStudyButtons = document.querySelectorAll('.case-study-btn');
    caseStudyButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projectId = e.target.dataset.projectId;
        this.openCaseStudyModal(projectId);
      });
    });
    
    // Modal close functionality
    this.setupModalEventListeners();
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCaseStudyModal();
      }
    });
  }
  
  setupModalEventListeners() {
    const modal = document.getElementById('project-modal');
    const closeBtn = modal?.querySelector('.modal-close');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeCaseStudyModal();
      });
    }
    
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeCaseStudyModal();
        }
      });
    }
  }
  
  handleFilterChange(filter) {
    // Update active filter button
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
    
    const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-pressed', 'true');
    }
    
    this.currentFilter = filter;
    this.applyFilters();
  }
  
  applyFilters() {
    this.filteredProjects = this.projects.filter(project => {
      // Filter by tag
      const matchesTag = this.currentFilter === 'all' || 
        project.tags.some(tag => tag.toLowerCase() === this.currentFilter);
      
      // Filter by featured status
      const matchesFeatured = !this.showFeaturedOnly || project.featured;
      
      return matchesTag && matchesFeatured;
    });
    
    this.applySorting();
    this.updateDisplay();
    this.updateProjectCount();
    this.updateActiveFilters();
  }
  
  applySorting() {
    this.filteredProjects.sort((a, b) => {
      switch (this.currentSort) {
        case 'date-desc':
          return new Date(b.dateCompleted) - new Date(a.dateCompleted);
        case 'date-asc':
          return new Date(a.dateCompleted) - new Date(b.dateCompleted);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }
  
  updateDisplay() {
    const projectGrid = document.querySelector('.project-grid');
    if (!projectGrid) return;
    
    // Hide all project cards first
    const allCards = document.querySelectorAll('.project-card');
    allCards.forEach(card => {
      card.style.display = 'none';
    });
    
    // Show filtered projects
    this.filteredProjects.forEach(project => {
      const card = document.querySelector(`[data-project-id="${project.id}"]`)?.closest('.project-card');
      if (card) {
        card.style.display = 'block';
      }
    });
    
    // Show no results message if needed
    this.updateNoResultsMessage();
  }
  
  updateNoResultsMessage() {
    const projectGrid = document.querySelector('.project-grid');
    if (!projectGrid) return;
    
    let noResultsMsg = document.querySelector('.no-results-message');
    
    if (this.filteredProjects.length === 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results-message';
        noResultsMsg.innerHTML = `
          <div class="no-results-content">
            <h3>No projects found</h3>
            <p>Try adjusting your filters to see more projects.</p>
            <button class="btn btn-primary" onclick="projectShowcase.clearAllFilters()">
              Clear All Filters
            </button>
          </div>
        `;
        projectGrid.appendChild(noResultsMsg);
      }
      noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
      noResultsMsg.style.display = 'none';
    }
  }
  
  updateProjectCount() {
    const countElement = document.getElementById('project-count');
    if (countElement) {
      const total = this.projects.length;
      const filtered = this.filteredProjects.length;
      countElement.textContent = filtered === total ? 
        `${total} projects` : 
        `${filtered} of ${total} projects`;
    }
  }
  
  updateActiveFilters() {
    const activeFiltersContainer = document.getElementById('active-filter-tags');
    const clearFiltersBtn = document.getElementById('clear-filters');
    
    if (!activeFiltersContainer) return;
    
    const filters = [];
    
    if (this.currentFilter !== 'all') {
      filters.push(this.currentFilter.charAt(0).toUpperCase() + this.currentFilter.slice(1));
    }
    
    if (this.showFeaturedOnly) {
      filters.push('Featured Only');
    }
    
    if (filters.length === 0) {
      activeFiltersContainer.innerHTML = '<span class="active-filter-tag">All Projects</span>';
      if (clearFiltersBtn) clearFiltersBtn.style.display = 'none';
    } else {
      activeFiltersContainer.innerHTML = filters
        .map(filter => `<span class="active-filter-tag">${filter}</span>`)
        .join('');
      if (clearFiltersBtn) clearFiltersBtn.style.display = 'inline-block';
    }
  }
  
  clearAllFilters() {
    // Reset filter state
    this.currentFilter = 'all';
    this.showFeaturedOnly = false;
    this.currentSort = 'date-desc';
    
    // Reset UI elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
    
    const allBtn = document.querySelector('[data-filter="all"]');
    if (allBtn) {
      allBtn.classList.add('active');
      allBtn.setAttribute('aria-pressed', 'true');
    }
    
    const featuredToggle = document.getElementById('featured-toggle');
    if (featuredToggle) {
      featuredToggle.checked = false;
    }
    
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.value = 'date-desc';
    }
    
    // Apply filters
    this.applyFilters();
  }
  
  openCaseStudyModal(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    
    // Populate modal content
    this.populateModalContent(project);
    
    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    
    // Focus management
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.focus();
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
  
  populateModalContent(project) {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    
    // Basic info
    modal.querySelector('#modal-title').textContent = project.title;
    modal.querySelector('#modal-image').src = project.image;
    modal.querySelector('#modal-image').alt = `Screenshot of ${project.title}`;
    
    // Case study content
    modal.querySelector('#modal-problem').textContent = project.caseStudy.problem;
    modal.querySelector('#modal-solution').textContent = project.caseStudy.solution;
    modal.querySelector('#modal-outcome').textContent = project.caseStudy.outcome;
    
    // Metrics
    modal.querySelector('#modal-improvement').textContent = project.metrics.improvement;
    modal.querySelector('#modal-timeline').textContent = project.metrics.timeline;
    modal.querySelector('#modal-scale').textContent = project.metrics.scale;
    
    // Technologies
    const techList = modal.querySelector('#modal-tech-list');
    techList.innerHTML = project.technologies
      .map(tech => `<span class="tech-badge">${tech}</span>`)
      .join('');
    
    // Links
    const demoLink = modal.querySelector('#modal-demo-link');
    const githubLink = modal.querySelector('#modal-github-link');
    const pdfLink = modal.querySelector('#modal-pdf-link');
    
    if (project.links.demo) {
      demoLink.href = project.links.demo;
      demoLink.style.display = 'inline-block';
    } else {
      demoLink.style.display = 'none';
    }
    
    if (project.links.github) {
      githubLink.href = project.links.github;
      githubLink.style.display = 'inline-block';
    } else {
      githubLink.style.display = 'none';
    }
    
    if (project.caseStudy.pdfDownload) {
      pdfLink.href = project.caseStudy.pdfDownload;
      pdfLink.style.display = 'inline-block';
    } else {
      pdfLink.style.display = 'none';
    }
  }
  
  closeCaseStudyModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to the button that opened the modal
    const activeElement = document.activeElement;
    if (activeElement && activeElement.classList.contains('modal-close')) {
      // Find the case study button that was clicked
      const caseStudyButtons = document.querySelectorAll('.case-study-btn');
      if (caseStudyButtons.length > 0) {
        caseStudyButtons[0].focus();
      }
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.projectShowcase = new ProjectShowcase();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProjectShowcase;
}