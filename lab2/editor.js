import { PointShape } from './point_shape.js';
import { LineShape } from './line_shape.js';
import { RectShape } from './rect_shape.js';
import { EllipseShape } from './ellipse_shape.js';

const N = 102;
const SHAPE_CLASSES = {
    point: PointShape,
    line: LineShape,
    rect: RectShape,
    ellipse: EllipseShape
};

export class Editor {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.pcshape = new Array(N).fill(null);
        this.count = 0;
        this.currentType = 'point';
        this.current = null;
        this.onMessage = () => {};

        canvas.addEventListener('pointerdown', (e) => this.#onDown(e));
        canvas.addEventListener('pointermove', (e) => this.#onMove(e));
        canvas.addEventListener('pointerup', (e) => this.#onUp(e));
    }

    setType(type) {
        this.currentType = type;
    }

    clear() {
        this.pcshape.fill(null);
        this.count = 0;
        this.current = null;
        this.repaint();
    }

    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.repaint();
    }

    repaint() {
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < this.count; i++) {
            this.pcshape[i].show(ctx);
        }
        if (this.current) {
            this.current.showRubber(ctx);
        }
    }

    #pos(e) {
        const r = this.canvas.getBoundingClientRect();
        return [e.clientX - r.left, e.clientY - r.top];
    }

    #onDown(e) {
        if (this.count >= N) {
            this.onMessage(`Масив заповнено (${N} об'єктів)`);
            return;
        }
        this.canvas.setPointerCapture(e.pointerId);
        const [x, y] = this.#pos(e);
        this.current = new SHAPE_CLASSES[this.currentType]();
        this.current.setStart(x, y);
        this.repaint();
    }

    #onMove(e) {
        if (!this.current) return;
        const [x, y] = this.#pos(e);
        this.current.setEnd(x, y);
        this.repaint();
    }

    #onUp(e) {
        if (!this.current) return;
        const [x, y] = this.#pos(e);
        this.current.setEnd(x, y);
        this.pcshape[this.count++] = this.current;
        this.current = null;
        this.repaint();
        this.onMessage(
            this.count >= N
                ? `Масив заповнено (${N} об'єктів)`
                : `Об'єктів: ${this.count} / ${N}`
        );
    }
}
