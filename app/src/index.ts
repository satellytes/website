import 'core-js';
import 'whatwg-fetch';
import 'what-input';

import { SatellyteIntro } from './intro';
import { Navigation } from './navigation';
import { ContactForm } from './contact-form';
import { CustomMap } from './office-map';

document.addEventListener("DOMContentLoaded", function(event) {
  const svgs = Array.from(document.querySelectorAll('.sy-intro__svg'));
  svgs.forEach(svg => {
    const intro = new SatellyteIntro(svg as SVGElement);
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

});

