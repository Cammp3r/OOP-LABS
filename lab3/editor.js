export const N = 103;

export class ShapeEditor {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.pcshape = null;
        this.count = 0;
        this.shapeClass = null;
        this.current = null;
        this.onMessage = () => {};

        this.#allocate();

        this.onLBtnDown = this.onLBtnDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onLBtnUp = this.onLBtnUp.bind(this);
        canvas.addEventListener('pointerdown', this.onLBtnDown);
        canvas.addEventListener('pointermove', this.onMouseMove);
        canvas.addEventListener('pointerup', this.onLBtnUp);
    }

    #allocate() {
        this.pcshape = new Array(N).fill(null);
        this.count = 0;
    }

    destroy() {
        this.canvas.removeEventListener('pointerdown', this.onLBtnDown);
        this.canvas.removeEventListener('pointermove', this.onMouseMove);
        this.canvas.removeEventListener('pointerup', this.onLBtnUp);
        this.pcshape = null;
        this.count = 0;
    }

    start(shapeClass) {
        this.shapeClass = shapeClass;
    }

    clear() {
        this.#allocate();
        this.current = null;
        this.onPaint();
    }

    onSize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.onPaint();
    }

    onPaint() {
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < this.count; i++) {
            this.pcshape[i].show(ctx);
        }
        if (this.current) {
            this.current.showRubber(ctx);
        }
    }

    onLBtnDown(e) {
        if (!this.shapeClass) {
            this.onMessage('Спочатку оберіть тип об\'єкта');
            return;
        }
        if (this.count >= N) {
            this.onMessage(`Масив заповнено (${N} об'єктів)`);
            return;
        }
        this.canvas.setPointerCapture(e.pointerId);
        const [x, y] = this.#pos(e);
        this.current = new this.shapeClass();
        this.current.setStart(x, y);
        this.onPaint();
    }

    onMouseMove(e) {
        if (!this.current) return;
        const [x, y] = this.#pos(e);
        this.current.setEnd(x, y);
        this.onPaint();
    }

    onLBtnUp(e) {
        if (!this.current) return;
        const [x, y] = this.#pos(e);
        this.current.setEnd(x, y);
        this.pcshape[this.count++] = this.current;
        this.current = null;
        this.onPaint();
        this.onMessage(
            this.count >= N
                ? `Масив заповнено (${N} об'єктів)`
                : `Об'єктів: ${this.count} / ${N}`
        );
    }

    #pos(e) {
        const r = this.canvas.getBoundingClientRect();
        return [e.clientX - r.left, e.clientY - r.top];
    }
}
