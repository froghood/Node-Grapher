import Point from '../point.js';

export abstract class Drawable {
    position: Point;

    constructor(position: Point) {
        this.position = position;
    }

    abstract render(ctx: CanvasRenderingContext2D): void;
}
