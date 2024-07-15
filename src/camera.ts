import Point from './point.js';

export default class Camera {
    private _position: Point;
    private _zoomLevel: number;
    private _zoomScale: number;

    private _positionText: HTMLParagraphElement;

    constructor(position: Point = new Point(0, 0), zoomLevel: number = 0) {
        this._positionText = <HTMLParagraphElement>document.getElementById('cameraPosition');

        this.move(position);
        this.setZoom(zoomLevel);
    }

    get position(): Point {
        return this._position;
    }

    get zoomLevel() {
        return this._zoomLevel;
    }

    get zoomScale() {
        return this._zoomScale;
    }

    move(position: Point) {
        this._position = position;

        this._positionText.innerText = `X: ${this._position.x.toFixed(1)}, Y: ${this._position.y.toFixed(1)}`;
    }

    zoom(level: number) {
        this._zoomLevel += level;
        this._zoomScale = Math.pow(1.05, this._zoomLevel);
    }

    setZoom(level: number) {
        this._zoomLevel = level;
        this._zoomScale = Math.pow(1.05, level);
    }

    toJSON() {
        return {
            position: this._position,
            zoom: this._zoomLevel,
        };
    }
}
