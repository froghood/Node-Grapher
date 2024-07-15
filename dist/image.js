import Point from './point.js';
export default class NodeImage {
    constructor() {
        this._image = new Image();
        this._image.addEventListener('load', () => {
            console.log('loaded');
            this._isLoaded = true;
        });
        this._image.src = '';
    }
    get isLoaded() {
        return this._isLoaded;
    }
    get imageURL() {
        return this._image.src;
    }
    get size() {
        return new Point(this._image.width, this._image.height);
    }
    get element() {
        return this._image;
    }
    setURL(url) {
        this._isLoaded = false;
        this._image.src = url;
    }
}
