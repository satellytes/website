import 'core-js';
import 'whatwg-fetch';
import 'what-input'

import { SatellyteIntro } from './intro';
import { Navigation } from './navigation';
import { ContactForm } from './contact-form';

document.addEventListener("DOMContentLoaded", function(event) {
  const svg = document.querySelector('.sy-intro__svg') as SVGElement;
  if(svg) {
    const intro = new SatellyteIntro(svg);
    intro.run();
  }

  const navigationElement = document.querySelector('.sy-navigation');
  if(navigationElement) {
    const navigation = new Navigation(navigationElement);
    navigation.start();
  }

  const contactFormElement = document.getElementById('sy-contact-form') as HTMLFormElement;
  if(contactFormElement !== null) {
    const contactForm = new ContactForm(contactFormElement);
  }

});

