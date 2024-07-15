import Point from './point';

export default abstract class BaseNode {
    public label: string;
    public radius: number;

    protected _position: Point;

    protected _isSelected: boolean;
    protected _isHighlighted: boolean;

    protected _connections: Set<BaseNode>;

    protected _isDeleted: boolean;

    constructor(position: Point, label: string, radius: number) {
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

    abstract get position(): Point;

    abstract preUpdate(): void;
    abstract update(): void;
    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract move(position: Point, offset: Point): void;
    abstract select(): void;
    abstract deselect(): void;
    abstract toJSON(): any;

    addConnection(node: BaseNode): void {
        this._connections.add(node);
    }

    removeConnection(node: BaseNode): void {
        this._connections.delete(node);
    }

    isPointInside(position: Point): boolean {
        const distance = Math.sqrt(
            Math.pow(this._position.x - position.x, 2) + Math.pow(this._position.y - position.y, 2)
        );

        return distance < this.radius + 4;
    }

    delete() {
        this._isDeleted = true;
    }
}
