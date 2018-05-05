import 'core-js';
import 'whatwg-fetch';
import 'what-input';
import 'intersection-observer';

import { SatellyteIntro } from './intro';
import { Navigation } from './navigation';
import { ContactForm } from './contact-form';

document.addEventListener("DOMContentLoaded", function(event) {
  const svgs = Array.from(document.querySelectorAll('.sy-intro__svg'));
  svgs.forEach(svg => {
    const intro = new SatellyteIntro(svg as SVGElement);
    intro.run();
  });

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

