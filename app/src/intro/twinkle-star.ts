import * as PIXI from 'pixi.js'
import { SpaceObject } from "./space-object";

export class TwinkleStar extends SpaceObject {
  private MAX_SCALE = 1;
  private MIN_SCALE = 0.1;

  private scale: PIXI.Point;
  // flag to determine if star is growing or shrinking
  private growing: boolean = Math.random() > 0.5 ? true : false;
  private destroyed: boolean = false;

  private destroyedAt: number = 0;
  private destroyedDelta: number = 0;
  private scaleSpeed: number = Math.random() * 0.8;
  private decayTime: number = Math.random() * 40;
  private nextScale: PIXI.Point;
  constructor(protected stage: PIXI.Container, protected position: PIXI.Point) {
    super(stage, position);
    this.element.beginFill(0xffffff);
    this.element.drawCircle(0, 0, 1);
    this.element.endFill();

    this.nextScale = new PIXI.Point();
    this.scale = new PIXI.Point(this.MIN_SCALE, this.MIN_SCALE);
  }

  update(delta) {
    if (!this.destroyed && this.destroyedAt > 0) {
      this.destroyedDelta += delta;
      if (this.destroyedDelta > this.decayTime) {
        this.stage.removeChild(this.element);
        this.destroyed = true;
      }
    }
    if (this.destroyed) {
      return;
    }
    this.updateScale();

    this.element.scale = this.nextScale;
    if (!this.destroyed && this.element.scale.x > this.MAX_SCALE) {
      this.growing = false;
    }
    if (!this.destroyed && this.element.scale.x < this.MIN_SCALE) {
      this.growing = true;
    }
  }

  updateScale(): PIXI.Point {
    let scaleStep = this.growing ? 0.01 : -0.01;
    let x = this.scale.x += scaleStep * this.scaleSpeed;
    let y = this.scale.y += scaleStep * this.scaleSpeed;

    this.nextScale.x = x;
    this.nextScale.y = y;
  }

  destroy() {
    this.destroyedAt = Date.now();
    this.scaleSpeed = Math.random() * 22;
    this.growing = true;
  }
}