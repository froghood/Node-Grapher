export default class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    toJSON() {
        return {
            x: Number(this.x.toFixed(3)),
            y: Number(this.y.toFixed(3)),
        };
    }
    add(other) {
        return new Point(this.x + other.x, this.y + other.y);
    }
}
