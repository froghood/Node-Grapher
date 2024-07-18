import Point from '../point.js';
import { Drawable } from './drawable.js';

export class Text extends Drawable {
    text: string;

    font: string = 'serif';
    fontSize: number = 16;
    alignment: CanvasTextAlign = 'left';
    baseline: CanvasTextBaseline = 'bottom';
    lineSpacing: number = 48;
    strokeWidth: number = 1;
    strokeColor: string | CanvasGradient | CanvasPattern = 'black';
    fillColor: string | CanvasGradient | CanvasPattern = 'white';

    constructor(position: Point, text: string) {
        super(position);
        this.text = text;
    }

    override render(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        ctx.font = `${this.fontSize}px ${this.font}`;
        ctx.textAlign = this.alignment;
        ctx.textBaseline = this.baseline;
        ctx.lineWidth = this.strokeWidth * 2;
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;

        const lines = this.text.split('\\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const offsetY = i * this.lineSpacing - (this.lineSpacing * (lines.length - 1)) / 2;

            ctx.strokeText(line, this.position.x, this.position.y + offsetY);
            ctx.fillText(line, this.position.x, this.position.y + offsetY);
        }

        ctx.restore();
    }
}
