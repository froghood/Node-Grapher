import { Drawable } from './drawable.js';
export class Line extends Drawable {
    constructor(position, destination) {
        super(position);
        this.width = 1;
        this.color = 'black';
        this.destination = destination;
    }
    render(ctx) {
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
