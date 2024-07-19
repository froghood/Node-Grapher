import Point from '../point.js';
import { Drawable } from './drawable.js';

export class Circle extends Drawable {
    radius: number;
    strokeWidth: number = 1;
    strokeOffset: number = 0.5;
    strokeColor: string | CanvasGradient | CanvasPattern = 'black';
    fillColor: string | CanvasGradient | CanvasPattern = 'white';
    image: HTMLImageElement = null;

    constructor(position: Point, radius: number) {
        super(position);

        this.radius = radius;
    }

    override render(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.fillStyle = this.fillColor;

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, Math.max(this.radius, 0), 0, Math.PI * 2);
        if (this.image) {
            ctx.save();
            ctx.clip();

            const minDimension = Math.min(this.image.width, this.image.height);
            const scaleFactor = this.radius / minDimension;

            const scaledWidth = this.image.width * scaleFactor;
            const scaledHeight = this.image.height * scaleFactor;

            ctx.translate(-scaledWidth, -scaledHeight);
            ctx.drawImage(this.image, this.position.x, this.position.y, scaledWidth * 2, scaledHeight * 2);
            ctx.restore();
        } else {
            ctx.fill();
        }

        const radiusOffset = this.radius - this.strokeWidth / 2 + this.strokeWidth * this.strokeOffset;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, Math.max(radiusOffset, 0), 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    }
}
