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

  init() {
    this._element.addEventListener('mouseover', this.handleMouseOver);
  }

  destroy() {
    this._element.removeEventListener('mouseover', this.handleMouseOver);
  }

  activate() {
    this._element.classList.add('sy-navigation__item--active');
  }

  deactivate() {
    this._element.classList.remove('sy-navigation__item--active');
  }
}

export class Navigation {
  private _bar;
  private _barBlock;

  private _container;
  private _currentItem;
  private _items: NavigationItem[] = [];

  constructor(private _element) {
    this.init();
    this.registerScrollListener();
    window.scroll();
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
      this._items.push(item);
    });
  }

  preactivateItem = (item) => {
    this.moveBarToItem(item);
  }

  // show an item in the navigation bar as active
  activate(item){
    if (!item) {
      return this.hideBar();
    }
    if (this._currentItem === item) {
      return;
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
    const sectionNames = ['sy-what', 'sy-why', 'sy-meet', 'sy-contact'];
    // - find corresponding sections,
    // - get rid of nulls and undefineds,
    // - order by appearance on page from top to bottom
    const sections = (sectionNames.map(name => document.querySelector(`#${name}`)) as HTMLElement[])
    .filter(section => section)
    .sort((a, b) => a.offsetTop - b.offsetTop);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const section = sections.find(section => {
            const rect = section.getBoundingClientRect();
            // return first section whose top is visible or has its bottom still below fold
            return rect.top > 0 && rect.top < window.innerHeight || rect.bottom > window.innerHeight;
          });

          if (section) {
            const itemElement = this._element.querySelector(`[href$='#${section.id}']`);
            const item = this._items.find(item => item.element === itemElement);
            this.activate(item);
          }

          ticking = false;
        });
      }
      ticking = true;
    });
  }
}
