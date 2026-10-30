import { Shape } from './shape.js';
import { LineShape } from './line_shape.js';
import { EllipseShape } from './ellipse_shape.js';

export class LineCirclesShape extends Shape {
    static RADIUS = 5;

    constructor() {
        super();
        this.line = new LineShape();
        this.startCircle = new EllipseShape();
        this.endCircle = new EllipseShape();
        this.startCircle.fillColor = '#00bfff';
        this.endCircle.fillColor = '#00bfff';
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
        ctx.moveTo(this.xs, this.ys);
        ctx.lineTo(this.xe, this.ye);
    }

    show(ctx) {
        this.line.show(ctx);
        this.startCircle.show(ctx);
        this.endCircle.show(ctx);
    }

    showRubber(ctx) {
        ctx.save();
        ctx.strokeStyle = '#0066ff';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        this.line.trace(ctx);
        this.startCircle.trace(ctx);
        this.endCircle.trace(ctx);
        ctx.stroke();
        ctx.restore();
    }

    #syncParts() {
        this.line.setStart(this.xs, this.ys);
        this.line.setEnd(this.xe, this.ye);
        this.#setCircle(this.startCircle, this.xs, this.ys);
        this.#setCircle(this.endCircle, this.xe, this.ye);
    }

    #setCircle(circle, x, y) {
        circle.setStart(x, y);
        circle.setEnd(
            x + LineCirclesShape.RADIUS,
            y + LineCirclesShape.RADIUS
        );
    }
}
