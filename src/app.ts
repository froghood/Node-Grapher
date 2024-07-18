import Graph from './graph.js';
import Point from './point.js';
import UI from './ui.js';

export default class App {
    static graph: Graph;
    static ui: UI;

    static {
        this.graph = new Graph();
        this.ui = new UI();

        window.addEventListener('load', () => this.graph.load());
        window.addEventListener('resize', () => this.graph.resize(window.innerWidth, window.innerHeight));
        window.addEventListener('keydown', (e) => this.graph.keydown(e.key));

        window.addEventListener('mousemove', (e) => this.graph.mousemove(new Point(e.offsetX, e.offsetY)));
        window.addEventListener('mousedown', (e) => this.graph.mousedown(e.button, e.shiftKey));
        window.addEventListener('mouseup', (e) => this.graph.mouseup(e.button));
        window.addEventListener('wheel', (e) => this.graph.mousewheel(e.deltaY));
    }

    static run() {
        window.requestAnimationFrame(App.run);

        App.#preUpdate();
        App.#update();
        App.#render();
    }

    static #preUpdate() {
        this.graph.preUpdate();
    }

    static #update() {
        this.graph.update();
    }

    static #render() {
        this.graph.render();
    }
}
