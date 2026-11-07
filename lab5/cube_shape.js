import { Shape } from './shape.js';
import { LineShape } from './line_shape.js';
import { RectShape } from './rect_shape.js';

export class CubeShape extends Shape {
    static OFFSET = 20;

    constructor() {
        super();
        this.front = new RectShape();
        this.back = new RectShape();
        this.front.fillColor = null;
        this.back.fillColor = null;
        this.edges = [
            new LineShape(),
            new LineShape(),
            new LineShape(),
            new LineShape()
        ];
    }

    setStart(x, y) {
        super.setStart(x, y);
        this.#syncParts();
    }

    setEnd(x, y) {
        super.setEnd(x, y);
        this.#syncParts();
    }

    trace(ctx) {
        this.front.trace(ctx);
        this.back.trace(ctx);
        for (const edge of this.edges) {
            edge.trace(ctx);
        }
    }

    show(ctx) {
        this.front.show(ctx);
        this.back.show(ctx);
        for (const edge of this.edges) {
            edge.show(ctx);
        }
    }

    showRubber(ctx) {
        ctx.save();
        ctx.strokeStyle = 'darkblue';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        this.front.trace(ctx);
        this.back.trace(ctx);
        for (const edge of this.edges) {
            edge.trace(ctx);
        }
        ctx.stroke();
        ctx.restore();
    }

    #bounds() {
        return [
            Math.min(this.xs, this.xe),
            Math.min(this.ys, this.ye),
            Math.max(this.xs, this.xe),
            Math.max(this.ys, this.ye)
        ];
    }

    #syncParts() {
        const [left, top, right, bottom] = this.#bounds();
        const offset = Math.min(
            CubeShape.OFFSET,
            Math.max(4, (right - left) / 3),
            Math.max(4, (bottom - top) / 3)
        );
        const backLeft = left + offset;
        const backTop = top + offset;
        const backRight = right + offset;
        const backBottom = bottom + offset;

        this.front.setStart(left, top);
        this.front.setEnd(right, bottom);
        this.back.setStart(backLeft, backTop);
        this.back.setEnd(backRight, backBottom);

        const points = [
            [left, top, backLeft, backTop],
            [right, top, backRight, backTop],
            [left, bottom, backLeft, backBottom],
            [right, bottom, backRight, backBottom]
        ];
        this.edges.forEach((edge, index) => {
            const [x1, y1, x2, y2] = points[index];
            edge.setStart(x1, y1);
            edge.setEnd(x2, y2);
        });
    }
}
