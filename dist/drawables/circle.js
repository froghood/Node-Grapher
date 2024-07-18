import { Drawable } from './drawable.js';
export class Circle extends Drawable {
    constructor(position, radius) {
        super(position);
        this.strokeWidth = 1;
        this.strokeOffset = 0.5;
        this.strokeColor = 'black';
        this.fillColor = 'white';
        this.image = null;
        this.radius = radius;
    }
    render(ctx) {
        ctx.save();
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.fillStyle = this.fillColor;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
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
        }
        else {
            ctx.fill();
        }
        const radiusOffset = this.radius - this.strokeWidth / 2 + this.strokeWidth * this.strokeOffset;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, radiusOffset, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}
