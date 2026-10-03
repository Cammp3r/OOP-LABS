import { Shape } from './shape.js';

export class RectShape extends Shape {
    static FILL_COLOR = '#00bfff';

    trace(ctx) {
        const x = Math.min(this.xs, this.xe);
        const y = Math.min(this.ys, this.ye);
        ctx.rect(x, y, Math.abs(this.xe - this.xs), Math.abs(this.ye - this.ys));
    }

    show(ctx) {
        ctx.save();
        ctx.fillStyle = RectShape.FILL_COLOR;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.trace(ctx);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}
