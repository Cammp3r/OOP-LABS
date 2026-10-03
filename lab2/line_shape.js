import { Shape } from './shape.js';

export class LineShape extends Shape {
    trace(ctx) {
        ctx.moveTo(this.xs, this.ys);
        ctx.lineTo(this.xe, this.ye);
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
