import BaseNode from './base_node.js';
import App from './app.js';
import Subnode from './subnode.js';
import Point from './point.js';
import Image from './image.js';
export default class MainNode extends BaseNode {
    constructor(position, radius, label) {
        super(position, radius);
        this.label = label;
        this.image = new Image();
    }
    changeImage(url) {
        this.image.setURL(url);
    }
    createSubnode() {
        const subnode = new Subnode(this, 0, '');
        this.subnodes.push(subnode);
    }
    getHoveredSubnode(position) {
        for (let i = this.subnodes.length - 1; i >= 0; i--) {
            const subnode = this.subnodes[i];
            if (subnode.isPointInside(position))
                return subnode;
        }
        return null;
    }
    isPointInside(position) {
        const distance = Math.sqrt(Math.pow(this.position.x - position.x, 2) + Math.pow(this.position.y - position.y, 2));
        return distance < this.radius + 4;
    }
    select() {
        this.isSelected = true;
        App.ui.clear();
        App.ui.addText('node');
        App.ui.addInput('name', 'text', this.label, (e) => {
            this.label = e.target.value;
        });
        App.ui.addInput('radius', 'number', this.radius.toString(), (e) => {
            this.radius = Number(e.target.value);
        });
        App.ui.addInput('image', 'text', this.image.imageURL, (e) => {
            this.image.setURL(e.target.value);
        });
        App.ui.addButton('create subnode', '', () => {
            this.createSubnode();
        });
        App.ui.addButton('delete node', 'delete', () => {
            this.delete;
        });
    }
    deselect() {
        this.isSelected = false;
        App.ui.changeUI('main');
    }
    drag(position, offset) {
        this.position = new Point(position.x - offset.x, position.y - offset.y);
    }
    update() { }
    render(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, this.radius, this.radius, 0, 0, 360, false);
        ctx.lineWidth = 8;
        ctx.strokeStyle = 'rgb(100,100,140)';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.restore();
        if (this.image.isLoaded) {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(this.position.x, this.position.y, this.radius, this.radius, 0, 0, 360, false);
            ctx.clip();
            const minDimension = Math.min(this.image.size.x, this.image.size.y);
            const scaleFactor = (this.radius * 2) / minDimension;
            const scaledWidth = this.image.size.x * scaleFactor;
            const scaledHeight = this.image.size.y * scaleFactor;
            ctx.translate(scaledWidth / -2, scaledHeight / -2);
            ctx.drawImage(this.image.element, this.position.x, this.position.y, scaledWidth, scaledHeight);
            ctx.restore();
        }
        ctx.save();
        ctx.font = '32px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 6;
        ctx.strokeText(this.label, this.position.x, this.position.y);
        ctx.fillStyle = 'white';
        ctx.fillText(this.label, this.position.x, this.position.y);
        ctx.restore();
        if (this.isSelected) {
            this.renderSelected(ctx);
        }
        if (this.isHighlighted) {
            this.renderHighlighted(ctx);
        }
        this.renderSubnodes(ctx);
    }
    renderSelected(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, this.radius + 5, this.radius + 5, 0, 0, 360, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.restore();
    }
    renderHighlighted(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, this.radius, this.radius, 0, 0, 360, false);
        ctx.fillStyle = 'rgb(255,255,255,0.05)';
        ctx.fill();
        ctx.restore();
    }
    renderSubnodes(ctx) {
        for (const subnode of this.subnodes) {
            subnode.render(ctx);
        }
    }
    replacer(key, value) {
        switch (key) {
            case 'imageLoaded':
                return undefined;
            case 'image':
                return undefined;
            case 'subnodes':
                return undefined;
            case 'isSelected':
                return undefined;
            default:
                return value;
        }
    }
}
