import App from './app.js';
import BaseNode from './base_node.js';
import Node from './node.js';
import Point from './point.js';

export default class Subnode extends BaseNode {
    private _parent: Node;

    private _velocity: Point;

    constructor(parent: Node, position: Point, label: string) {
        super(position, label, 8);

        this._parent = parent;

        this._velocity = new Point(0, 0);
    }

    get position(): Point {
        return new Point(this._parent.position.x + this._position.x, this._parent.position.y + this._position.y);
    }

    get parent(): Node {
        return this._parent;
    }

    select() {
        this._isSelected = true;
        App.ui.clear();
        App.ui.addText('subnode');
        App.ui.addInput('label', 'text', this.label, (e) => {
            this.label = (<HTMLInputElement>e.target).value;
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

        App.ui.addButton('delete subnode', 'delete', () => {
            this.delete();
            //App.graph.save();
        });

        console.log(this);
    }

    deselect() {
        this._isSelected = false;
        App.ui.default();
    }

    move(position: Point, offset: Point) {
        const angle = Math.atan2(
            position.y - offset.y - this._parent.position.y,
            position.x - offset.x - this._parent.position.x
        );

        this._position = new Point(
            (this._parent.radius + 2) * Math.cos(angle),
            (this._parent.radius + 2) * Math.sin(angle)
        );
    }

    override isPointInside(point: Point) {
        const distance = Math.sqrt(Math.pow(this.position.x - point.x, 2) + Math.pow(this.position.y - point.y, 2));

        return distance < this.radius + 4;
    }

    preUpdate(): void {
        for (const connection of this._connections) {
            if (connection.isDeleted) this._connections.delete(connection);
        }

        if (this._isSelected) return;

        let velocity = new Point(0, 0);

        for (const other of this._parent.subnodes) {
            if (this === other) continue;
            if (other._isSelected) continue;

            const distance = Math.max(
                Math.pow(other._position.x - this._position.x, 2) + Math.pow(other._position.y - this._position.y, 2),
                Number.EPSILON
            );

            const angle = Math.atan2(other._position.y - this._position.y, other._position.x - this._position.x);

            velocity = velocity.add(new Point((150 / distance) * Math.cos(angle), (150 / distance) * Math.sin(angle)));
        }

        for (const other of this._connections) {
            const distance = Math.max(
                Math.sqrt(
                    Math.pow(other.position.x - this.position.x, 2) + Math.pow(other.position.y - this.position.y, 2)
                ),
                Number.EPSILON
            );

            velocity = velocity.add(
                new Point(
                    (this.position.x - other.position.x) / distance,
                    (this.position.y - other.position.y) / distance
                )
            );
        }

        this._velocity = this._velocity.add(velocity);
    }

    update(): void {
        if (!this._isSelected) this.move(this.position, new Point(this._velocity.x, this._velocity.y));
        this._velocity = new Point(0, 0);
    }

    render(ctx: CanvasRenderingContext2D) {
        this.renderConnections(ctx);

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(this.position.x, this.position.y, this.radius, this.radius, 0, 0, 360, false);
        ctx.lineWidth = 8;
        ctx.strokeStyle = 'rgb(100,100,140)';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.restore();

        if (this._isSelected) {
            this.renderSelected(ctx);
        }

        if (this._isHighlighted) {
            this.renderHighlighted(ctx);
        }
    }

    toJSON() {
        return {
            position: this._position,
            label: this.label,
        };
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
        ctx.ellipse(this.position.x, this.position.y, this.radius + 5, this.radius + 5, 0, 0, 360, false);
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
}
