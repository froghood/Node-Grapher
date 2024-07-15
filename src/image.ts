import Point from './point.js';

export default class NodeImage {
    private _image: HTMLImageElement;
    private _isLoaded: boolean;

    constructor() {
        this._image = new Image();
        this._image.addEventListener('load', () => {
            console.log('loaded');
            this._isLoaded = true;
        });
        this._image.src = '';
    }

    get isLoaded(): boolean {
        return this._isLoaded;
    }

    get imageURL(): string {
        return this._image.src;
    }

    get size(): Point {
        return new Point(this._image.width, this._image.height);
    }

    get element(): HTMLImageElement {
        return this._image;
    }

    setURL(url: string): void {
        this._isLoaded = false;
        this._image.src = url;
    }
}
