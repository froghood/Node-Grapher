import Point from '../point.js';
import { Drawable } from './drawable.js';

export class Line extends Drawable {
    destination: Point;
    width: number = 1;
    color: string | CanvasGradient | CanvasPattern = 'black';

    constructor(position: Point, destination: Point) {
        super(position);
        this.destination = destination;
    }

    override render(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;

        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.destination.x, this.destination.y);
        ctx.stroke();

        ctx.restore();
    }
}
