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

  abstract destroy();
}


