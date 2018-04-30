// import * as lobos from 'lobos';

// var dims = 2
// var options = { params: 'new-joe-kuo-6.21201', resolution: 32 } // *optional*
// var sequence = new lobos.Sobol(dims, options)
// var points = sequence.take(100)

const STARS = [
  {x: 10, y: 190},
  {x: 50, y: 150},
  {x: 100, y: 170},
  {x: 110, y: 185},
  {x: 80, y: 175},
  {x: 75, y: 195},
  {x: 30, y: 130},
  {x: 45, y: 180},
  {x: 15, y: 97}
]


class Star {
  constructor(private _element: any, private point) {
    this.init();
  }

  get element() {
    return this._element;
  }

  init() {
    const {element} = this;
    element.style.animationDelay = 15 * Math.random() + "s";
    element.setAttribute('fill','#ffffff');
    // element.setAttribute('fill','#ff0000');

    const radius = 0.5 + Math.random()/2;

    element.setAttribute('cx', this.point.x);
    element.setAttribute('cy', this.point.y);
    element.setAttribute('r', radius);
  }
}
class SatellyteIntro {
  private path: any;
  private namespaceURI: any;

  constructor(private svg: SVGElement) {
    this.path = svg.querySelector('.satellyte__path') as SVGPathElement;
    this.namespaceURI = svg.namespaceURI;
  }

  run() {
    const starsContainer = this.svg.querySelector('.satellyte__stars');
    const starPoints = [...STARS] as any;
    // create some random additional points to the
    // fixed set of stars we have already defined by hand
    for (let i = 0; i < 50; i++) {
      starPoints.push(this.getRandomPosition())
    }

    for (let i = 0; i < starPoints.length; i++) {
      const circle = document.createElementNS(this.namespaceURI,'circle');
      const point = starPoints[i];
      const star = new Star(circle, point);
      starsContainer!.appendChild(star.element);
    }

  }

  getRandomPosition() {
    const box = {
      padding: 20,
      x: -200,
      y: 0,
      width: 300,
      height: 200
    }

    return {
      x: box.padding + box.x + Math.random() * (box.width) - box.padding,
      y: box.padding + box.y + Math.random() * (box.height) - box.padding
    }
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  const svg = document.getElementsByClassName('sy-intro__svg')[0] as SVGElement;
  const intro = new SatellyteIntro(svg);
  intro.run();
});