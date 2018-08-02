
import {Point} from 'pixi.js'
import { SpaceObject } from './space-object';


export class Satellite extends SpaceObject {
  private direction: Point;
  private speed: number;

  constructor(protected stage, protected positon) {
    super(stage, positon);
    this.element.beginFill(0xffffff);
    this.element.drawCircle(0, 0, 1);
    this.element.endFill();
    this.direction = new Point(Math.random() - 0.5, Math.random() - 0.5);
    this.speed = Math.random() * 2 + 0.2;
  }
  update(delta) {
    this.element.x += this.direction.x * this.speed;
    this.element.y += this.direction.y * this.speed;
  }

  destroy() {
    this.speed = 20;
    setTimeout(() => this.stage.removeChild(this.element), Math.random() * 400);
  }
}
