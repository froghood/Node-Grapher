import App from './app.js';

export default class UI {
    private div: HTMLDivElement;

    constructor() {
        this.div = <HTMLDivElement>document.getElementById('ui');

        this.div.addEventListener('mousedown', (e) => e.stopPropagation());
        this.div.addEventListener('mouseup', (e) => e.stopPropagation());
        this.div.addEventListener('wheel', (e) => e.stopPropagation());

        this.default();
    }

    blur() {
        this.div.style.pointerEvents = 'none';
    }

    unblur() {
        this.div.style.pointerEvents = 'all';
    }

    clear() {
        this.div.replaceChildren();
    }

    default() {
        this.clear();
        this.addButton('create node', '', () => {
            App.graph.createNode();
        });
    }

    addText(text: string) {
        const pElement = document.createElement('p');
        pElement.innerText = text;
        this.div.appendChild(pElement);
    }

    addInput(label: string, type: string, value: string, callback: (e: Event) => any) {
        const labelElement = document.createElement('label');
        labelElement.innerText = label;

        const inputElement = document.createElement('input');
        inputElement.type = type;
        inputElement.value = value;
        inputElement.addEventListener('input', callback);

        labelElement.appendChild(inputElement);
        this.div.appendChild(labelElement);
    }

    addButton(label: string, className: string, callback: (e: MouseEvent) => any) {
        const buttonElement = document.createElement('button');
        buttonElement.innerText = label;
        buttonElement.className = className;
        buttonElement.addEventListener('click', callback);

        this.div.appendChild(buttonElement);
    }

    addConnection(label: string, callback: (e: MouseEvent) => any) {
        console.log('t');
        const labelElement = document.createElement('label');
        labelElement.innerText = label;

        const buttonElement = document.createElement('button');
        buttonElement.innerText = 'x';
        buttonElement.className = 'smallDelete';
        buttonElement.addEventListener('click', callback);

        labelElement.appendChild(buttonElement);
        this.div.appendChild(labelElement);
    }
}
