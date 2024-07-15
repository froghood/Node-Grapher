export default class BaseNode {
    constructor(position, label, radius) {
        this._position = position;
        this.label = label;
        this.radius = radius;
        this._connections = new Set();
        this._isDeleted = false;
    }
    get connections() {
        return this._connections;
    }
    get isDeleted() {
        return this._isDeleted;
    }
    addConnection(node) {
        this._connections.add(node);
    }
    removeConnection(node) {
        this._connections.delete(node);
    }
    isPointInside(position) {
        const distance = Math.sqrt(Math.pow(this._position.x - position.x, 2) + Math.pow(this._position.y - position.y, 2));
        return distance < this.radius + 4;
    }
    delete() {
        this._isDeleted = true;
    }
}
