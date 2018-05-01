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
    this.initObserver();
  }

  start() {
    this.activate(this._items[0]);
  }

  handleMouseLeave = () => {
    this.activate(this._currentItem);
  }

  // TODO: cleanup, destroy
  init() {
    this._element.addEventListener('mouseleave', this.handleMouseLeave);

    this._container = this._element.querySelector('.sy-navigation__list');
    this._bar = this._element.querySelector('.sy-navigation__bar');
    this._barBlock = this._element.querySelector('.sy-navigation__bar-block');

    const itemElements = this._element.querySelectorAll('.sy-navigation__item');

    itemElements.forEach( element => {
      const item = new NavigationItem(element);
      item.on('preactivate', this.preactivateItem);
      this._items.push(item);
    })
  }

  preactivateItem = (item) => {
    this.moveBarToItem(item);
  }

  // show an item in the navigation bar as active
  // TODO: preactivate to simulate hover
  activate(item){
    if(this._currentItem === item) {
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
    const x = (itemBounding.x - 20  + itemBounding.width/2) + 'px';
    this._bar.style.transform = `translateX(${x})`;
    this._barBlock.style.transform = `translate(-50%) scale(${scale}, 1)`;
  }


 /** Initialize a IntersectionObserver to monitor
  * for content being shown in the viewport
  * to activate the according item in the sticky navigation bar
   */
  initObserver() {
    const sectionNames = ['sy-what', 'sy-why', 'sy-meet', 'sy-contact'];
    const sections = sectionNames.map(name => document.querySelector(`a[name='${name}']` ));
    const options = {
      // 0.5 = The callback is fired when 50% of the element is visible
      // We can add more values to the array, like 0.25, 0.75 or 1.0
      threshold: [0.5]
    };

    // Instantiate the IntersectionObserver class
    const observer = new IntersectionObserver((entries, observer) => {
      // This is the callback.
      const entry = entries[0];
      if(entry.isIntersecting) {
        const target = entry.target;
        const targetAnchor = target.getAttribute('name');
        const itemElement = this._element.querySelector(`[href='#${targetAnchor}']`);

        const item = this._items.find(item => item.element === itemElement);
        this.activate(item);
      }
      // End of callback. Pass the options object as the second argument.
    }, options);

    sections.forEach((item) => observer.observe(item as Element));
  }
}
