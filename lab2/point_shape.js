import { Shape } from './shape.js';

export class PointShape extends Shape {
    static RADIUS = 2;

    trace(ctx) {
        ctx.arc(this.xe, this.ye, PointShape.RADIUS, 0, Math.PI * 2);
    }

    show(ctx) {
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        this.trace(ctx);
        ctx.fill();
        ctx.restore();
    }
}
