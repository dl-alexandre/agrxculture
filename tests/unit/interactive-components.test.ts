import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock project filtering functionality
const createProjectShowcase = () => {
  const dom = new JSDOM(`
    <div class="project-showcase">
      <div class="project-filters">
        <button class="filter-btn active" data-filter="all">All Projects</button>
        <button class="filter-btn" data-filter="iot">IoT</button>
        <button class="filter-btn" data-filter="mobile">Mobile</button>
        <button class="filter-btn" data-filter="analytics">Analytics</button>
      </div>
      
      <div class="project-grid">
        <div class="project-card" data-tags="iot,analytics">
          <h3>Farm Sensor Network</h3>
        </div>
        <div class="project-card" data-tags="mobile">
          <h3>FarmTrack iOS</h3>
        </div>
        <div class="project-card" data-tags="analytics">
          <h3>Yield Analytics</h3>
        </div>
      </div>
    </div>
  `);
  
  return dom.window.document;
};

// Project filtering functions
const filterProjects = (document: Document, filter: string): void => {
  const cards = document.querySelectorAll('.project-card');
  
  cards.forEach(card => {
    const tags = (card as HTMLElement).dataset.tags || '';
    const shouldShow = filter === 'all' || tags.includes(filter);
    
    (card as HTMLElement).style.display = shouldShow ? 'block' : 'none';
  });
};

const setActiveFilter = (document: Document, activeFilter: string): void => {
  const buttons = document.querySelectorAll('.filter-btn');
  
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if ((btn as HTMLElement).dataset.filter === activeFilter) {
      btn.classList.add('active');
    }
  });
};

describe('Interactive Components', () => {
  let document: Document;
  
  beforeEach(() => {
    document = createProjectShowcase();
    vi.clearAllMocks();
  });

  describe('Project Filtering', () => {
    it('should show all projects when "all" filter is selected', () => {
      filterProjects(document, 'all');
      
      const cards = document.querySelectorAll('.project-card');
      cards.forEach(card => {
        expect((card as HTMLElement).style.display).toBe('block');
      });
    });

    it('should filter projects by IoT tag', () => {
      filterProjects(document, 'iot');
      
      const iotCard = document.querySelector('[data-tags*="iot"]');
      const mobileCard = document.querySelector('[data-tags="mobile"]');
      
      expect((iotCard as HTMLElement)?.style.display).toBe('block');
      expect((mobileCard as HTMLElement)?.style.display).toBe('none');
    });
  });
});