import App from './app.js';
export default class UIMain {
    constructor(startVisible) {
        this.div = document.getElementById('ui_main');
        if (!startVisible)
            this.div.style.display = 'none';
        this.createNodeButton = this.div.querySelector('button');
        this.createNodeButton.addEventListener('click', () => {
            App.graph.createNode();
        });
    }
    hookNode(node) { }
    unhookNode() { }
}
