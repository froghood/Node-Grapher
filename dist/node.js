import BaseNode from './base_node.js';
import App from './app.js';
import Subnode from './subnode.js';
import Point from './point.js';
import NodeImage from './image.js';
import { Circle } from './drawables/circle.js';
import { Line } from './drawables/line.js';
import { Text } from './drawables/text.js';
export default class Node extends BaseNode {
    constructor(position, radius, label) {
        super(position, label, radius);
        this._subnodes = [];
        this._image = new NodeImage();
    }
    get position() {
        return this._position;
    }
    get subnodes() {
        return this._subnodes;
    }
    setImage(url) {
        this._image.setURL(url);
    }
    addSubnode(subnode, select = true) {
        this._subnodes.push(subnode);
        if (select)
            App.graph.selectNode(subnode);
    }
    createSubnode() {
        this.deselect();
        const subnode = new Subnode(this, new Point(this.radius + 2, 0), '');
        this.addSubnode(subnode);
    }
    getHoveredSubnode(position) {
        for (let i = this._subnodes.length - 1; i >= 0; i--) {
            const subnode = this._subnodes[i];
            if (subnode.isPointInside(position))
                return subnode;
        }
        return null;
    }
    select() {
        this._isSelected = true;
        App.ui.clear();
        App.ui.addPropertyText('node');
        App.ui.addPropertyInput('label', '', this.label, (e) => {
            this.label = e.target.value;
            App.graph.saveNodes();
        });
        App.ui.addPropertyInput('radius', 'number', this.radius.toString(), (e) => {
            this.radius = Math.max(Number(e.target.value), 5);
            for (const subnode of this._subnodes) {
                subnode.move(subnode.position, new Point(0, 0));
            }
            App.graph.saveNodes();
        });
        App.ui.addPropertyInput('image', 'url', this._image.imageURL, (e) => {
            this._image.setURL(e.target.value);
            App.graph.saveNodes();
        });
        if (this._connections.size > 0) {
            App.ui.addPropertyText('connections');
            for (const connection of this._connections) {
                App.ui.addConnection(connection.label.replace('\\n', ' '), () => {
                    this.removeConnection(connection);
                    connection.removeConnection(this);
                    App.graph.saveConnections();
                });
            }
        }
        App.ui.addPropertyButton('create subnode', '', () => {
            this.createSubnode();
            App.graph.saveNodes();
        });
        App.ui.addPropertyButton('delete node', 'delete', () => {
            this.delete();
            //App.graph.saveNodes();
        });
        console.log(this);
    }
    deselect() {
        this._isSelected = false;
        App.ui.clear();
        App.ui.default();
    }
    move(position, offset) {
        this._position = new Point(position.x - offset.x, position.y - offset.y);
    }
    delete() {
        this._isDeleted = true;
        for (const subnode of this._subnodes) {
            subnode.delete();
        }
    }
    preUpdate() {
        let nodeDeleted = false;
        for (let i = this._subnodes.length - 1; i >= 0; i--) {
            if (this._subnodes[i].isDeleted) {
                this._subnodes.splice(i, 1);
                nodeDeleted = true;
            }
            else {
                this._subnodes[i].preUpdate();
            }
        }
        if (nodeDeleted) {
            App.graph.saveNodes();
            App.graph.saveConnections();
        }
    }
    update() {
        for (let i = this._subnodes.length - 1; i >= 0; i--) {
            if (this._subnodes[i].isDeleted) {
                this._subnodes.splice(i, 1);
            }
            else {
                this._subnodes[i].update();
            }
        }
    }
    render() {
        const circle = new Circle(this._position, this.radius);
        circle.strokeWidth = 4;
        circle.strokeOffset = 0;
        circle.strokeColor = '#00000080';
        circle.fillColor = '#433F5C';
        if (this._image.isLoaded)
            circle.image = this._image.element;
        App.graph.draw(circle, 1);
        const outlineCircle = new Circle(this._position, this.radius);
        outlineCircle.strokeWidth = 4;
        outlineCircle.strokeOffset = 1;
        outlineCircle.strokeColor = '#A6A8D5';
        outlineCircle.fillColor = 'transparent';
        App.graph.draw(outlineCircle, 1);
        this.renderConnections();
        this.renderLabel();
        if (this._isSelected)
            this.renderSelected();
        for (const subnode of this._subnodes) {
            subnode.render();
        }
    }
    renderLabel() {
        const text = new Text(this.position, this.label);
        text.fontSize = 32;
        text.alignment = 'center';
        text.baseline = 'middle';
        text.strokeWidth = 4;
        App.graph.draw(text, 1);
    }
    renderConnections() {
        for (const other of this._connections) {
            const destination = new Point(this.position.x + (other.position.x - this.position.x) / 2, this.position.y + (other.position.y - this.position.y) / 2);
            const line = new Line(this.position, destination);
            line.width = 4;
            line.color = '#696489';
            App.graph.draw(line, 0);
        }
    }
    renderSelected() {
        const circle = new Circle(this.position, this.radius);
        circle.strokeWidth = 2;
        circle.strokeOffset = 3;
        circle.strokeColor = 'white';
        circle.fillColor = 'rgb(0,0,0,0)';
        App.graph.draw(circle, 1);
    }
    toJSON() {
        return {
            position: this._position,
            label: this.label,
            radius: this.radius,
            image: this._image.imageURL,
            subnodes: this._subnodes,
        };
    }
}
