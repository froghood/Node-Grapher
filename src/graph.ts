import App from './app.js';
import Camera from './camera.js';
import Node from './node.js';
import Point from './point.js';
import BaseNode from './base_node.js';
import Subnode from './subnode.js';

export default class Graph {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    private _nodes: Node[];
    private _camera: Camera;

    private _mousePosition: Point;
    private _mouseWorldPosition: Point;
    private _prevMousePosition: Point;
    private _mouseMovement: Point;
    private _draggingOffset: Point;

    private _hoveredNode: BaseNode = null;
    private _selectedNode: BaseNode = null;
    private _connectingNode: BaseNode = null;

    private _isDraggingNode: boolean;
    private _isDraggingCamera: boolean;

    constructor() {
        this._canvas = <HTMLCanvasElement>document.getElementById('graphCanvas');

        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        this._canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        this._ctx = this._canvas.getContext('2d');

        this._nodes = [];
        this._camera = new Camera();

        this._mousePosition = new Point(0, 0);
        this._mouseWorldPosition = new Point(0, 0);
        this._prevMousePosition = new Point(0, 0);
        this._mouseMovement = new Point(0, 0);
    }

    get selectedNode(): BaseNode {
        return this._selectedNode;
    }

    preUpdate() {
        if (this.selectedNode?.isDeleted) {
            this.deselectNode();
        }

        let nodeDeleted = false;

        for (let i = this._nodes.length - 1; i >= 0; i--) {
            if (this._nodes[i].isDeleted) {
                this._nodes.splice(i, 1);
                nodeDeleted = true;
            }
        }

        if (nodeDeleted) {
            this.saveNodes();
            this.saveConnections();
        }

        for (const node of this._nodes) {
            node.preUpdate();
        }
    }

    update(): void {
        for (let i = this._nodes.length - 1; i >= 0; i--) {
            this._nodes[i].update();
        }

        this._mouseMovement = new Point(
            this._mousePosition.x - this._prevMousePosition.x,
            this._mousePosition.y - this._prevMousePosition.y
        );

        this._hoveredNode = this.getHoveredNode(this._mouseWorldPosition);

        if (this._hoveredNode) {
            this._canvas.style.cursor = 'pointer';
        } else {
            this._canvas.style.cursor = '';
        }

        if (this._isDraggingNode) {
            this._selectedNode.move(this._mouseWorldPosition, this._draggingOffset);
        }

        if (this._isDraggingCamera) {
            this._camera.move(
                new Point(
                    this._camera.position.x - this._mouseMovement.x / this._camera.zoomScale,
                    this._camera.position.y - this._mouseMovement.y / this._camera.zoomScale
                )
            );
        }

        this._prevMousePosition = this._mousePosition;
    }

    render() {
        //this.ctx.beginPath();
        this._ctx.fillStyle = 'rgb(30,30,30)';
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

        this._ctx.translate(this._canvas.width / 2, this._canvas.height / 2);
        this._ctx.scale(this._camera.zoomScale, this._camera.zoomScale);
        this._ctx.translate(-this._camera.position.x, -this._camera.position.y);

        // this.ctx.translate(this.canvas.width / 2 + this.camera.x, this.canvas.height / 2 + this.camera.y);
        // this.ctx.scale(this.zoomScale, this.zoomScale);

        this._nodes.forEach((node) => {
            node.render(this._ctx);
        });

        this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    addNode(node: Node, select: boolean = true): void {
        this._nodes.push(node);
        if (select) this.selectNode(node);
        this.saveNodes();
    }

    createNode() {
        const node = new Node(new Point(this._camera.position.x, this._camera.position.y), 60, '');

        this.addNode(node);
    }

    deleteNode(node: Node) {
        console.log('deleting node');
        console.log(this._nodes.indexOf(node));

        this._nodes.splice(this._nodes.indexOf(node), 1);
        if (this._selectedNode == node) this.deselectNode();

        this.saveNodes();
    }

    selectNode(node: BaseNode) {
        this._selectedNode = node;
        node.select();
    }

    deselectNode() {
        this._selectedNode.deselect();
        this._selectedNode = null;
    }

    saveCamera() {
        console.log('saving camera');

        const json = JSON.stringify(this._camera);

        localStorage.setItem('camera', json);
    }

    saveNodes() {
        console.log('saving nodes');

        const json = `[${this._nodes.map((e) => JSON.stringify(e)).join(',')}]`;

        localStorage.setItem('nodes', json);
    }

    saveConnections() {
        console.log('saving connections');

        const indexMap = new Map<BaseNode, number[]>();
        const connections: number[][][] = [];

        for (let i = 0; i < this._nodes.length; i++) {
            const node = this._nodes[i];

            if (node.connections.size > 0) {
                for (const connection of node.connections) {
                    if (indexMap.has(connection)) connections.push([indexMap.get(connection), [i, -1]]);
                    else indexMap.set(node, [i, -1]);
                }
            }

            for (let j = 0; j < node.subnodes.length; j++) {
                const subnode = node.subnodes[j];

                if (subnode.connections.size > 0) {
                    for (const subnodeConnection of subnode.connections) {
                        if (indexMap.has(subnodeConnection)) {
                            connections.push([indexMap.get(subnodeConnection), [i, j]]);
                        } else indexMap.set(subnode, [i, j]);
                    }
                }
            }
        }

        localStorage.setItem('connections', JSON.stringify(connections));
    }

    save() {
        console.log('saving all');

        this.saveCamera();
        this.saveNodes();
        this.saveConnections();
    }

    loadCamera() {
        const json = JSON.parse(localStorage.getItem('camera'));

        this._camera.move(new Point(json.position.x, json.position.y));
        this._camera.setZoom(json.zoom);
    }

    loadNodes() {
        const data = localStorage.getItem('nodes');

        const asObjects = JSON.parse(data);

        for (const json of asObjects) {
            const node = new Node(json.position, json.radius, json.label);
            node.setImage(json.image);
            for (const subnodeJson of json.subnodes) {
                const subnode = new Subnode(node, subnodeJson.position, subnodeJson.label);
                node.addSubnode(subnode, false);
            }
            this.addNode(node, false);
        }
    }

    loadConnections() {
        const json = JSON.parse(localStorage.getItem('connections'));

        console.log(json);

        for (const connection of json) {
            const nodeIndexA = connection[0][0];
            const subnodeIndexA = connection[0][1];

            const nodeIndexB = connection[1][0];
            const subnodeIndexB = connection[1][1];

            console.log(`[${nodeIndexA}, ${subnodeIndexA}] <-> [${nodeIndexB}, ${subnodeIndexB}]`);

            const nodeA = subnodeIndexA < 0 ? this._nodes[nodeIndexA] : this._nodes[nodeIndexA].subnodes[subnodeIndexA];
            const nodeB = subnodeIndexB < 0 ? this._nodes[nodeIndexB] : this._nodes[nodeIndexB].subnodes[subnodeIndexB];

            nodeA.addConnection(nodeB);
            nodeB.addConnection(nodeA);
        }
    }

    load() {
        this.loadCamera();
        this.loadNodes();
        this.loadConnections();
    }

    resize(width: number, height: number) {
        this._canvas.width = width;
        this._canvas.height = height;
    }

    keydown(key: string): void {
        console.log(key);

        if (key === 'Delete') this.selectedNode?.delete();
    }

    mousemove(position: Point): void {
        this._mousePosition = position;
        this._mouseWorldPosition = this.screenSpaceToWorldSpace(position);
    }

    mousedown(shift: boolean): any {
        if (this._hoveredNode) {
            if (shift) {
                this._connectingNode = this._hoveredNode;
            } else {
                if (this._selectedNode && this._hoveredNode != this._selectedNode) this.deselectNode();
                this.selectNode(this._hoveredNode);

                this._isDraggingNode = true;

                this._draggingOffset = new Point(
                    this._mouseWorldPosition.x - this._selectedNode.position.x,
                    this._mouseWorldPosition.y - this._selectedNode.position.y
                );
            }
        } else {
            if (this._selectedNode) {
                this.deselectNode();
            }

            this._isDraggingCamera = true;
        }

        App.ui.blur();
    }

    mouseup(): any {
        if (this._isDraggingNode) this.saveNodes();
        if (this._isDraggingCamera) this.saveCamera();

        if (this._hoveredNode && this._connectingNode && this._hoveredNode != this._connectingNode) {
            this._connectingNode.addConnection(this._hoveredNode);
            this._hoveredNode.addConnection(this._connectingNode);
            this._connectingNode = null;
            this.saveConnections();
        }

        this._isDraggingNode = false;
        this._isDraggingCamera = false;

        App.ui.unblur();
    }

    mousewheel(delta: number): any {
        this._camera.zoom(-Math.sign(delta));

        this._mouseWorldPosition = this.screenSpaceToWorldSpace(this._mousePosition);

        this.saveCamera();
    }

    private getHoveredNode(position: Point): BaseNode {
        for (let i = this._nodes.length - 1; i >= 0; i--) {
            const node = this._nodes[i];

            for (let j = node.subnodes.length - 1; j >= 0; j--) {
                const subnode = node.subnodes[j];

                if (subnode.isPointInside(position)) return subnode;
            }

            if (node.isPointInside(position)) return node;
        }

        return null;
    }

    private screenSpaceToWorldSpace(screenPos: Point): Point {
        const worldX = (screenPos.x - this._canvas.width / 2) / this._camera.zoomScale + this._camera.position.x;
        const worldY = (screenPos.y - this._canvas.height / 2) / this._camera.zoomScale + this._camera.position.y;
        return new Point(worldX, worldY);
    }

    private worldSpaceToScreenSpace(worldPos: Point): Point {
        const screenX = (worldPos.x - this._camera.position.x) * this._camera.zoomScale + this._canvas.width / 2;
        const screenY = (worldPos.y - this._camera.position.y) * this._camera.zoomScale + this._canvas.height / 2;
        return new Point(screenX, screenY);
    }
}
