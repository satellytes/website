import 'core-js';
import 'whatwg-fetch';
import 'what-input';

const smoothScroll = require('smoothscroll');

import { SatellyteBackground } from './background';
import { Navigation } from './navigation';
import { ContactForm } from './contact-form';
import { CustomMap } from './office-map';
import { ScrollEffects } from './scroll-effects';

document.addEventListener("DOMContentLoaded", function(event) {

  const background = new SatellyteBackground();
  document.documentElement.appendChild(background.canvas);

  const navigationElement = document.querySelector('.sy-navigation');
  if(navigationElement) {
    const navigation = new Navigation(navigationElement);
  }

  const contactFormElement = document.getElementById('sy-contact-form') as HTMLFormElement;
  if(contactFormElement !== null) {
    const contactForm = new ContactForm(contactFormElement);
  }

  // interactive google map replaced with static image
  // leaving this in for now in case we choose to reactivate it later
  const googleMapsElement = document.querySelector('.google-map') as HTMLElement;
  if (googleMapsElement) {
    const map = new CustomMap(googleMapsElement);
    map.show();
  }

  // setup smooth scroll for internal links
  Array.from(document.querySelectorAll('a[href^="/#"], a[href^="#"]')).forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      const sanitizedHref = href!.replace('/', '');
      const target = document.querySelector(`${sanitizedHref}`) as HTMLElement;
      if (target) {
        event.preventDefault();
        window.history.replaceState({}, sanitizedHref, href);
        const offsetTop  = target.getBoundingClientRect().top + document.documentElement.scrollTop;
        // remove 70px from the top to make sure headline is visible below navigation bar
        smoothScroll(offsetTop - 70);
      }
    });
  });

  // setup scroll effects
  const scrollEffects = new ScrollEffects(document.documentElement);
});
