// import 'whatwg-fetch';
import 'core-js/es6/object';
import 'core-js/es7/object';
import 'core-js/es6/array';

const smoothScroll = require('smoothscroll');

// import { SatellyteBackground } from './background';
import { Navigation } from './navigation';
import { ContactForm } from './contact-form';
import { ScrollEffects } from './scroll-effects';

document.addEventListener("DOMContentLoaded", function(event) {


  const navigationElement = document.querySelector('.sy-navigation');
  if(navigationElement) {
    const navigation = new Navigation(navigationElement);
  }

  const contactFormElement = document.querySelector('.sy-contact-form') as HTMLFormElement;
  if(contactFormElement !== null) {
    const contactForm = new ContactForm(contactFormElement);
  }

  // setup scroll effects
  const scrollEffects = new ScrollEffects(document.documentElement);
  scrollEffects.start();

  // const background = new SatellyteBackground();
  // background.run();
});
