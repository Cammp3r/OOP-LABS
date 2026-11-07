export const N = 102;

export class MyEditor {
    static #instance = null;

    static getInstance() {
        if (!MyEditor.#instance) {
            MyEditor.#instance = new MyEditor();
        }
        return MyEditor.#instance;
    }

    constructor() {
        if (MyEditor.#instance) {
            throw new TypeError('MyEditor вже створений');
        }
        this.documents = new Map();
        this.nextDocumentId = 1;
    }

    createDocument(canvas, onMessage, onChange) {
        const id = `document-${this.nextDocumentId++}`;
        const document = {
            id,
            canvas,
            ctx: canvas.getContext('2d'),
            shapes: [],
            selectedIndex: null,
            shapeClass: null,
            current: null,
            onMessage,
            onChange,
            handlers: null
        };
        document.handlers = {
            down: (event) => this.#onPointerDown(document, event),
            move: (event) => this.#onPointerMove(document, event),
            up: (event) => this.#onPointerUp(document, event)
        };
        canvas.addEventListener('pointerdown', document.handlers.down);
        canvas.addEventListener('pointermove', document.handlers.move);
        canvas.addEventListener('pointerup', document.handlers.up);
        this.documents.set(id, document);
        this.resize(id);
        return id;
    }

    destroyDocument(id) {
        const document = this.#getDocument(id);
        const { canvas, handlers } = document;
        canvas.removeEventListener('pointerdown', handlers.down);
        canvas.removeEventListener('pointermove', handlers.move);
        canvas.removeEventListener('pointerup', handlers.up);
        this.documents.delete(id);
    }

    destroy() {
        for (const id of this.documents.keys()) {
            this.destroyDocument(id);
        }
        MyEditor.#instance = null;
    }

    start(id, shapeClass) {
        this.#getDocument(id).shapeClass = shapeClass;
    }

    clear(id) {
        const document = this.#getDocument(id);
        document.shapes = [];
        document.current = null;
        document.selectedIndex = null;
        this.paint(id);
        document.onChange();
    }

    resize(id) {
        const document = this.#getDocument(id);
        document.canvas.width = document.canvas.clientWidth;
        document.canvas.height = document.canvas.clientHeight;
        this.paint(id);
    }

    paint(id) {
        const document = this.#getDocument(id);
        const { ctx, canvas } = document;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const shape of document.shapes) {
            shape.show(ctx);
        }
        if (
            document.selectedIndex !== null
            && document.shapes[document.selectedIndex]
        ) {
            document.shapes[document.selectedIndex].showSelection(ctx);
        }
        if (document.current) {
            document.current.showRubber(ctx);
        }
    }

    select(id, index) {
        const document = this.#getDocument(id);
        if (!Number.isInteger(index) || index < 0 || index >= document.shapes.length) {
            throw new RangeError(`Некоректний індекс об’єкта: ${index}`);
        }
        document.selectedIndex = index;
        this.paint(id);
    }

    getShapes(id) {
        return [...this.#getDocument(id).shapes];
    }

    #onPointerDown(document, event) {
        if (!document.shapeClass) {
            document.onMessage('Спочатку оберіть тип об\'єкта');
            return;
        }
        if (document.shapes.length >= N) {
            document.onMessage(`Масив заповнено (${N} об'єктів)`);
            return;
        }
        document.canvas.setPointerCapture(event.pointerId);
        const [x, y] = this.#position(document.canvas, event);
        document.current = new document.shapeClass();
        document.current.setStart(x, y);
        this.paint(document.id);
    }

    #onPointerMove(document, event) {
        if (!document.current) return;
        const [x, y] = this.#position(document.canvas, event);
        document.current.setEnd(x, y);
        this.paint(document.id);
    }

    #onPointerUp(document, event) {
        if (!document.current) return;
        const [x, y] = this.#position(document.canvas, event);
        document.current.setEnd(x, y);
        document.shapes.push(document.current);
        document.current = null;
        this.paint(document.id);
        document.onMessage(
            document.shapes.length >= N
                ? `Масив заповнено (${N} об'єктів)`
                : `Об'єктів: ${document.shapes.length} / ${N}`
        );
        document.onChange();
    }

    #position(canvas, event) {
        const bounds = canvas.getBoundingClientRect();
        return [event.clientX - bounds.left, event.clientY - bounds.top];
    }

    #getDocument(id) {
        const document = this.documents.get(id);
        if (!document) {
            throw new Error(`Документ не знайдено: ${id}`);
        }
        return document;
    }
}
