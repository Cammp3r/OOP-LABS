export class Shape {
    constructor() {
        if (new.target === Shape) {
            throw new TypeError('Shape - абстрактний клас, створювати його напряму не можна');
        }
        this.xs = 0;
        this.ys = 0;
        this.xe = 0;
        this.ye = 0;
    }

    setStart(x, y) {
        this.xs = this.xe = x;
        this.ys = this.ye = y;
    }

    setEnd(x, y) {
        this.xe = x;
        this.ye = y;
    }
    
    trace(ctx) {
        throw new Error('trace() має бути перевизначений у нащадку');
    }

    show(ctx) {
        throw new Error('show() має бути перевизначений у нащадку');
    }

    showRubber(ctx) {
        ctx.save();
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.beginPath();
        this.trace(ctx);
        ctx.stroke();
        ctx.restore();
    }
}
