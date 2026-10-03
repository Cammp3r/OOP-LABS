import { Shape } from './shape.js';

export class EllipseShape extends Shape {
    trace(ctx) {
        const rx = Math.abs(this.xe - this.xs);
        const ry = Math.abs(this.ye - this.ys);
        ctx.ellipse(this.xs, this.ys, rx, ry, 0, 0, Math.PI * 2);
    }

    show(ctx) {
        ctx.save();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.trace(ctx);
        ctx.stroke();
        ctx.restore();
    }
}
