var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _App_preUpdate, _App_update, _App_render;
import Graph from './graph.js';
import Point from './point.js';
import UI from './ui.js';
class App {
    static run() {
        window.requestAnimationFrame(_a.run);
        __classPrivateFieldGet(_a, _a, "m", _App_preUpdate).call(_a);
        __classPrivateFieldGet(_a, _a, "m", _App_update).call(_a);
        __classPrivateFieldGet(_a, _a, "m", _App_render).call(_a);
    }
}
_a = App, _App_preUpdate = function _App_preUpdate() {
    this.graph.preUpdate();
}, _App_update = function _App_update() {
    this.graph.update();
}, _App_render = function _App_render() {
    this.graph.render();
};
(() => {
    _a.graph = new Graph();
    _a.ui = new UI();
    window.addEventListener('load', () => _a.graph.load());
    window.addEventListener('resize', () => _a.graph.resize(window.innerWidth, window.innerHeight));
    window.addEventListener('keydown', (e) => _a.graph.keydown(e.key));
    window.addEventListener('mousemove', (e) => _a.graph.mousemove(new Point(e.offsetX, e.offsetY)));
    window.addEventListener('mousedown', (e) => _a.graph.mousedown(e.shiftKey));
    window.addEventListener('mouseup', () => _a.graph.mouseup());
    window.addEventListener('wheel', (e) => _a.graph.mousewheel(e.deltaY));
    //window.addEventListener('contextmenu', (e) => e.preventDefault());
})();
export default App;
