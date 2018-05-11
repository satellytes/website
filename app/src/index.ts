import 'core-js';
import 'whatwg-fetch';
import 'what-input';

const smoothScroll = require('smoothscroll');

import { SatellyteIntro } from './intro';
import { Navigation } from './navigation';
import { ContactForm } from './contact-form';
import { CustomMap } from './office-map';
import { ScrollEffects } from './scroll-effects';

document.addEventListener("DOMContentLoaded", function(event) {
  const intros = Array.from(document.querySelectorAll('.sy-intro-wrapper')) as HTMLElement[];
  intros.forEach(introWrapper => {
    const intro = new SatellyteIntro(introWrapper);
    intro.run();
  });

  const navigationElement = document.querySelector('.sy-navigation');
  if(navigationElement) {
    const navigation = new Navigation(navigationElement);
  }

  const contactFormElement = document.getElementById('sy-contact-form') as HTMLFormElement;
  if(contactFormElement !== null) {
    const contactForm = new ContactForm(contactFormElement);
  }

  const googleMapsElement = document.querySelector('.google-map') as HTMLElement;
  if (googleMapsElement) {
    const map = new CustomMap(googleMapsElement);
    map.show();
  }

  // setup smooth scroll
  Array.from(document.querySelectorAll('.sy-navigation__item')).forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      const sanitizedLink = href!.replace('/', '');
      const target = document.querySelector(`${sanitizedLink}`) as HTMLElement;
      if (target) {
        event.preventDefault();
        window.history.replaceState({}, sanitizedLink, href);
        // remove 70px from the top to make sure headline is visible below navigation bar
        smoothScroll(target.offsetTop - 70);
      }
    });
  });

  // setup scroll effects
  const scrollEffects = new ScrollEffects(document.documentElement);
});
