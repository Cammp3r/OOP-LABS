import { Shape } from './shape.js';

export class EllipseShape extends Shape {
    constructor() {
        super();
        this.fillColor = null;
    }

    trace(ctx) {
        const cx = this.xs;
        const cy = this.ys;
        const rx = Math.abs(this.xe - this.xs);
        const ry = Math.abs(this.ye - this.ys);
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    }

    show(ctx) {
        ctx.save();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.trace(ctx);
        if (this.fillColor) {
            ctx.fillStyle = this.fillColor;
            ctx.fill();
        }
        ctx.stroke();
        ctx.restore();
    }

}
