import * as PIXI from 'pixi.js'

class TwinkleStar {
  private element: PIXI.Graphics;
  private scale: PIXI.Point;
  private growing: boolean;
  private scaleSpeed: number;
  private MAX_SCALE = 1.7;
  private MIN_SCALE = 0;

  constructor(private stage: PIXI.Container, private position: PIXI.Point) {
    this.element = new PIXI.Graphics();
    this.element.beginFill(0xffffff);
    this.element.drawStar(0, 0, 4, 2, 0.3);
    this.element.endFill();
    this.element.x = position.x;
    this.element.y = position.y;

    this.growing = true;
    this.scaleSpeed = Math.random();
    let initScale = this.MIN_SCALE;
    this.scale = new PIXI.Point(initScale, initScale);

    // add element to stage
    this.stage.addChild(this.element);
  }

  update(delta) {
    this.element.x += 0.125 - Math.random() / 4;
    this.element.y += 0.125 - Math.random() / 4;
    this.element.scale = this.getNextScale();
    if (this.element.scale.x > this.MAX_SCALE) {
      this.growing = false;
    }
    if (this.element.scale.x < this.MIN_SCALE) {
      this.growing = true;
    }
  }

  getNextScale(): PIXI.Point {
    let scaleStep = this.growing ? 0.01 : -0.01;
    let x = this.scale.x += scaleStep * this.scaleSpeed;
    let y = this.scale.y += scaleStep * this.scaleSpeed;
    return new PIXI.Point(x, y);
  }
}

export class SatellyteIntro {
  private stars: TwinkleStar[] = [];
  private app: PIXI.Application;

  constructor(private wrapper: HTMLElement) { }

  run() {
    this.app = new PIXI.Application({
      width: this.wrapper.offsetWidth,
      height: this.wrapper.offsetHeight,
      antialias: true,
      transparent: true,
      resolution: 1
    });

    this.wrapper.appendChild(this.app.view);
    this.stars = this.createRandomStars();
    this.app.ticker.add(this.update.bind(this));
  }

  update(delta) {
    for (let star of this.stars) {
      star.update(delta);
      this.contain(star);
    }
  }

  getRandomPosition(): PIXI.Point {
    return new PIXI.Point(
      Math.random() * this.wrapper.offsetWidth,
      Math.random() * this.wrapper.offsetHeight
    );
  }

  // possibly changes coordinates of star (in place!)
  contain(star) {
    star.element.x = star.element.x % this.wrapper.offsetWidth;
    star.element.y = star.element.y % this.wrapper.offsetHeight;
  }

  createRandomStars(count: number = 50): TwinkleStar[] {
    let stars: any[] = [];
    for (let i = 0; i < count; i++) {
      stars.push(new TwinkleStar(this.app.stage, this.getRandomPosition()));
    }
    return stars;
  }
}
