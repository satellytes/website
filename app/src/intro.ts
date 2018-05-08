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

class Swoosh {
  private element: PIXI.Graphics;
  private visible: boolean;
  private appearTimeStamp: number;
  private MAX_APPERANCE: number = 600;

  constructor(private stage: PIXI.Container, private position: PIXI.Point) {
    this.element = new PIXI.Graphics();
    this.element.beginFill(0xffffff);
    this.element.drawStar(0, 0, 13, 10, 2);
    this.element.endFill();
    this.element.x = position.x;
    this.element.y = position.y;
    this.element.scale = new PIXI.Point(0, 0);

    this.visible = false;
    this.appearTimeStamp = 0;

    this.stage.addChild(this.element);
  }

  update(delta) {
    if (!this.visible && Math.random() > 0.999) {
      this.visible = true;
      this.appearTimeStamp = Date.now();
      let initScale = Math.random() * 0.8;
      this.element.scale = new PIXI.Point(initScale, initScale);
    }
    if (this.visible) {
      this.element.x += 2 * Math.cos(Date.now() / 1000);
      this.element.y += 2 * Math.sin(Date.now() / 1000);
      this.element.scale.x += 0.01;
      this.element.scale.y += 0.01;
    }
    if (Date.now() - this.appearTimeStamp > this.MAX_APPERANCE) {
      this.visible = false;
      this.element.scale = new PIXI.Point(0, 0);
    }
  }
}

export class SatellyteIntro {
  private stars: TwinkleStar[] = [];
  private swooshs: Swoosh[] = [];
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
    this.swooshs = this.createRandomSwooshs();
    this.app.ticker.add(this.update.bind(this));
  }

  update(delta) {
    for (let star of this.stars) {
      star.update(delta);
      this.contain(star);
    }
    for (let swoosh of this.swooshs) {
      swoosh.update(delta);
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
    let stars: TwinkleStar[] = [];
    for (let i = 0; i < count; i++) {
      stars.push(new TwinkleStar(this.app.stage, this.getRandomPosition()));
    }
    return stars;
  }

  createRandomSwooshs(count: number = 10): Swoosh[] {
    let swooshs: Swoosh[] = [];
    for (let i = 0; i < count; i++) {
      swooshs.push(new Swoosh(this.app.stage, this.getRandomPosition()));
    }
    return swooshs;
  }
}
