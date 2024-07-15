import UIMain from './ui_main.js';
import UINodeProperties from './ui_node_properties.js';
import UISubnodeProperties from './ui_subnode_properties.js';
export default class UINew {
    constructor() {
        this.div = document.getElementById('ui');
        this.uis = {
            main: new UIMain(true),
            nodeProperties: new UINodeProperties(false),
            subnodeProperties: new UISubnodeProperties(false),
        };
        this.current = this.uis.main;
    }
    changeUI(ui) {
        this.current.div.style.display = 'none';
        this.current.unhookNode();
        this.current = this.uis[ui];
        this.current.div.style.display = 'block';
    }
    hookNode(node) {
        this.current.hookNode(node);
    }
}
