class TestimonialCarousel {
  constructor() {
    this.carousel = document.getElementById('testimonial-carousel');
    this.track = document.getElementById('carousel-track');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.dots = document.getElementById('carousel-dots');

    if (!this.carousel || !this.track) return;

    this.slides = this.track.querySelectorAll('.carousel-slide');
    this.currentSlide = 0;
    this.isDesktop = window.innerWidth >= 1024;
    this.slidesToShow = this.isDesktop ? 2 : 1;
    this.maxSlide = Math.max(0, this.slides.length - this.slidesToShow);

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateCarousel();
    this.startAutoPlay();

    // Handle resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  setupEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    if (this.dots) {
      this.dots.addEventListener('click', e => {
        if (e.target.classList.contains('dot')) {
          const slideIndex = parseInt(e.target.dataset.slide);
          this.goToSlide(slideIndex);
        }
      });
    }

    // Keyboard navigation
    this.carousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.nextSlide();
      }
    });

    // Pause auto-play on hover
    this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
    this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());

    // Pause auto-play on focus
    this.carousel.addEventListener('focusin', () => this.pauseAutoPlay());
    this.carousel.addEventListener('focusout', () => this.startAutoPlay());
  }

  handleResize() {
    const wasDesktop = this.isDesktop;
    this.isDesktop = window.innerWidth >= 1024;
    this.slidesToShow = this.isDesktop ? 2 : 1;
    this.maxSlide = Math.max(0, this.slides.length - this.slidesToShow);

    // Adjust current slide if layout changed
    if (wasDesktop !== this.isDesktop) {
      this.currentSlide = Math.min(this.currentSlide, this.maxSlide);
      this.updateCarousel();
    }
  }

  prevSlide() {
    this.currentSlide =
      this.currentSlide > 0 ? this.currentSlide - 1 : this.maxSlide;
    this.updateCarousel();
  }

  nextSlide() {
    this.currentSlide =
      this.currentSlide < this.maxSlide ? this.currentSlide + 1 : 0;
    this.updateCarousel();
  }

  goToSlide(index) {
    this.currentSlide = Math.max(0, Math.min(index, this.maxSlide));
    this.updateCarousel();
  }

  updateCarousel() {
    // Update track position
    const translateX = -(this.currentSlide * (100 / this.slidesToShow));
    this.track.style.transform = `translateX(${translateX}%)`;

    // Update navigation buttons
    if (this.prevBtn) {
      this.prevBtn.disabled = this.slides.length <= this.slidesToShow;
    }

    if (this.nextBtn) {
      this.nextBtn.disabled = this.slides.length <= this.slidesToShow;
    }

    // Update dots
    if (this.dots) {
      const dotElements = this.dots.querySelectorAll('.dot');
      dotElements.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentSlide);
        dot.setAttribute(
          'aria-selected',
          index === this.currentSlide ? 'true' : 'false'
        );
      });
    }

    // Update ARIA live region for screen readers
    this.announceSlideChange();
  }

  announceSlideChange() {
    const currentTestimonial = this.slides[this.currentSlide];
    if (currentTestimonial) {
      const authorName =
        currentTestimonial.querySelector('.author-name')?.textContent;
      const announcement = `Showing testimonial ${this.currentSlide + 1} of ${this.slides.length}${authorName ? ` from ${authorName}` : ''}`;

      // Create or update live region
      let liveRegion = document.getElementById('carousel-live-region');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'carousel-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        this.carousel.appendChild(liveRegion);
      }

      liveRegion.textContent = announcement;
    }
  }

  startAutoPlay() {
    if (this.slides.length <= this.slidesToShow) return;

    this.pauseAutoPlay();

    // Only auto-play if user hasn't indicated reduced motion preference
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, 5000); // 5 seconds
    }
  }

  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TestimonialCarousel();
});

// Re-initialize on page navigation (for SPAs)
document.addEventListener('astro:page-load', () => {
  new TestimonialCarousel();
});
