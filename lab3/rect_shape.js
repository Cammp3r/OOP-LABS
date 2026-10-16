import { Shape } from './shape.js';

export class RectShape extends Shape {
    trace(ctx) {
        const dx = Math.abs(this.xe - this.xs);
        const dy = Math.abs(this.ye - this.ys);
        ctx.rect(this.xs - dx, this.ys - dy, dx * 2, dy * 2);
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
