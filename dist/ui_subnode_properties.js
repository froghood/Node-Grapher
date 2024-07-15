export default class UISubnodeProperties {
    constructor(startVisible) {
        this.div = document.getElementById('ui_subnodeProperties');
        if (!startVisible)
            this.div.style.display = 'none';
        this.node = null;
        const labels = this.div.getElementsByTagName('label');
        const buttons = this.div.getElementsByTagName('button');
        this.labelField = labels[0].querySelector('input');
        this.deleteSubnodeButton = buttons[0];
    }
    hookNode(node) {
        this.node = node;
        this.labelField.value = node.name;
    }
    unhookNode() {
        this.node = null;
        this.labelField.value = null;
    }
}
