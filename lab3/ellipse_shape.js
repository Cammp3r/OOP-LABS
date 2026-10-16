import { Shape } from './shape.js';

export class EllipseShape extends Shape {
    static FILL_COLOR = '#00bfff';

    trace(ctx) {
        const cx = (this.xs + this.xe) / 2;
        const cy = (this.ys + this.ye) / 2;
        const rx = Math.abs(this.xe - this.xs) / 2;
        const ry = Math.abs(this.ye - this.ys) / 2;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    }

    show(ctx) {
        ctx.save();
        ctx.fillStyle = EllipseShape.FILL_COLOR;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.trace(ctx);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}
