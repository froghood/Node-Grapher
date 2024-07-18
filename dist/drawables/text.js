import { Drawable } from './drawable.js';
export class Text extends Drawable {
    constructor(position, text) {
        super(position);
        this.font = 'serif';
        this.fontSize = 16;
        this.alignment = 'left';
        this.baseline = 'bottom';
        this.lineSpacing = 48;
        this.strokeWidth = 1;
        this.strokeColor = 'black';
        this.fillColor = 'white';
        this.text = text;
    }
    render(ctx) {
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
