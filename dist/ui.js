import App from './app.js';
export default class UI {
    constructor() {
        this.properties = document.getElementById('properties');
        this.properties.addEventListener('mousedown', (e) => e.stopPropagation());
        this.properties.addEventListener('mouseup', (e) => e.stopPropagation());
        this.properties.addEventListener('wheel', (e) => e.stopPropagation());
        this.sourceLink = document.getElementById('sourceLink');
        this.sourceLink.addEventListener('mousedown', (e) => e.stopPropagation());
        this.sourceLink.addEventListener('mouseup', (e) => e.stopPropagation());
        this.default();
    }
    blur() {
        this.properties.style.pointerEvents = 'none';
        this.sourceLink.style.pointerEvents = 'none';
    }
    unblur() {
        this.properties.style.pointerEvents = 'all';
        this.sourceLink.style.pointerEvents = 'all';
    }
    clear() {
        this.properties.replaceChildren();
    }
    default() {
        this.clear();
        this.addPropertyButton('create node', '', () => {
            App.graph.createNode();
        });
    }
    addPropertyText(text) {
        const pElement = document.createElement('p');
        pElement.innerText = text;
        this.properties.appendChild(pElement);
    }
    addPropertyInput(label, type, value, callback) {
        const labelElement = document.createElement('label');
        labelElement.innerText = label;
        const inputElement = document.createElement('input');
        inputElement.type = type;
        inputElement.min = '5';
        inputElement.value = value;
        inputElement.addEventListener('input', callback);
        labelElement.appendChild(inputElement);
        this.properties.appendChild(labelElement);
    }
    addPropertyButton(label, className, callback) {
        const buttonElement = document.createElement('button');
        buttonElement.innerText = label;
        buttonElement.className = className;
        buttonElement.addEventListener('click', callback);
        this.properties.appendChild(buttonElement);
    }
    addConnection(label, callback) {
        console.log('t');
        const labelElement = document.createElement('label');
        labelElement.innerText = label;
        const buttonElement = document.createElement('button');
        buttonElement.innerText = 'x';
        buttonElement.className = 'smallDelete';
        buttonElement.addEventListener('click', (e) => {
            callback(e);
            this.properties.removeChild(labelElement);
        });
        labelElement.appendChild(buttonElement);
        this.properties.appendChild(labelElement);
    }
}
