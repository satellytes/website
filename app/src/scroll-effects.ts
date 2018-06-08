import 'intersection-observer';

export class ScrollEffects {
  private observer: IntersectionObserver;

  constructor(private root: HTMLElement) {
    const options = {
      threshold: [0.1]
    };
    this.observer = new IntersectionObserver(this.handleIntersection, options);
    this.init();
  }

  init() {
    Array.from(this.root.querySelectorAll('.sy-section__content')).forEach(content => {
      this.observer.observe(content);
    });
  }

  handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('sy-section__content--visible');
      }
    });
  }
}
