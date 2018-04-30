import { SatellyteIntro } from './intro';
import { Navigation } from './navigation';

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

});

