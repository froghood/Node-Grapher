import App from './app.js';
import BaseNode from './base_node.js';
import { Circle } from './drawables/circle.js';
import { Line } from './drawables/line.js';
import { Text } from './drawables/text.js';
import Point from './point.js';
export default class Subnode extends BaseNode {
    constructor(parent, position, label) {
        super(position, label, 8);
        this._parent = parent;
        this._velocity = new Point(0, 0);
    }
    get position() {
        return new Point(this._parent.position.x + this._position.x, this._parent.position.y + this._position.y);
    }
    get parent() {
        return this._parent;
    }
    select() {
        this._isSelected = true;
        App.ui.clear();
        App.ui.addPropertyText('subnode');
        App.ui.addPropertyInput('label', 'text', this.label, (e) => {
            this.label = e.target.value;
            App.graph.saveNodes();
        });
        if (this._connections.size > 0) {
            App.ui.addPropertyText('connections');
            for (const connection of this._connections) {
                App.ui.addConnection(connection.label, () => {
                    this.removeConnection(connection);
                    connection.removeConnection(this);
                    App.graph.saveConnections();
                });
            }
        }
        App.ui.addPropertyButton('delete subnode', 'delete', () => {
            this.delete();
            //App.graph.save();
        });
        console.log(this);
    }
    deselect() {
        this._isSelected = false;
        App.ui.default();
    }
    move(position, offset) {
        const angle = Math.atan2(position.y - offset.y - this._parent.position.y, position.x - offset.x - this._parent.position.x);
        this._position = new Point((this._parent.radius + 2) * Math.cos(angle), (this._parent.radius + 2) * Math.sin(angle));
    }
    isPointInside(point) {
        const distance = Math.sqrt(Math.pow(this.position.x - point.x, 2) + Math.pow(this.position.y - point.y, 2));
        return distance < this.radius + 4;
    }
    preUpdate() {
        for (const connection of this._connections) {
            if (connection.isDeleted)
                this._connections.delete(connection);
        }
        if (this._isSelected)
            return;
        let velocity = new Point(0, 0);
        for (const other of this._parent.subnodes) {
            if (this === other)
                continue;
            if (other._isSelected)
                continue;
            const distance = Math.max(Math.pow(other._position.x - this._position.x, 2) + Math.pow(other._position.y - this._position.y, 2), Number.EPSILON);
            const angle = Math.atan2(other._position.y - this._position.y, other._position.x - this._position.x);
            velocity = velocity.add(new Point((150 / distance) * Math.cos(angle), (150 / distance) * Math.sin(angle)));
        }
        for (const other of this._connections) {
            const distance = Math.max(Math.sqrt(Math.pow(other.position.x - this.position.x, 2) + Math.pow(other.position.y - this.position.y, 2)), Number.EPSILON);
            velocity = velocity.add(new Point((this.position.x - other.position.x) / distance, (this.position.y - other.position.y) / distance));
        }
        this._velocity = this._velocity.add(velocity);
    }
    update() {
        if (!this._isSelected)
            this.move(this.position, new Point(this._velocity.x, this._velocity.y));
        this._velocity = new Point(0, 0);
    }
    render() {
        const circle = new Circle(this.position, this.radius);
        circle.strokeWidth = 4;
        circle.strokeOffset = 1;
        circle.strokeColor = '#BEC4E0';
        circle.fillColor = '#8B89B3';
        App.graph.draw(circle, 3);
        this.renderConnections();
        this.renderLabel();
        if (this._isSelected)
            this.renderSelected();
    }
    toJSON() {
        return {
            position: this._position,
            label: this.label,
        };
    }
    renderConnections() {
        for (const other of this._connections) {
            const destination = new Point(this.position.x + (other.position.x - this.position.x) / 2, this.position.y + (other.position.y - this.position.y) / 2);
            const line = new Line(this.position, destination);
            line.width = 4;
            line.color = '#696489';
            App.graph.draw(line, 2);
        }
    }
    renderLabel() {
        const offsetX = Math.sign(this._position.x) * 12;
        const offsetY = Math.sign(this._position.y) * 12;
        const position = new Point(this.position.x + offsetX, this.position.y + offsetY);
        const text = new Text(position, this.label);
        text.font = 'sansserif';
        text.fontSize = 22;
        text.alignment = this._position.x < 0 ? 'right' : 'left';
        text.baseline = this._position.y < 0 ? 'bottom' : 'top';
        text.strokeWidth = 2;
        App.graph.draw(text, 4);
    }
    renderSelected() {
        const circle = new Circle(this.position, this.radius);
        circle.strokeWidth = 2;
        circle.strokeOffset = 3;
        circle.strokeColor = 'white';
        circle.fillColor = 'rgb(0,0,0,0)';
        App.graph.draw(circle, 3);
    }
}
