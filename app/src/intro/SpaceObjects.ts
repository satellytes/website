import * as PIXI from 'pixi.js'

export abstract class SpaceObject {
  public element: PIXI.Graphics;

  constructor(protected stage: PIXI.Container, protected position: PIXI.Point) {
    this.element = new PIXI.Graphics();
    this.element.x = position.x;
    this.element.y = position.y;
    // add element to stage
    this.stage.addChild(this.element);
  }

  abstract update(delta: number);
}

export class TwinkleStar extends SpaceObject {
  private MAX_SCALE = 1;
  private MIN_SCALE = 0.1;

  private scale: PIXI.Point;
  // flag to determine if star is growing or shrinking
  private growing: boolean;
  private scaleSpeed: number;

  constructor(protected stage: PIXI.Container, protected position: PIXI.Point) {
    super(stage, position);
    this.element.beginFill(0xffffff);
    this.element.drawCircle(0, 0, 1);
    this.element.endFill();

    this.growing = true;
    this.scaleSpeed = Math.random() * 0.8;
    this.scale = new PIXI.Point(this.MIN_SCALE, this.MIN_SCALE);
  }

  update(delta) {
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

export class Swoosh extends SpaceObject {
  private MIN_APPERANCE: number = 400;
  private MAX_APPERANCE: number = 4000;
  private MIN_SCALE: number = 0.1;
  private MAX_SCALE: number = 0.4;
  private APPEAR_PROBABILITY: number = 0.0005;

  private visible: boolean;
  private disappearing: boolean;
  private appearanceTimeStamp: number;
  private scaleSpeed: number;
  private directions = {
    x: 1,
    y: 1
  };

  constructor(protected stage: PIXI.Container, protected position: PIXI.Point) {
    super(stage, position);
    this.element.beginFill(0xffffff);
    this.element.drawCircle(0, 0, 2);
    this.element.endFill();
    this.element.scale = new PIXI.Point(0, 0);

    this.directions.x = Math.random() > 0.5 ? -1 : 1;
    this.directions.y = Math.random() > 0.5 ? -1 : 1;

    this.visible = false;
    this.disappearing = false;
    this.appearanceTimeStamp = 0;
    this.scaleSpeed = Math.random();
  }

  update(delta) {
    // make this swoosh appear again if currently not visible with a chance of APPEAR_PROBABILITY
    if (!this.visible && Math.random() > 1 - this.APPEAR_PROBABILITY) {
      this.appearanceTimeStamp = Date.now();
      this.element.scale = new PIXI.Point(this.MIN_SCALE, this.MIN_SCALE);
      this.visible = true;
      this.disappearing = false;
    }
    // if visible move along its path and scale up slightly
    if (this.visible) {
      this.element.x += this.directions.x * 4 * Math.cos(Date.now() / 1000);
      this.element.y += this.directions.y * 4 * Math.sin(Date.now() / 1000);

      let scaleDir = this.disappearing ? -2 : 1;
      this.element.scale.x = Math.min(this.MAX_SCALE, this.element.scale.x + scaleDir * this.scaleSpeed * 0.01);
      this.element.scale.y = Math.min(this.MAX_SCALE, this.element.scale.y + scaleDir * this.scaleSpeed * 0.01);

      // if has been visible for at least MIN_APPEARANCE and longer than a squared random part
      // of the MAX_APPEARANCE: hide this swoosh
      if (!this.disappearing) {
        let appearanceDuration = Date.now() - this.appearanceTimeStamp;
        if (appearanceDuration > this.MIN_APPERANCE && appearanceDuration > Math.sqrt(Math.random()) * this.MAX_APPERANCE) {
          this.disappearing = true;
        }
      }

      if (this.element.scale.x < this.MIN_SCALE) {
        this.visible = false;
        this.disappearing = false;
        this.element.scale = new PIXI.Point(0, 0);
      }
    }
  }
}

export class Satellite extends SpaceObject {
  private direction: PIXI.Point;
  private speed: number;

  constructor(protected stage, protected positon) {
    super(stage, positon);
    this.element.beginFill(0xffffff);
    this.element.drawCircle(0, 0, 1);
    this.element.endFill();
    this.direction = new PIXI.Point(Math.random() - 0.5, Math.random() - 0.5);
    this.speed = Math.random() * 2;
  }
  update(delta) {
    this.element.x += this.direction.x * this.speed;
    this.element.y += this.direction.y * this.speed;
  }
}
