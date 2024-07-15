import Point from './point.js';
export default class Camera {
    constructor(position = new Point(0, 0), zoomLevel = 0) {
        this._positionText = document.getElementById('cameraPosition');
        this.move(position);
        this.setZoom(zoomLevel);
    }
    get position() {
        return this._position;
    }
    get zoomLevel() {
        return this._zoomLevel;
    }
    get zoomScale() {
        return this._zoomScale;
    }
    move(position) {
        this._position = position;
        this._positionText.innerText = `X: ${this._position.x.toFixed(1)}, Y: ${this._position.y.toFixed(1)}`;
    }
    zoom(level) {
        this._zoomLevel += level;
        this._zoomScale = Math.pow(1.05, this._zoomLevel);
    }
    setZoom(level) {
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
