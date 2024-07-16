import BaseNode from './base_node.js';
import App from './app.js';
import Subnode from './subnode.js';
import Point from './point.js';
import NodeImage from './image.js';
import UI from './ui.js';

export default class Node extends BaseNode {
    private _subnodes: Subnode[];

    private _image: NodeImage;

    constructor(position: Point, radius: number, label: string) {
        super(position, label, radius);

        this._subnodes = [];

        this._image = new NodeImage();
    }

    get position(): Point {
        return this._position;
    }

    get subnodes(): Subnode[] {
        return this._subnodes;
    }

    setImage(url: string) {
        this._image.setURL(url);
    }

    addSubnode(subnode: Subnode, select: boolean = true): void {
        this._subnodes.push(subnode);
        if (select) App.graph.selectNode(subnode);
    }

    createSubnode() {
        this.deselect();

        const subnode = new Subnode(this, new Point(this.radius + 2, 0), '');
        this.addSubnode(subnode);
    }

    getHoveredSubnode(position: Point) {
        for (let i = this._subnodes.length - 1; i >= 0; i--) {
            const subnode = this._subnodes[i];

            if (subnode.isPointInside(position)) return subnode;
        }
        return null;
    }

    select() {
        this._isSelected = true;
        App.ui.clear();
        App.ui.addText('node');
        App.ui.addInput('label', '', this.label, (e) => {
            this.label = (<HTMLInputElement>e.target).value;
            App.graph.saveNodes();
        });
        App.ui.addInput('radius', 'number', this.radius.toString(), (e) => {
            this.radius = Number((<HTMLInputElement>e.target).value);
            for (const subnode of this._subnodes) {
                subnode.move(subnode.position, new Point(0, 0));
            }
            App.graph.saveNodes();
        });
        App.ui.addInput('image', 'url', this._image.imageURL, (e) => {
            this._image.setURL((<HTMLInputElement>e.target).value);
            App.graph.saveNodes();
        });

        if (this._connections.size > 0) {
            App.ui.addText('connections');
            for (const connection of this._connections) {
                App.ui.addConnection(connection.label, () => {
                    this.removeConnection(connection);
                    connection.removeConnection(this);
                    App.graph.saveConnections();
                });
            }
        }

        App.ui.addButton('create subnode', '', () => {
            this.createSubnode();
            App.graph.saveNodes();
        });
        App.ui.addButton('delete node', 'delete', () => {
            this.delete();
            //App.graph.saveNodes();
        });

        console.log(this);
    }

    deselect(): void {
        this._isSelected = false;
        App.ui.clear();
        App.ui.default();
    }

    move(position: Point, offset: Point): void {
        this._position = new Point(position.x - offset.x, position.y - offset.y);
    }

    override delete(): void {
        this._isDeleted = true;
        for (const subnode of this._subnodes) {
            subnode.delete();
        }
    }

    preUpdate(): void {
        let nodeDeleted = false;

        for (let i = this._subnodes.length - 1; i >= 0; i--) {
            if (this._subnodes[i].isDeleted) {
                this._subnodes.splice(i, 1);
                nodeDeleted = true;
            } else {
                this._subnodes[i].preUpdate();
            }
        }

        if (nodeDeleted) {
            App.graph.saveNodes();
            App.graph.saveConnections();
        }
    }

    update(): void {
        for (let i = this._subnodes.length - 1; i >= 0; i--) {
            if (this._subnodes[i].isDeleted) {
                this._subnodes.splice(i, 1);
            } else {
                this._subnodes[i].update();
            }
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        this.renderConnections(ctx);

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(this._position.x, this._position.y, this.radius, this.radius, 0, 0, 360, false);
        ctx.lineWidth = 8;
        ctx.strokeStyle = 'rgb(100,100,140)';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.restore();

        if (this._image.isLoaded) {
            ctx.save();

            ctx.beginPath();
            ctx.ellipse(this._position.x, this._position.y, this.radius, this.radius, 0, 0, 360, false);
            ctx.clip();

            const minDimension = Math.min(this._image.size.x, this._image.size.y);
            const scaleFactor = (this.radius * 2) / minDimension;

            const scaledWidth = this._image.size.x * scaleFactor;
            const scaledHeight = this._image.size.y * scaleFactor;

            ctx.translate(scaledWidth / -2, scaledHeight / -2);
            ctx.drawImage(this._image.element, this._position.x, this._position.y, scaledWidth, scaledHeight);
            ctx.restore();
        }

        this.renderLabel(ctx);

        if (this._isSelected) {
            this.renderSelected(ctx);
        }

        if (this._isHighlighted) {
            this.renderHighlighted(ctx);
        }

        for (const subnode of this._subnodes) {
            subnode.render(ctx);
        }
    }

    private renderLabel(ctx: CanvasRenderingContext2D) {
        const lines = this.label.split('\\n');
        const lineSpacing = 48;

        //console.log(lines);

        ctx.save();
        ctx.font = '32px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 6;
        ctx.fillStyle = 'white';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            ctx.strokeText(
                line,
                this._position.x,
                this._position.y + i * lineSpacing - (lineSpacing * (lines.length - 1)) / 2
            );
            ctx.fillText(
                line,
                this._position.x,
                this._position.y + i * lineSpacing - (lineSpacing * (lines.length - 1)) / 2
            );
        }

        ctx.restore();
    }

    private renderConnections(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.lineWidth = 4;
        for (const other of this._connections) {
            ctx.beginPath();
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(
                this.position.x + (other.position.x - this.position.x) / 2,
                this.position.y + (other.position.y - this.position.y) / 2
            );
            ctx.stroke();
        }
        ctx.restore();
    }

    private renderSelected(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(this._position.x, this._position.y, this.radius + 5, this.radius + 5, 0, 0, 360, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.restore();
    }

    private renderHighlighted(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(this._position.x, this._position.y, this.radius, this.radius, 0, 0, 360, false);
        ctx.fillStyle = 'rgb(255,255,255,0.05)';
        ctx.fill();
        ctx.restore();
    }

    toJSON(): any {
        return {
            position: this._position,
            label: this.label,
            radius: this.radius,
            image: this._image.imageURL,
            subnodes: this._subnodes,
        };
    }
}
