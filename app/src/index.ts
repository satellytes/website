require('intersection-observer');

import { SatellyteIntro } from './intro.ts';


class Navigation {
  private _bar;
  private _barBlock;

  private _container;
  private _items;

  constructor(private _element) {
    this.init();
    this.initObserver();
  }

  start() {
    this.activate(this._items[0]);
  }

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
        const item = this._element.querySelector(`[href='#${targetAnchor}']`);
        this.activate(item);
      }
      // End of callback. Pass the options object as the second argument.
    }, options);

    sections.forEach((item) => observer.observe(item as Element));
  }

  init() {
    this._container = this._element.querySelector('.sy-navigation__list');
    this._bar = this._element.querySelector('.sy-navigation__bar');
    this._barBlock = this._element.querySelector('.sy-navigation__bar-block');

    this._items = this._element.querySelectorAll('.sy-navigation__item');
    this._items.forEach( item => {
      item.addEventListener('mouseover', () => {
        this.activate(item);
      })
    })
  }

  activate(item){
    if(!item) {
      return;
    }

    const margin = 20;
    const context = this._container.getBoundingClientRect();
    const itemBounding = item.getBoundingClientRect();
    const scale = itemBounding.width/100;
    const x = (itemBounding.x - 20  + itemBounding.width/2) + 'px';
    this._bar.style.transform = `translateX(${x})`;
    this._barBlock.style.transform = `translate(-50%) scale(${scale}, 1)`;
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  const svg = document.querySelector('.sy-intro__svg') as SVGElement;
  const intro = new SatellyteIntro(svg);
  intro.run();

  const navigationElement = document.querySelector('.sy-navigation');
  const navigation = new Navigation(navigationElement);

  navigation.start();
});

