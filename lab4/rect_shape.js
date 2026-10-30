import { Shape } from './shape.js';

export class RectShape extends Shape {
    trace(ctx) {
        const left = Math.min(this.xs, this.xe);
        const top = Math.min(this.ys, this.ye);
        const width = Math.abs(this.xe - this.xs);
        const height = Math.abs(this.ye - this.ys);
        ctx.rect(left, top, width, height);
    }

    show(ctx) {
        ctx.save();
        ctx.fillStyle = '#90ee90';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.trace(ctx);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}
