import * as PIXI from 'pixi.js'
import { SpaceObject, TwinkleStar, Swoosh, Satellite } from './intro/SpaceObjects';

export class SatellyteIntro {
  private _spaceObjects: SpaceObject[] = [];
  private _app: PIXI.Application;
  private _resolution = 1;
  private _planetEl: any;

  constructor(private _wrapper: HTMLElement) { }

  run() {
    if (window.devicePixelRatio) {
      this._resolution = window.devicePixelRatio;
    }
    this._app = new PIXI.Application({
      width: this._wrapper.clientWidth,
      height: this._wrapper.clientHeight,
      antialias: true,
      transparent: true,
      _resolution: this._resolution,
      autoResize: true
    });
    this._wrapper.appendChild(this._app.view);
    // find white planet in background
    this._planetEl = this._wrapper.querySelector('.sy-intro__planet');
    // attach scroll-handler vor parallax effect
    this.registerScrollHandler();

    // calculate twinkleStar count: 1 star for every 10000 square-pixels
    const twinkleStarCount = this._wrapper.clientWidth * this._wrapper.clientHeight / 10000;

    // add twinkle stars
    this._spaceObjects.push(...this.createRandomStars(twinkleStarCount));
    // add shooting stars
    this._spaceObjects.push(...this.createRandomSwooshs());
    // add a single satellite
    this._spaceObjects.push(new Satellite(this._app.stage, this.getRandomPosition()));

    this._app.ticker.add(this.update);
  }

  update = (delta) => {
    for (let spObj of this._spaceObjects) {
      spObj.update(delta);
      this.containInStage(spObj);
    }
  }

  // keeps spObj inside the bounds of this intros _wrapper
  containInStage(spObj: SpaceObject) {
    let maxWidth = this._wrapper.clientWidth;
    let maxHeight = this._wrapper.clientHeight;

    // upper bounds
    spObj.element.x = spObj.element.x % maxWidth;
    spObj.element.y = spObj.element.y % maxHeight;

    // lower bounds
    if (spObj.element.x < 0) {
      spObj.element.x = maxWidth;
    }
    if (spObj.element.y < 0) {
      spObj.element.y = maxHeight;
    }
  }

  registerScrollHandler() {
    window.addEventListener('scroll', event => {
      if (this._planetEl) {
        const newY = -0.07 * window.scrollY;
        this._planetEl.style.transform = `translateY(${newY}px)`;
      }
    }, false);
  }

  getRandomPosition(): PIXI.Point {
    return new PIXI.Point(
      Math.random() * this._wrapper.offsetWidth,
      Math.random() * this._wrapper.offsetHeight
    );
  }

  createRandomStars(count: number = 50): TwinkleStar[] {
    let stars: TwinkleStar[] = [];
    for (let i = 0; i < count; i++) {
      stars.push(new TwinkleStar(this._app.stage, this.getRandomPosition()));
    }
    return stars;
  }

  createRandomSwooshs(count: number = 4): Swoosh[] {
    let swooshs: Swoosh[] = [];
    for (let i = 0; i < count; i++) {
      swooshs.push(new Swoosh(this._app.stage, this.getRandomPosition()));
    }
    return swooshs;
  }
}
