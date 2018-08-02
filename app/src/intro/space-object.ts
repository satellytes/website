import {Graphics, Container, Point} from 'pixi.js'

export abstract class SpaceObject {
  public element: Graphics;

  constructor(protected stage: Container, protected position: Point) {
    this.element = new Graphics();
    this.element.x = position.x;
    this.element.y = position.y;
    // add element to stage
    this.stage.addChild(this.element);
  }

  abstract update(delta: number);

  abstract destroy();
}


