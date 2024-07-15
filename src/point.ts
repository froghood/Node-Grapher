export default class Point {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    toJSON() {
        return {
            x: Number(this.x.toFixed(3)),
            y: Number(this.y.toFixed(3)),
        };
    }

    add(other: Point): Point {
        return new Point(this.x + other.x, this.y + other.y);
    }
}
