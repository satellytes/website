import * as PIXI from 'pixi.js'
import { SpaceObject, TwinkleStar, Swoosh, Satellite } from './intro/SpaceObjects';

export class SatellyteIntro {
  private spaceObjects: SpaceObject[] = [];
  private app: PIXI.Application;

  constructor(private wrapper: HTMLElement) { }

  run() {
    this.app = new PIXI.Application({
      width: this.wrapper.clientWidth,
      height: this.wrapper.clientHeight,
      antialias: true,
      transparent: true,
      resolution: 1
    });
    this.wrapper.appendChild(this.app.view);

    // calculate twinkleStar count: 1 star for every 10000 square-pixels
    const twinkleStarCount = this.wrapper.clientWidth * this.wrapper.clientHeight / 10000;

    // add twinkle stars
    this.spaceObjects.push(...this.createRandomStars(twinkleStarCount));
    // add shooting stars
    this.spaceObjects.push(...this.createRandomSwooshs());
    // add a single satellite
    this.spaceObjects.push(new Satellite(this.app.stage, this.getRandomPosition()));

    this.app.ticker.add(this.update);
  }

  update = (delta) => {
    for (let spObj of this.spaceObjects) {
      spObj.update(delta);
      this.containInStage(spObj);
    }
  }

  // keeps spObj inside the bounds of this intros wrapper
  containInStage(spObj: SpaceObject) {
    let maxWidth = this.wrapper.clientWidth;
    let maxHeight = this.wrapper.clientHeight;

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

  getRandomPosition(): PIXI.Point {
    return new PIXI.Point(
      Math.random() * this.wrapper.offsetWidth,
      Math.random() * this.wrapper.offsetHeight
    );
  }

  createRandomStars(count: number = 50): TwinkleStar[] {
    let stars: TwinkleStar[] = [];
    for (let i = 0; i < count; i++) {
      stars.push(new TwinkleStar(this.app.stage, this.getRandomPosition()));
    }
    return stars;
  }

  createRandomSwooshs(count: number = 4): Swoosh[] {
    let swooshs: Swoosh[] = [];
    for (let i = 0; i < count; i++) {
      swooshs.push(new Swoosh(this.app.stage, this.getRandomPosition()));
    }
    return swooshs;
  }
}
