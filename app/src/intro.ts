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

export class SatellyteIntro {
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
    // get viewbox properties of svg
    const [vbX, vbY, vbW, vbH] = this.svg.getAttribute('viewBox')!.split(' ').map(vbVal => parseInt(vbVal, 10));
    const box = {
      padding: 20,
      x: vbX,
      y: vbY,
      width: vbW,
      height: vbH
    }

    // makes sure value is inside range [min, max]
    const clamp = (val, min, max) => Math.min(Math.max(min, val), max);

    return {
      x: clamp(Math.random() * box.width,  box.padding, box.width  - box.padding),
      y: clamp(Math.random() * box.height, box.padding, box.height - box.padding)
    }
  }
}
