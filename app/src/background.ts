import { ShootingStar } from './intro/shooting-star';
import { TwinkleStar } from './intro/twinkle-star';
import { Satellite } from './intro/satellite';
import { SpaceObject } from './intro/space-object';

import {Application, Point } from 'pixi.js'

export class SatellyteBackground {
  private spaceObjects: SpaceObject[] = [];
  private app: Application;
  private width: number = 0;
  private height: number = 0;
  private heightExcess = 0.4;
  private resizeCooloff = 250;
  private resizeTimeout = -1;

  constructor() {
    this.run();

    window.addEventListener('resize', () => {
      if (this.app) {
        window.clearTimeout(this.resizeTimeout);
        this.resizeTimeout = window.setTimeout(this.resize, this.resizeCooloff);
      }
    }, false);

    window.addEventListener('scroll', () => {
      const pos = (document.scrollingElement || document.documentElement).scrollTop;
      const perc = pos / (document.documentElement.scrollHeight - window.innerHeight);

      this.app.view.style.transform = `translateY(-${perc * 100 * this.heightExcess}%)`;
    }, false);
  }

  public run() {
    this.setup();
    this.addSpaceObjects();
  }

  private resize = () => {
    this.clear();
    this.resizeCanvas();
    this.addSpaceObjects();
  };

  private setup() {

    let resolution = 1;
    if (window.devicePixelRatio) {
      resolution = window.devicePixelRatio;
    }

    this.app = new Application({
      width: 0,
      height: 0,
      antialias: true,
      transparent: true,
      resolution: resolution,
      autoResize: true,
    });

    this.resizeCanvas();

    this.app.view.classList.add('sy-background');
    document.documentElement.appendChild(this.app.view);

    this.app.ticker.add(this.update);
  }

  private resizeCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight * (1 + this.heightExcess);

    this.app.renderer.resize(this.width, this.height);
  }

  private addSpaceObjects() {

    // calculate twinkleStar count: 1 star for every 10000 square-pixels
    const twinkleStarCount = this.width * this.height / 25000;

    // add twinkle stars
    this.spaceObjects.push(...this.createRandomTwinkleStars(twinkleStarCount));
    // add shooting stars
    this.spaceObjects.push(...this.createRandomShootingStars());
    // add a single satellite
    this.spaceObjects.push(new Satellite(this.app.stage, this.getRandomPosition()));

  }

  private clear() {
    this.spaceObjects.forEach(spObj => {
      spObj.destroy();
    });
    this.spaceObjects.length = 0;
    this.app.renderer.resize(this.width, this.height);
  }

  private update = (delta) => {
    for (let spObj of this.spaceObjects) {
      spObj.update(delta);
      this.containInStage(spObj);
    }
  }

  // keeps spObj inside the bounds of this intros wrapper
  private containInStage(spObj: SpaceObject) {
    let maxWidth = this.width;
    let maxHeight = this.height;

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

  private getRandomPosition(): Point {
    return new Point(
      Math.random() * this.width,
      Math.random() * this.height
    );
  }

  private createRandomTwinkleStars(count: number = 50): TwinkleStar[] {
    let stars: TwinkleStar[] = [];
    for (let i = 0; i < count; i++) {
      stars.push(new TwinkleStar(this.app.stage, this.getRandomPosition()));
    }
    return stars;
  }

  private createRandomShootingStars(count: number = 4): ShootingStar[] {
    let swooshs: ShootingStar[] = [];
    for (let i = 0; i < count; i++) {
      swooshs.push(new ShootingStar(this.app.stage, this.getRandomPosition()));
    }
    return swooshs;
  }
}
