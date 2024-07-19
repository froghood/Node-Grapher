import App from './app.js';

export default class UI {
    private properties: HTMLDivElement;
    private sourceLink: HTMLAnchorElement;

    constructor() {
        this.properties = <HTMLDivElement>document.getElementById('properties');
        this.properties.addEventListener('mousedown', (e) => e.stopPropagation());
        this.properties.addEventListener('mouseup', (e) => e.stopPropagation());
        this.properties.addEventListener('wheel', (e) => e.stopPropagation());

        this.sourceLink = <HTMLAnchorElement>document.getElementById('sourceLink');
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

    addPropertyText(text: string) {
        const pElement = document.createElement('p');
        pElement.innerText = text;
        this.properties.appendChild(pElement);
    }

    addPropertyInput(label: string, type: string, value: string, callback: (e: Event) => any) {
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

    addPropertyButton(label: string, className: string, callback: (e: MouseEvent) => any) {
        const buttonElement = document.createElement('button');
        buttonElement.innerText = label;
        buttonElement.className = className;
        buttonElement.addEventListener('click', callback);

        this.properties.appendChild(buttonElement);
    }

    addConnection(label: string, callback: (e: MouseEvent) => any) {
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
