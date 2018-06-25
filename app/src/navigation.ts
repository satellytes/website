import EventEmitter from 'events';

class NavigationItem extends EventEmitter {
  constructor(private _element) {
    super();
    this.init();
  }

  get element () {
    return this._element;
  }

  handleMouseOver = (val) => {
    this.emit('preactivate', this);
  }

  handleMouseClick = () => {
    this.emit('activate', this);
  }

  init() {
    this._element.addEventListener('mouseover', this.handleMouseOver);
    this._element.addEventListener('click', this.handleMouseClick);
  }

  destroy() {
    this._element.removeEventListener('mouseover', this.handleMouseOver);
    this._element.removeEventListener('click', this.handleMouseClick);
  }

  activate() {
    this._element.classList.add('sy-navigation__item--active');
  }

  deactivate() {
    this._element.classList.remove('sy-navigation__item--active');
  }
  //return the
  get href() {
    const url = this._element.getAttribute('href');
    const parts = url.split('#');

    // we are only interested in the part after the hash, if any
    if(parts.length > 1) {
      return parts[1];
    }

    // Silently fail as this could be a normal link in the navigation bar
    return null;
  }
}

export class Navigation {
  private _bar;
  private _barBlock;

  private _container;
  private _currentItem;
  private _items: NavigationItem[] = [];
  private _planet;

  // flag to determine whether to update the navigation-bar on scroll-events
  // if user clicked on a navigation link we want the page to scroll
  // to that section without updating the navigation on the way
  private navigating: boolean = false;

  constructor(private _element) {
    this.init();
    this.registerScrollListener();
    // fake a minimal scroll to activate current item
    window.scroll(window.scrollX, window.scrollY + 1);
    window.scroll(window.scrollX, window.scrollY - 1);
    this._planet = this._element.querySelector('.sy-large-planet');
  }

  handleMouseLeave = () => {
    this.activate(this._currentItem);
  }

  // TODO: cleanup, destroy
  // felix: destroy necessary on mutli-page-site?
  init() {
    this._element.addEventListener('mouseleave', this.handleMouseLeave);

    this._container = this._element.querySelector('.sy-navigation__list');
    this._bar = this._element.querySelector('.sy-navigation__bar');
    this._barBlock = this._element.querySelector('.sy-navigation__bar-block');

    const itemElements = Array.from(this._element.querySelectorAll('.sy-navigation__item')) as HTMLElement[];

    itemElements.forEach( element => {
      const item = new NavigationItem(element);
      item.on('preactivate', this.preactivateItem);
      item.on('activate', this.activateItem);
      this._items.push(item);
    });
  }

  preactivateItem = (item) => {
    this.moveBarToItem(item);
  }

  activateItem = (item) => {
    this.navigating = true;
    this.activate(item);
    // tell scroll-listener to listen again after 500ms
    // (default duration of smooth scroll)
    window.setTimeout(() => {
      this.navigating = false;
    }, 500);
  }

  // show an item in the navigation bar as active
  activate(item){
    if (!item) {
      return this.hideBar();
    }

    if(this._currentItem) {
      this._currentItem.deactivate();
    }

    this._currentItem = item;
    this._currentItem.activate();
    this.moveBarToItem(item);
  }

  moveBarToItem(item: NavigationItem) {
    const margin = 20;
    const context = this._container.getBoundingClientRect();
    const itemBounding = item.element.getBoundingClientRect();
    const scale = itemBounding.width/100;
    const x = (itemBounding.x + itemBounding.width/2) + 'px';
    this._bar.style.transform = `translateX(${x})`;
    this._barBlock.style.transform = `translate(-50%) scale(${scale}, 1)`;
    this.showBar();
  }

  hideBar() {
    this._barBlock.style.opacity = '0';
  }

  showBar() {
    this._barBlock.style.opacity = '1';
  }

  registerScrollListener() {

    const sectionMap = {
      'sy-what': 'sy-landingpage__what',
      'sy-why': 'sy-landingpage__why',
      'sy-contact': 'sy-landingpage__meet'
    };
    // - find corresponding sections,
    // - get rid of nulls and undefineds,
    const sections = (Object.values(sectionMap)
    .map(name => document.querySelector(`.${name}`)) as HTMLElement[])
    .filter(section => section);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // only update navigation bar if this scroll was not initiated by a click on a navigation item
          if (!this.navigating) {
            const section = sections.find(section => {
              const rect = section.getBoundingClientRect();
              // return first section whose top is visible or has its bottom still below fold
              return rect.top > 0 && rect.top < window.innerHeight || rect.bottom > window.innerHeight;
            });
            if (section) {
              const href = Object.entries(sectionMap).find(sec => section.classList.contains(sec[1]));
              if (href) {
                const item = this._items.
                  find(item => item.href === href[0]);
                this.activate(item);
              }
            }
          }

          // update position of white planet
          if (this._planet) {
            const pos = window.scrollY * -0.4;
            this._planet.style.transform = 'translateY(' + pos + 'px)';
          }

          ticking = false;
        });
      }
      ticking = true;
    });
  }
}
