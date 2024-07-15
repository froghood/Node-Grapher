import App from './app.js';
export default class UINodeProperties {
    constructor(startVisible) {
        this.div = document.getElementById('ui_nodeProperties');
        if (!startVisible)
            this.div.style.display = 'none';
        this.node = null;
        const labels = this.div.getElementsByTagName('label');
        const buttons = this.div.getElementsByTagName('button');
        this.nameField = labels[0].querySelector('input');
        this.sizeField = labels[1].querySelector('input');
        this.imageField = labels[2].querySelector('input');
        this.createSubnodeButton = buttons[0];
        this.deleteNodeButton = buttons[1];
        this.imageField.addEventListener('input', () => {
            if (this.node)
                this.node.changeImage(this.imageField.value);
            App.graph.saveNodes();
        });
        this.sizeField.addEventListener('input', () => {
            if (this.node)
                this.node.radius = Number(this.sizeField.value);
            App.graph.saveNodes();
        });
        this.nameField.addEventListener('input', () => {
            if (this.node)
                this.node.name = this.nameField.value;
            App.graph.saveNodes();
        });
        this.createSubnodeButton.addEventListener('click', () => {
            this.node.createSubnode();
        });
        this.deleteNodeButton.addEventListener('click', () => {
            if (this.node)
                App.graph.deleteNode(this.node);
        });
    }
    hookNode(node) {
        this.node = node;
        this.nameField.value = node.name;
        this.sizeField.value = node.radius;
        this.imageField.value = node.imageURL;
    }
    unhookNode() {
        this.node = null;
        this.nameField.value = null;
        this.sizeField.value = null;
        this.imageField.value = null;
    }
    focusName() {
        this.nameField.focus();
    }
}
