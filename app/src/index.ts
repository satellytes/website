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

  const navigationElement = document.querySelector('.sy-navigation');
  if(navigationElement) {
    const navigation = new Navigation(navigationElement);
  }

  const contactFormElement = document.querySelector('.sy-contact-form') as HTMLFormElement;
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

  // setup scroll effects
  const scrollEffects = new ScrollEffects(document.documentElement);
});
